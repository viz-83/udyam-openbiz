import React from "react";

export default function ProgressBar({ step }) {
  const pct = Math.round((step/2)*100);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
        <div>Step {step} of 2</div>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div className="h-2 bg-blue-600 rounded transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
