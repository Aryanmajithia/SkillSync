import React from "react";
import { Lightbulb, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const ImprovementSuggestions = ({
  improvements,
  suggestions,
  issues,
  keywords,
}) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="w-6 h-6 text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Improvement Suggestions
        </h3>
      </div>

      <div className="space-y-6">
        {/* General Improvements */}
        {improvements && improvements.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              General Improvements
            </h4>
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  {getIcon(improvement.type || "suggestion")}
                  <div>
                    <p className="text-sm text-gray-700">
                      {improvement.message}
                    </p>
                    {improvement.suggestion && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Suggestion:</strong> {improvement.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formatting Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Formatting Suggestions
            </h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issues to Fix */}
        {issues && issues.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Issues to Address
            </h4>
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-700">{issue.message}</p>
                    {issue.fix && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>How to fix:</strong> {issue.fix}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyword Analysis */}
        {keywords && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Keyword Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Found Keywords ({keywords.found?.length || 0})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {keywords.found?.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Missing Keywords ({keywords.missing?.length || 0})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {keywords.missing?.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovementSuggestions;
