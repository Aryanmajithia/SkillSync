import React from "react";
import { Target, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const ATSScore = ({ score, breakdown, className = "" }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-yellow-100";
    if (score >= 70) return "bg-orange-100";
    return "bg-red-100";
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 80) return <Target className="w-5 h-5 text-yellow-600" />;
    if (score >= 70)
      return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">ATS Score</h3>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          {getScoreIcon(score)}
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${getScoreBgColor(score)}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {score >= 90
            ? "Excellent! Your resume is well-optimized for ATS systems."
            : score >= 80
            ? "Good! Your resume has good ATS compatibility."
            : score >= 70
            ? "Fair. Consider some improvements for better ATS performance."
            : "Needs improvement. Your resume may not pass ATS screening."}
        </p>
      </div>

      {breakdown && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Score Breakdown</h4>
          {Object.entries(breakdown).map(([category, categoryScore]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">
                {category.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBgColor(
                      categoryScore
                    )}`}
                    style={{ width: `${categoryScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {categoryScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSScore;
