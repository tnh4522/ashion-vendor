import React, { useEffect, useState } from 'react';
import API from "../../service/service.jsx";

const UserModal = ({ show, onClose, onSelect }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (show) {
            const fetchUsers = async () => {
                const response = await API.get('users/'); // Adjust the endpoint as needed
                setUsers(response.data);
            };
            fetchUsers();
        }
    }, [show]);

    return (
        <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Select User</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group">
                            {users.map(user => (
                                <li key={user.id} className="list-group-item" onClick={() => onSelect(user)}>
                                    {user.username} {/* Adjust based on user properties */}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;