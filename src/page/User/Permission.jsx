import {useEffect, useState} from "react";
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {Modal, Empty, Switch} from 'antd';

function Permission(props) {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const {user} = props;
    const [openModal, setOpenModal] = useState(false);

    const [permissions, setPermissions] = useState([]);
    const [availablePermissions, setAvailablePermissions] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get("/permissions/user/" + user.id + "/", {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.code === "token_not_valid") {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                setPermissions(response.data);
            } catch (error) {
                if (error.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
                console.error("Error fetching user data:", error);
            }
        };

        if (userData.access) {
            fetchUserData();
        }
    }, [userData.access, user.id, logout, openErrorNotification]);

    useEffect(() => {
        const fetchAvailablePermissions = async () => {
            try {
                const response = await API.get("/permissions/", {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.code === "token_not_valid") {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                const permissionsData = response.data.results || response.data;
                setAvailablePermissions(permissionsData);
            } catch (error) {
                if (error.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
                console.error("Error fetching available permissions:", error);
            }
        };

        if (userData.access) {
            fetchAvailablePermissions();
        }
    }, [userData.access, logout, openErrorNotification]);

    const handleSwitchChange = (permissionId) => {
        setPermissions((prevPermissions) =>
            prevPermissions.map((perm) =>
                perm.id === permissionId
                    ? {...perm, allowed: !perm.allowed}
                    : perm
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedPermissions = permissions.map((perm) => ({
            id: perm.id, // id của UserPermission
            allowed: perm.allowed,
        }));

        try {
            const response = await API.post(
                "/permissions/user/" + user.id + "/update/",
                updatedPermissions,
                {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 401 || response.code === "token_not_valid") {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }

            openSuccessNotification("Permissions updated successfully");
        } catch (error) {
            console.error("There was an error updating the permissions:", error);
            openErrorNotification("There was an error updating the permissions");
        }
    };

    const [addPermission, setAddPermission] = useState({
        permissionId: "",
        allowed: true,
    });

    const handleSubmitPermission = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/user-permissions/create/", {
                user: user.id,
                permission: addPermission.permissionId,
                allowed: addPermission.allowed,
            }, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401 || response.code === "token_not_valid") {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }

            // Cập nhật danh sách permissions sau khi thêm mới
            setPermissions((prev) => [...prev, response.data]);
            openSuccessNotification("Permission added successfully");
            setOpenModal(false);
        } catch (error) {
            console.error("There was an error adding the permission:", error);
            openErrorNotification("There was an error adding the permission");
        }
    }

    return (
        <div className="card-body">
            <Modal
                open={openModal}
                width={600}
                style={{
                    top: 120,
                }}
                footer={null}
                onCancel={() => setOpenModal(false)}
            >
                <div className="card-body">
                    <h5 className="card-title">Add permissions</h5>
                </div>
                <hr className="my-0"/>
                {/* Form */}
                <div className="card-body">
                    <form id="formAddPermission" method="POST" onSubmit={handleSubmitPermission}>
                        <div className="mb-3">
                            <label htmlFor="permissionId" className="form-label">Permission</label>
                            <select
                                id="permissionId"
                                name="permissionId"
                                className="form-select"
                                onChange={(e) =>
                                    setAddPermission((prev) => ({...prev, permissionId: e.target.value}))}
                                required
                            >
                                <option value="">Select a permission</option>
                                {availablePermissions.map((permission) => (
                                    <option key={permission.id} value={permission.id}>
                                        {permission.description} - {permission.action}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-2 text-end">
                            <button type="reset" className="btn btn-outline-secondary me-2"
                                    onClick={() => setOpenModal(false)}>Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">Add permission</button>
                        </div>
                    </form>
                </div>
            </Modal>
            <div className="mt-3" style={{textAlign: "end"}}>
                {permissions.length ? (
                    <button type="submit" className="btn btn-primary me-2">
                        Update permissions
                    </button>
                ) : null}
                <button className="btn btn-dark" onClick={() => setOpenModal(true)} type={"button"}>
                    <i className="fa-solid fa-plus"></i> Add permission
                </button>
            </div>
            <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                {permissions.length ? (
                    <div className="table-responsive text-nowrap">
                        <table className="table my-4">
                            <thead>
                            <tr>
                                <th>Permission</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                            {permissions.map((userPermission) => (
                                <tr key={userPermission.id}>
                                    <td>{userPermission.permission.description} - {userPermission.permission.action}</td>
                                    <td>
                                        <Switch
                                            checked={userPermission.allowed}
                                            onChange={() => handleSwitchChange(userPermission.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Empty description="No permissions found"/>
                )}
                <div className="mt-3" style={{textAlign: "end"}}>
                    {permissions.length ? (
                        <button type="submit" className="btn btn-primary me-2">
                            Update permissions
                        </button>
                    ) : null}
                    <button className="btn btn-dark" onClick={() => setOpenModal(true)} type={"button"}>
                        <i className="fa-solid fa-plus"></i> Add permission
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Permission;
