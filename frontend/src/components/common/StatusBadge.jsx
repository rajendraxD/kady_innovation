import React from 'react';
import { getStageColor } from '../../utils/formatters';

export const StatusBadge = ({ stage, customLabel, size = 'sm', className = '' }) => {
  const colorClasses = getStageColor(stage);
  const formattedLabel =
    customLabel ||
    (stage
      ? stage
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Unknown');

  const sizeClasses =
    size === 'xs'
      ? 'px-2 py-0.5 text-xs font-medium'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs transition-colors ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {formattedLabel}
    </span>
  );
};
