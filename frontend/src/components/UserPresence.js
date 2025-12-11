import React from 'react';
import { FiUsers } from 'react-icons/fi';
import './UserPresence.css';

const UserPresence = ({ activeUsers = [] }) => {
    if (activeUsers.length === 0) {
        return null;
    }

    return (
        <div className="user-presence">
            <div className="presence-header">
                <FiUsers size={16} />
                <span>Active Users ({activeUsers.length})</span>
            </div>

            <div className="presence-list">
                {activeUsers.map((user, index) => (
                    <div key={user.userId || index} className="presence-item">
                        <div className="presence-avatar">
                            {user.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="presence-name">{user.userName || 'Unknown'}</span>
                        <div className="presence-indicator"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserPresence;
