import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import api from "../lib/axios";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

function StripePremiumPayment({ interviewId, amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create payment intent
      const { data } = await api.post("/api/payments/create-payment-intent", {
        interviewId,
        amount,
      });
      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        // 3. Confirm payment with backend
        await api.post("/api/payments/confirm-payment", {
          interviewId,
          paymentIntentId: result.paymentIntent.id,
        });

        setSuccess(true);
        setLoading(false);
        toast.success("Payment successful! Premium features unlocked.");
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your premium features are now unlocked. Enjoy your enhanced
            experience!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Premium Interview Access
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Unlock premium AI interview features for just ${amount}
        </p>
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Card Details
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" disabled={!stripe || loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount}`
          )}
        </Button>
      </form>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Your payment is secure and encrypted. We never store your card details.
      </div>
    </div>
  );
}

export default StripePremiumPayment;
