import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'aura-btn-sm' : size === 'lg' ? 'aura-btn-lg' : '';
  const variantClass =
    variant === 'primary' ? 'aura-btn-primary' :
    variant === 'secondary' ? 'aura-btn-secondary' :
    variant === 'ghost' ? 'aura-btn-ghost' :
    variant === 'danger' ? 'aura-btn-danger' :
    variant === 'icon' ? 'aura-btn-icon' : 'aura-btn-primary';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`aura-btn ${variantClass} ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {children}
    </button>
  );
};