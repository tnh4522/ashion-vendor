import {useState, useEffect} from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {useNavigate} from "react-router-dom";
import dataPermission from '../../constant/data-permission.js';

const CreateRole = () => {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [],
    });

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await API.get('roles/', {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                });
                if (response.status === 200) {
                    setRoles(response.data.results);
                }
            } catch (error) {
                console.error('There was an error fetching roles:', error);
            }
        };
        fetchRoles();
    }, [userData.access]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePermissionChange = (e) => {
        const {value, checked} = e.target;
        setFormData((prevFormData) => {
            let permissions = [...prevFormData.permissions];
            if (checked) {
                if (!permissions.includes(value)) {
                    permissions.push(value);
                }
            } else {
                permissions = permissions.filter((perm) => perm !== value);
            }
            return {...prevFormData, permissions};
        });
    };

    const handleRoleSelect = async (e) => {
        const roleId = e.target.value;
        if (roleId) {
            try {
                const response = await API.get(`roles/${roleId}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                });
                if (response.status === 200) {
                    console.log('API permissions:', response.data.permissions_display);

                    const rolePermissions = response.data.permissions_display; // Now in 'model:action' format

                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        permissions: rolePermissions,
                    }));
                }
            } catch (error) {
                console.error('There was an error fetching role permissions:', error);
            }
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                permissions: [],
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('roles/', formData, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            if (response.status === 201) {
                openSuccessNotification('Role created successfully');
                navigate('/role');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('There was an error creating the role:', error);
            openErrorNotification('There was an error creating the role');
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <h5 className="card-header">Create Role</h5>
                        <hr className="my-0"/>
                        <div className="card-body">
                            <form id="formCreateRole" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Role Name */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="name" className="form-label">Role Name</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {/* Select Existing Role */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="existingRole" className="form-label">Copy Permissions From
                                            Existing Role</label>
                                        <select
                                            className="form-select"
                                            id="existingRole"
                                            name="existingRole"
                                            onChange={handleRoleSelect}
                                        >
                                            <option value="">Select a role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Description */}
                                    <div className="mb-3 col-md-12">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    {/* Permissions */}
                                    <div className="mb-3 col-md-12">
                                        <h5 className='mt-2'>Permissions</h5>
                                        <hr/>
                                        {dataPermission.map((modelPermission, modelIndex) => (
                                            <div key={modelIndex}>
                                                <label className="form-label">
                                                    {modelPermission.model.charAt(0).toUpperCase() + modelPermission.model.slice(1)} Permissions
                                                </label>
                                                {modelPermission.action.map((actionItem, actionIndex) => {
                                                    const permissionValue = `${modelPermission.model}:${actionItem.name}`;
                                                    return (
                                                        <div className="form-check" key={actionIndex}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`${modelPermission.model}-${actionItem.name}`}
                                                                value={permissionValue}
                                                                onChange={handlePermissionChange}
                                                                checked={formData.permissions.includes(permissionValue)}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`${modelPermission.model}-${actionItem.name}`}>
                                                                {actionItem.description}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                                <hr/>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2">
                                        <button type="submit" className="btn btn-primary me-2">Create Role</button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/roles')}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRole;
