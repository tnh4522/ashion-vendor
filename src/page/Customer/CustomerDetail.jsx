import { useEffect, useState } from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { Tabs } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";

function CustomerDetail() {
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const { userData, logout } = useUserContext();
    const navigator = useNavigate();
    const customer_id = useParams().id;

    const [customer, setCustomer] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
    });
    const [addressData, setAddressData] = useState({
        id: null,
        full_name: '',
        phone_number: '',
        street_address: '',
        city: '',
        province: '',
        postal_code: '',
        country: 'Vietnam',
    });

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await API.get(`/customer/${customer_id}/`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.code === 'token_not_valid') {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                setCustomer(response.data);
                setFormData({
                    first_name: response.data.first_name || "",
                    last_name: response.data.last_name || "",
                    email: response.data.email || "",
                    phone_number: response.data.phone_number || "",
                });
                if (response.data.address) {
                    setAddressData({
                        id: response.data.address.id || null,
                        full_name: response.data.address.full_name || '',
                        phone_number: response.data.address.phone_number || '',
                        street_address: response.data.address.street_address || '',
                        city: response.data.address.city || '',
                        province: response.data.address.province || '',
                        postal_code: response.data.address.postal_code || '',
                        country: response.data.address.country || 'Vietnam',
                    });
                }
            } catch (error) {
                console.error("Error fetching customer data:", error);
                if (error.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
            }
        };

        if (userData.access) {
            fetchCustomerData();
        }
    }, [userData.access]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = {
                ...formData,
                address: addressData.id || null,
            };

            if (addressData.id) {
                await API.put(`/address/${addressData.id}/`, addressData, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                        "Content-Type": "application/json",
                    },
                });
            } else {
                const addressResponse = await API.post(`/address/`, addressData, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                        "Content-Type": "application/json",
                    },
                });
                formDataToSend.address = addressResponse.data.id;
            }

            const response = await API.put(`/customer/${customer_id}/`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "application/json",
                },
            });

            setCustomer(response.data);
            openSuccessNotification("Customer updated successfully!");
            navigator("/customers");
        } catch (error) {
            console.error("Error updating customer data:", error);
            openErrorNotification("Failed to update customer.");
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <Link to={"/customers"} className="btn btn-primary mb-4">
                        <i className="bx bx-arrow-back me-2"></i>
                        Back to Customers
                    </Link>
                    {/* Customer Details */}
                    <div className="card mb-4">
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            style={{ margin: '1.5rem 1rem' }}
                        >
                            <Tabs.TabPane tab="Customer Details" key="1">
                                <div className="card-body">
                                    <form id="formCustomerSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* First Name */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="first_name" className="form-label">First Name</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="first_name"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Last Name */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="last_name" className="form-label">Last Name</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="last_name"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Email */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input
                                                    className="form-control"
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Phone Number */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="phone_number" className="form-label">Phone Number</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="phone_number"
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Address Information" key="2">
                                <div className="card-body">
                                    <div className="row">
                                        {/* Full Name */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="full_name" className="form-label">Full Name</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="full_name"
                                                name="full_name"
                                                value={addressData.full_name}
                                                onChange={handleAddressChange}
                                                required
                                            />
                                        </div>
                                        {/* Phone Number */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="address_phone_number" className="form-label">Phone Number</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="address_phone_number"
                                                name="phone_number"
                                                value={addressData.phone_number}
                                                onChange={handleAddressChange}
                                                required
                                            />
                                        </div>
                                        {/* Street Address */}
                                        <div className="mb-3 col-md-12">
                                            <label htmlFor="street_address" className="form-label">Street Address</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="street_address"
                                                name="street_address"
                                                value={addressData.street_address}
                                                onChange={handleAddressChange}
                                                required
                                            />
                                        </div>
                                        {/* City */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="city" className="form-label">City</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={addressData.city}
                                                onChange={handleAddressChange}
                                                required
                                            />
                                        </div>
                                        {/* Province */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="province" className="form-label">Province</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="province"
                                                name="province"
                                                value={addressData.province}
                                                onChange={handleAddressChange}
                                                required
                                            />
                                        </div>
                                        {/* Postal Code */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="postal_code" className="form-label">Postal Code</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="postal_code"
                                                name="postal_code"
                                                value={addressData.postal_code}
                                                onChange={handleAddressChange}
                                                required
                                            />
                                        </div>
                                        {/* Country */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="country" className="form-label">Country</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="country"
                                                name="country"
                                                value={addressData.country}
                                                onChange={handleAddressChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                        <div className="m-3 text-end">
                            <button type="reset" className="btn btn-outline-secondary me-2" onClick={() => navigator('/customers')}>Cancel</button>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerDetail;
