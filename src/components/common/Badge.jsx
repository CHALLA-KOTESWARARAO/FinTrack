import React from 'react';

export const Badge = ({ children, variant = 'info' }) => {
  return <span className={`badge badge-${variant}`}>{children}</span>;
};
