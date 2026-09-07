import React from 'react';

export const StatCard = ({ icon, label, value, colorClass = 'primary' }) => {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${colorClass}`}>
        {icon}
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};
