import React from "react";

const Progress = React.forwardRef(
  ({ value, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full bg-gray-200 rounded-full h-2 ${className}`}
        {...props}
      >
        <div
          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
