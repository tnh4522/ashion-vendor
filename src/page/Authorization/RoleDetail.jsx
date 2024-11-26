import {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {Table, Switch, Empty} from "antd";
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import dataPermission from '../../constant/data-permission.js';

const RoleDetail = () => {
    const {id} = useParams();
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();

    const [roleDetails, setRoleDetails] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoleDetails = async () => {
            try {
                const response = await API.get(`roles/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });
                if (response.status === 200) {
                    setRoleDetails(response.data);
                    // Set initial permissions and mark them as allowed if they exist in permissions_display
                    const permissionsWithAllowedState = dataPermission.flatMap(model =>
                        model.action.map(action => ({
                            model: model.model,
                            action: action.name,
                            description: action.description,
                            allowed: response.data.permissions_display.includes(`${model.model}:${action.name}`)
                        }))
                    );
                    setPermissions(permissionsWithAllowedState);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    openErrorNotification("Unauthorized access. Please log in again.");
                    logout();
                } else {
                    openErrorNotification("Error fetching role details.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoleDetails();
    }, [id, userData.access, logout, openErrorNotification]);

    const handleSwitchChange = (permissionIndex) => {
        setPermissions((prevPermissions) => {
            const updatedPermissions = [...prevPermissions];
            updatedPermissions[permissionIndex].allowed = !updatedPermissions[permissionIndex].allowed;
            return updatedPermissions;
        });
    };

    const handleUpdatePermissions = async () => {
        try {
            const updatedPermissions = permissions
                .filter(perm => perm.allowed)
                .map(perm => `${perm.model}:${perm.action}`);

            const response = await API.post(
                `/roles/${id}/update-permissions/`,
                {permissions: updatedPermissions},
                {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                openSuccessNotification("Permissions updated successfully.");
            }
        } catch (error) {
            openErrorNotification("There was an error updating the permissions.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!roleDetails) {
        return <div>Role not found or an error occurred.</div>;
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <Link to={"/roles"} className="btn btn-primary mb-4">
                        <i className="bx bx-arrow-back me-2"></i>
                        Back to List of Roles
                    </Link>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="mb-2" style={{textAlign: "end"}}>
                                <button
                                    className={"btn btn-info me-2"}
                                    type="primary"
                                    onClick={() => navigate("/create-role")}
                                >
                                    Create New Role
                                </button>
                                <button type="primary"
                                        className="btn btn-primary"
                                        onClick={handleUpdatePermissions}
                                >
                                    Save Changes
                                </button>
                            </div>
                            <div className="row">
                                {/* Role Name */}
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="name" className="form-label">Role Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={roleDetails.name}
                                        readOnly
                                    />
                                </div>
                                {/* Role Description */}
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={roleDetails.description}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <Table
                                dataSource={permissions}
                                rowKey={(record) => `${record.model}:${record.action}`}
                                columns={[
                                    {
                                        title: "Permission",
                                        dataIndex: "description",
                                        key: "description",
                                        render: (text, record) => (
                                            <span>
                                                {text} - {record.action}
                                            </span>
                                        ),
                                    },
                                    {
                                        title: "Status",
                                        dataIndex: "allowed",
                                        key: "allowed",
                                        render: (allowed, record, index) => (
                                            <Switch
                                                checked={allowed}
                                                onChange={() => handleSwitchChange(index)}
                                            />
                                        ),
                                    },
                                ]}
                                locale={{emptyText: <Empty description="No permissions assigned"/>}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleDetail;
