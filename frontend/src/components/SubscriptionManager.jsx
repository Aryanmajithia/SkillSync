import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Crown,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
} from "lucide-react";
import api from "../lib/axios";
import StripePremiumPayment from "./StripePremiumPayment";

const SubscriptionManager = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.get("/api/payments/subscription-status");
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    fetchSubscriptionStatus();
    toast.success("Premium features unlocked!");
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upgrade to Premium
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPayment(false)}
          >
            Cancel
          </Button>
        </div>
        <StripePremiumPayment amount={19.99} onSuccess={handlePaymentSuccess} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Crown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Subscription Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your premium features
            </p>
          </div>
        </div>
        {subscriptionStatus?.isPremium && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Premium Active</span>
          </div>
        )}
      </div>

      {subscriptionStatus?.isPremium ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Premium Features Active
                </span>
              </div>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Unlimited AI Interviews</li>
                <li>• Advanced Resume Analysis</li>
                <li>• Priority Job Matching</li>
                <li>• Premium Support</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Subscription Details
                </span>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>
                  <span className="font-medium">Valid until:</span>{" "}
                  {subscriptionStatus.premiumUntil
                    ? new Date(
                        subscriptionStatus.premiumUntil
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Last payment:</span>{" "}
                  {subscriptionStatus.lastPayment
                    ? new Date(
                        subscriptionStatus.lastPayment
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <XCircle className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Free Plan
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upgrade to premium to unlock advanced features and unlimited
              access.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Free Features:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Basic Resume Analysis</li>
                  <li>• Limited Job Applications</li>
                  <li>• Standard Support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Premium Features:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Unlimited AI Interviews</li>
                  <li>• Advanced Resume Analysis</li>
                  <li>• Priority Job Matching</li>
                  <li>• Premium Support</li>
                </ul>
              </div>
            </div>
            <Button onClick={() => setShowPayment(true)} className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade to Premium - $19.99/month
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
