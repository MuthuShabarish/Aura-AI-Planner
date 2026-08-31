import React from 'react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      {title && <h4 className="text-base font-bold text-gray-900 dark:text-white">{title}</h4>}
      {description && <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mt-1 mb-4">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="aura-btn aura-btn-primary aura-btn-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};