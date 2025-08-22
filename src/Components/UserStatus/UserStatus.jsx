import React, { useState, useEffect } from 'react';
import { authUtils } from '../../utils/auth';
import './UserStatus.css';

const UserStatus = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUser = authUtils.getUser();
    setUser(currentUser);
    setIsAdmin(authUtils.isAdmin());
  }, []);

  if (!user) {
    return (
      <div className="user-status guest">
        <span className="status-badge guest">👤 Guest</span>
      </div>
    );
  }

  return (
    <div className={`user-status ${isAdmin ? 'admin' : 'user'}`}>
      <div className="user-info">
        <span className={`status-badge ${isAdmin ? 'admin' : 'user'}`}>
          {isAdmin ? '👑 Admin' : '👤 User'}
        </span>
        <span className="username">{user.username}</span>
      </div>
      <div className="user-details">
        <small>{user.email}</small>
      </div>
    </div>
  );
};

export default UserStatus;