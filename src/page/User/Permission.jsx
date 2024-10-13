import { useEffect, useState } from "react";
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";

function Permission(props) {
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const { user } = props;

    const [permissions, setPermissions] = useState([]);
    const [models, setModels] = useState({});

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
        const initialModels = {};

        permissions.forEach((permission) => {
            const { model_name, action, allowed } = permission;

            if (!initialModels[model_name]) {
                initialModels[model_name] = {};
            }

            initialModels[model_name][action] = {
                allowed: allowed,
                id: permission.id,
            };
        });

        setModels(initialModels);
    }, [permissions]);

    const handleCheckboxChange = (model_name, action) => {
        setModels((prevModels) => ({
            ...prevModels,
            [model_name]: {
                ...prevModels[model_name],
                [action]: {
                    ...prevModels[model_name][action],
                    allowed: !prevModels[model_name][action]?.allowed,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedPermissions = [];

        Object.keys(models).forEach((model_name) => {
            Object.keys(models[model_name]).forEach((action) => {
                const permission = models[model_name][action];
                updatedPermissions.push({
                    id: permission.id,
                    model_name: model_name,
                    action: action,
                    allowed: permission.allowed,
                    user: user.id,
                });
            });
        });

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

    return (
        <div className="card-body">
            <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                <div className="table-responsive text-nowrap">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Permission</th>
                            <th>View</th>
                            <th>Create</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                        {Object.keys(models).map((model_name) => (
                            <tr key={model_name}>
                                <td>{model_name + " management"}</td>
                                {["view", "add", "change", "delete"].map((action) => (
                                    <td key={action}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={models[model_name][action]?.allowed || false}
                                            onChange={() => handleCheckboxChange(model_name, action)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-3" style={{ textAlign: "end" }}>
                    <button type="submit" className="btn btn-primary me-2">
                        Validate
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Permission;
