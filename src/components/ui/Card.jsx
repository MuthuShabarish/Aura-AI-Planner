import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-5',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`aura-card ${hover ? 'aura-card-hover cursor-pointer' : ''} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 ${className}`}>
    {children}
  </h3>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`pt-4 ${className}`}>
    {children}
  </div>
);