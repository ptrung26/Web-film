import React from "react";
import { useSelector } from "react-redux";

function Info() {
  const { user } = useSelector();
  return (
    <div className="Info">
      <h2 className="Info__heading">Account Settings</h2>
      <div className="Info__section">
        <h4 className="Info__section-title">Username</h4>
        <p className="Info__section-detail">Trung Phạm</p>
      </div>
      <div className="Info__section">
        <h4 className="Info__section-title">Username</h4>
        <p className="Info__section-detail">Trung Phạm</p>
      </div>
    </div>
  );
}

export default Info;
