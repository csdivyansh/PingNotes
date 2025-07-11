import React from "react";

const DashboardCard = ({ title, count, iconClass, color }) => {
  return (
    <div className={`card ${color}`}>
      <div>
        <p>{title}</p>
        <h2>{count}</h2>
      </div>
      <i className={`fas ${iconClass} icon`}></i>
    </div>
  );
};

export default DashboardCard;