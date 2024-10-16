import {useEffect, useState} from "react";
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {Modal} from 'antd';
import {Empty} from 'antd';

const MODEL_CHOICES = [
    'User',
    'Address',
    'Category',
    'Tag',
    'Product',
    'ProductImage',
    'Cart',
    'CartItem',
    'Order',
    'OrderItem',
    'Review',
    'ReviewImage',
    'Coupon',
    'LoyaltyPoint',
    'Transaction',
    'MessageThread',
    'Message',
    'Promotion',
    'Notification',
    'ReturnRequest',
    'ShippingMethod',
    'PaymentMethod',
];


function Permission(props) {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const {user} = props;
    const [openModal, setOpenModal] = useState(false);

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
            const {model_name, action, allowed} = permission;

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

    const [addPermission, setAddPermission] = useState({
        model_name: "",
        action: "",
        user: user.id,
        allowed: true,
    });

    const handleSubmitPermission = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("permissions/create/", addPermission, {
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
                width={1000}
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
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="model_name" className="form-label">Model name</label>
                                <select
                                    id="model_name"
                                    name="model_name"
                                    className="form-select"
                                    onChange={(e) =>
                                        setAddPermission((prev) => ({...prev, model_name: e.target.value}))}
                                    required
                                >
                                    <option value="">Select a model</option>
                                    {MODEL_CHOICES.map((model_name) => (
                                        <option key={model_name} value={model_name}>
                                            {model_name + " Management"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="action" className="form-label">Action</label>
                                <select id="action" name="action" className="form-select" required
                                        onChange={(e) =>
                                            setAddPermission((prev) => ({...prev, action: e.target.value}))}>
                                    <option value="">Select an action</option>
                                    {["view", "add", "change", "delete"].map((action) => (
                                        <option key={action} value={action}>
                                            {action.charAt(0).toUpperCase() + action.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
            <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                {permissions.length ? (
                    <div className="table-responsive text-nowrap">
                        <table className="table my-4">
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
