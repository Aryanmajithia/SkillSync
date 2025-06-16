import React from "react";
import { usePremium } from "../hooks/usePremium";
import { Button } from "./ui/button";
import { Crown, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumFeatureGuard = ({
  children,
  feature,
  fallback = null,
  showUpgradeButton = true,
}) => {
  const { checkPremiumAccess } = usePremium();
  const access = checkPremiumAccess(feature);

  if (access.hasAccess) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Premium Feature
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {access.message}
        </p>
        {showUpgradeButton && (
          <Link to="/subscription">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PremiumFeatureGuard;
