import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import api from "../lib/axios";

export const usePremium = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    } else {
      setIsPremium(false);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.get("/api/payments/subscription-status");
      const {
        isPremium: premiumStatus,
        premiumUntil,
        lastPayment,
      } = response.data;

      setIsPremium(premiumStatus);
      setSubscriptionData({
        isPremium: premiumStatus,
        premiumUntil,
        lastPayment,
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const checkPremiumAccess = (feature) => {
    if (!isPremium) {
      return {
        hasAccess: false,
        message: `Premium feature: ${feature}. Upgrade to access this feature.`,
        upgradeRequired: true,
      };
    }

    // Check if subscription is still valid
    if (subscriptionData?.premiumUntil) {
      const now = new Date();
      const premiumUntil = new Date(subscriptionData.premiumUntil);

      if (now > premiumUntil) {
        setIsPremium(false);
        return {
          hasAccess: false,
          message:
            "Your premium subscription has expired. Please renew to continue.",
          upgradeRequired: true,
        };
      }
    }

    return {
      hasAccess: true,
      message: "Premium access granted",
      upgradeRequired: false,
    };
  };

  return {
    isPremium,
    loading,
    subscriptionData,
    fetchSubscriptionStatus,
    checkPremiumAccess,
  };
};
