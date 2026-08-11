import React from 'react';

export const EmptyState = ({ icon: Icon, title, description, actionButton }) => {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={28} />
        </div>
      )}
      <h4 className="empty-state-title">{title}</h4>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};
