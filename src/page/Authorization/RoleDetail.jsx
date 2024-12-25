import {useState, useEffect} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import {Table, Switch, Empty} from "antd";
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import dataPermission from '../../constant/data-permission.js';

const RoleDetail = () => {
    const {id} = useParams();
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigator = useNavigate();

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

                    // Group permissions by model with safeguards
                    const permissionsByModel = dataPermission.map((model) => ({
                        model: model.model,
                        permissions: Array.isArray(model.actions) ? model.actions.map((action) => ({
                            action: action.name,
                            description: action.description,
                            allowed: Array.isArray(response.data.permissions_display)
                                ? response.data.permissions_display.includes(`${model.model}:${action.name}`)
                                : false,
                        })) : [],
                    }));
                    setPermissions(permissionsByModel);
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

    const handleSwitchChange = (modelIndex, permissionIndex) => {
        setPermissions((prevPermissions) => {
            const updatedPermissions = [...prevPermissions];
            const updatedModel = {...updatedPermissions[modelIndex]};
            const updatedPermissionsList = [...updatedModel.permissions];
            updatedPermissionsList[permissionIndex] = {
                ...updatedPermissionsList[permissionIndex],
                allowed: !updatedPermissionsList[permissionIndex].allowed,
            };
            updatedModel.permissions = updatedPermissionsList;
            updatedPermissions[modelIndex] = updatedModel;
            return updatedPermissions;
        });
    };

    const handleUpdatePermissions = async () => {
        try {
            const updatedPermissions = permissions
                .flatMap((model) =>
                    model.permissions
                        .filter((perm) => perm.allowed)
                        .map((perm) => `${model.model}:${perm.action}`)
                );

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
                navigator("/roles");
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

    const renderButton = () => {
        if(roleDetails.name !== 'ADMIN' && roleDetails.name !== 'MANAGER' && roleDetails.name !== 'SELLER') {
            return (
                <button
                    type="primary"
                    className="btn btn-primary m-2"
                    onClick={handleUpdatePermissions}
                >
                    Save Changes
                </button>
            )
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="mb-2 d-flex justify-content-between">
                                <Link to={"/roles"} className="btn btn-secondary m-2">
                                    <i className="bx bx-arrow-back me-2"></i>
                                    Back
                                </Link>
                                {renderButton()}
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
                            {permissions.map((model, modelIndex) => (
                                <div key={model.model}>
                                    <h5 style={{marginTop: '20px'}}>{String(model.model).toUpperCase() + ' MANAGEMENT'}</h5>
                                    <Table
                                        dataSource={model.permissions.map((perm, permIndex) => ({
                                            ...perm,
                                            modelIndex,
                                            permIndex,
                                        }))}
                                        rowKey={(record) => `${model.model}:${record.action}`}
                                        columns={[
                                            {
                                                title: "Permission",
                                                dataIndex: "description",
                                                key: "description",
                                                width: "80%",
                                                render: (text) => <span>{text}</span>,
                                            },
                                            // {
                                            //     title: "Action",
                                            //     dataIndex: "action",
                                            //     key: "action",
                                            //     width: "20%",
                                            //     render: (action) => <span>{action}</span>,
                                            // },
                                            {
                                                title: "Status",
                                                dataIndex: "allowed",
                                                key: "allowed",
                                                width: "20%",
                                                render: (allowed, record) => (
                                                    <Switch
                                                        checked={allowed}
                                                        onChange={() =>
                                                            handleSwitchChange(record.modelIndex, record.permIndex)
                                                        }
                                                    />
                                                ),
                                            },
                                        ]}
                                        pagination={false}
                                        locale={{emptyText: <Empty description="No permissions assigned"/>}}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleDetail;
