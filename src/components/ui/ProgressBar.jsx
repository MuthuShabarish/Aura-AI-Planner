import React from 'react';

export const ProgressBar = ({
  progress = 0,
  color = 'purple', // 'purple' | 'green' | 'blue' | 'orange' | 'pink'
  height = 'h-2',
  showText = false,
  className = ''
}) => {
  const clampedProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  const bgMap = {
    purple: 'var(--aura-primary)',
    green: 'var(--aura-secondary)',
    blue: 'var(--aura-info)',
    orange: 'var(--aura-accent)',
    pink: 'var(--aura-pink)'
  };

  const barColor = bgMap[color] || 'var(--aura-primary)';

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
          <span>Progress</span>
          <span>{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden ${height}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};