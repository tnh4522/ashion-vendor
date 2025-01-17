import {useState, useEffect} from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {Link, useNavigate} from "react-router-dom";
import dataPermission from '../../constant/data-permission.js';
import dataPermissionMin from '../../constant/data-permission-min.js';

const CreateRole = () => {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [],
    });


    useEffect(() => {
        const defaultPermissions = dataPermissionMin.flatMap((modelPermission) =>
            modelPermission.actions.map((actionItem) => `${modelPermission.model}:${actionItem.name}`)
        );
        setFormData((prevFormData) => ({
            ...prevFormData,
            permissions: defaultPermissions,
        }));
    }, []);

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
                    const rolePermissions = response.data.permissions_display; // Format 'model:action'
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
                navigate('/roles');
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
                        <div className="card-body">
                            <form id="formCreateRole" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="mb-2 d-flex justify-content-between">
                                        <Link to={"/roles"} className="btn btn-secondary m-2">
                                            <i className="bx bx-arrow-back me-2"></i>
                                            Back
                                        </Link>
                                        <button type="submit" className="btn btn-primary m-2">Create Role</button>
                                    </div>
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
                                            <option value="1">ADMIN</option>
                                            <option value="2">MANAGER</option>
                                            <option value="3">SELLER</option>
                                        </select>
                                    </div>
                                    {/* Permissions */}
                                    <div className="mb-3 col-md-12">
                                        {dataPermission.map((modelPermission, modelIndex) => (
                                            <div key={modelIndex} className="mb-4">
                                                <h5>{modelPermission.model.charAt(0).toUpperCase() + modelPermission.model.slice(1)} Permissions</h5>
                                                <table className="table table-bordered table-hover">
                                                    <thead>
                                                    <tr>
                                                        <th scope="col">Permission Description</th>
                                                        <th scope="col"
                                                            style={{width: "100px", textAlign: "center"}}>Allow
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {modelPermission.actions.map((actionItem, actionIndex) => {
                                                        const permissionValue = `${modelPermission.model}:${actionItem.name}`;
                                                        return (
                                                            <tr key={actionIndex}>
                                                                <td>{actionItem.description}</td>
                                                                <td style={{textAlign: "center", width: "100px"}}>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`${modelPermission.model}-${actionItem.name}`}
                                                                        value={permissionValue}
                                                                        onChange={handlePermissionChange}
                                                                        checked={formData.permissions.includes(permissionValue)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2" style={{textAlign: "end"}}>
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