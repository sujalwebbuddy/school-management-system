import React from 'react';
import './SubscriptionStatus.css';
import { getPlanById, getPlanDisplayName } from '../constants/subscriptionPlans';

const SubscriptionStatus = ({ organization, showDetails = true }) => {
  if (!organization) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#28a745';
      case 'inactive':
        return '#dc3545';
      case 'trial':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const tierInfo = {
    name: getPlanDisplayName(organization.subscriptionTier),
    color: getPlanById(organization.subscriptionTier)?.borderColor || '#6c757d'
  };

  return (
    <div className="subscription-status">
      <div className="status-header">
        <div className="status-indicator">
          <div
            className="status-dot"
            style={{ backgroundColor: getStatusColor(organization.subscriptionStatus) }}
          />
          <span className="status-text">
            {organization.subscriptionStatus || 'Unknown'}
          </span>
        </div>
        <div className="tier-badge" style={{ backgroundColor: tierInfo.color }}>
          {tierInfo.name}
        </div>
      </div>

      {showDetails && (
        <div className="status-details">
          <div className="detail-item">
            <span className="detail-label">Organization:</span>
            <span className="detail-value">{organization.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Domain:</span>
            <span className="detail-value">@{organization.domain}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Users:</span>
            <span className="detail-value">
              {organization.userCount || 0} / {getPlanById(organization.subscriptionTier)?.maxUsers || organization.maxUsers}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Features:</span>
            <div className="features-list">
              {organization.features?.map((feature, index) => (
                <span key={index} className="feature-chip">
                  {feature.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
