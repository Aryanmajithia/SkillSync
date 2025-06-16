const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const auth = require("../middleware/auth");
const User = require("../models/User");
const Interview = require("../models/Interview");

// Create payment intent for premium interview
router.post("/create-payment-intent", auth, async (req, res) => {
  try {
    const { interviewId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        interviewId: interviewId || "premium_interview",
        userId: req.user.userId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({ message: "Error creating payment intent" });
  }
});

// Confirm payment
router.post("/confirm-payment", auth, async (req, res) => {
  try {
    const { interviewId, paymentIntentId } = req.body;

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Update user subscription status
    await User.findByIdAndUpdate(req.user.userId, {
      $set: {
        "subscription.isPremium": true,
        "subscription.premiumUntil": new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ), // 30 days
        "subscription.lastPayment": new Date(),
        "subscription.paymentIntentId": paymentIntentId,
      },
    });

    // If interviewId is provided, update the interview
    if (interviewId) {
      await Interview.findByIdAndUpdate(interviewId, {
        $set: {
          stripeSessionId: paymentIntentId,
          status: "paid",
        },
      });
    }

    res.json({ message: "Payment confirmed successfully" });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ message: "Error confirming payment" });
  }
});

// Create subscription
router.post("/create-subscription", auth, async (req, res) => {
  try {
    const { priceId } = req.body;

    // Get user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: req.user.userId,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Subscription creation error:", error);
    res.status(500).json({ message: "Error creating subscription" });
  }
});

// Get subscription status
router.get("/subscription-status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      isPremium: user.subscription?.isPremium || false,
      premiumUntil: user.subscription?.premiumUntil,
      lastPayment: user.subscription?.lastPayment,
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    res.status(500).json({ message: "Error fetching subscription status" });
  }
});

// Cancel subscription
router.post("/cancel-subscription", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user subscription status
    await User.findByIdAndUpdate(req.user.userId, {
      $set: {
        "subscription.isPremium": false,
        "subscription.canceledAt": new Date(),
      },
    });

    res.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    res.status(500).json({ message: "Error canceling subscription" });
  }
});

// Webhook handler for Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // Handle successful checkout
        await handleCheckoutSessionCompleted(session);
        break;
      case "invoice.payment_succeeded":
        const invoice = event.data.object;
        // Handle successful subscription payment
        await handleInvoicePaymentSucceeded(invoice);
        break;
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        // Handle subscription cancellation
        await handleSubscriptionDeleted(subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// Helper functions for webhook handling
async function handleCheckoutSessionCompleted(session) {
  try {
    const userId = session.metadata.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          "subscription.isPremium": true,
          "subscription.premiumUntil": new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
          "subscription.lastPayment": new Date(),
          "subscription.stripeCustomerId": session.customer,
        },
      });
    }
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  try {
    // Find user by Stripe customer ID and update subscription
    const user = await User.findOne({
      "subscription.stripeCustomerId": invoice.customer,
    });
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          "subscription.isPremium": true,
          "subscription.premiumUntil": new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
          "subscription.lastPayment": new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const user = await User.findOne({
      "subscription.stripeCustomerId": subscription.customer,
    });
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          "subscription.isPremium": false,
          "subscription.canceledAt": new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}

module.exports = router;
