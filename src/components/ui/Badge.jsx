import React from 'react';

export const Badge = ({
  children,
  variant = 'purple', // 'purple' | 'green' | 'blue' | 'orange' | 'pink' | 'gray'
  icon: Icon,
  className = ''
}) => {
  const variantClass = `aura-badge-${variant}`;

  return (
    <span className={`aura-badge ${variantClass} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};