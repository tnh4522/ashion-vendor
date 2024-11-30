import {useEffect, useState} from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {Tabs, Tag} from 'antd';
import {Link, useNavigate, useParams} from "react-router-dom";

function MyStore() {
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const {userData, logout} = useUserContext();
    const navigator = useNavigate();
    const store_id = 1;

    const [store, setStore] = useState(null);
    const [formData, setFormData] = useState({
        store_name: "",
        store_description: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
        policies: "",
        return_policy: "",
        shipping_policy: "",
        total_sales: "",
        joined_date: "",
        is_verified: false,
        seller_rating: "",
    });

    const [storeLogoFile, setStoreLogoFile] = useState(null);
    const [storeLogoPreview, setStoreLogoPreview] = useState(null);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await API.get(`/stores/${store_id}/`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.data.code === 'token_not_valid') {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                setStore(response.data);
                setFormData({
                    store_name: response.data.store_name || "",
                    store_description: response.data.store_description || "",
                    address: response.data.address || "",
                    city: response.data.city || "",
                    state: response.data.state || "",
                    country: response.data.country || "",
                    zip_code: response.data.zip_code || "",
                    policies: response.data.policies || "",
                    return_policy: response.data.return_policy || "",
                    shipping_policy: response.data.shipping_policy || "",
                    total_sales: response.data.total_sales || "",
                    joined_date: response.data.joined_date || "",
                    is_verified: response.data.is_verified || false,
                    seller_rating: response.data.seller_rating || "",
                });
                if (response.data.store_logo) {
                    setStoreLogoPreview(convertUrl(response.data.store_logo));
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
                if (error.response && error.response.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
            }
        };

        if (userData.access) {
            fetchStoreData();
        }
    }, [userData.access]);

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            setStoreLogoFile(file);
            setStoreLogoPreview(URL.createObjectURL(file));
        }
    };

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("store_name", formData.store_name);
            formDataToSend.append("store_description", formData.store_description);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("city", formData.city);
            formDataToSend.append("state", formData.state);
            formDataToSend.append("country", formData.country);
            formDataToSend.append("zip_code", formData.zip_code);
            formDataToSend.append("policies", formData.policies);
            formDataToSend.append("return_policy", formData.return_policy);
            formDataToSend.append("shipping_policy", formData.shipping_policy);
            formDataToSend.append("notification_settings", formData.notification_settings);

            if (storeLogoFile instanceof File) {
                formDataToSend.append("store_logo", storeLogoFile);
            }

            const response = await API.put(`/stores/${store_id}/`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setStore(response.data);
            openSuccessNotification("Store updated successfully!");
            navigator("/stores");
        } catch (error) {
            console.error("Error updating store data:", error);
            openErrorNotification("Failed to update store.");
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    {/* Store Details */}
                    <div className="card mb-4">
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            style={{margin: '1.5rem 1rem'}}
                        >
                            <Tabs.TabPane tab="Details" key="1">
                                <div className="card-body">
                                    <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Store Name */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="store_name" className="form-label">
                                                    Store Name
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="store_name"
                                                    name="store_name"
                                                    value={formData.store_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Store Logo */}
                                            <div className="mb-3 col-md-6 text-center">
                                                {storeLogoPreview && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={storeLogoPreview}
                                                            alt="Store Logo"
                                                            style={{maxWidth: "200px", maxHeight: "200px"}}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="store_logo" className="form-label">
                                                    Store Logo
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    id="store_logo"
                                                    name="store_logo"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            {/* Store Description */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="store_description" className="form-label">
                                                    Store Description
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="store_description"
                                                    name="store_description"
                                                    rows="3"
                                                    value={formData.store_description}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Save changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Contact" key="2">
                                <div className="card-body">
                                    <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="email" className="form-label">
                                                    Mail Contact
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="email"
                                                    name="email"
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="website" className="form-label">
                                                    Website
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="website"
                                                    name="website"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="phone" className="form-label">
                                                    Phone Contact
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="phone"
                                                    name="phone"
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="fax" className="form-label">
                                                    Fax
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="fax"
                                                    name="fax"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Save changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Address" key="3">
                                <div className="card-body">
                                    <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Address */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="address" className="form-label">
                                                    Address
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="address"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="city" className="form-label">
                                                    City
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="state" className="form-label">
                                                    State
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="country" className="form-label">
                                                    Country
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="country"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="zip_code" className="form-label">
                                                    Zip Code
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="zip_code"
                                                    name="zip_code"
                                                    value={formData.zip_code}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Save changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Settings" key="4">
                                <div className="card-body">
                                    <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Enable Notifications */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="notification_settings" className="form-label">
                                                    Enable Notifications
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="notification_settings"
                                                    name="notification_settings"
                                                >
                                                    <option value='order'>Notification when new order is created
                                                    </option>
                                                    <option value="payment">Notification when payment is received
                                                    </option>
                                                    <option value="customer">Notification when new customer is added
                                                    </option>
                                                    <option value="product">Notification when new product is added
                                                    </option>
                                                    <option value="stock">Notification when stock is updated</option>
                                                    <option value="store">Notification when store is updated</option>
                                                    <option value="none">None</option>
                                                </select>
                                            </div>
                                            {/* Email Notifications */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="email_notifications" className="form-label">
                                                    Email Notifications
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="email_notifications"
                                                    name="email_notifications"
                                                >
                                                    <option value='order'>Send Mail when new order is created</option>
                                                    <option value="payment">Send Mail when payment is received</option>
                                                    <option value="customer">Send Mail when new customer is added
                                                    </option>
                                                    <option value="product">Send Mail when new product is added</option>
                                                    <option value="stock">Send Mail when stock is updated</option>
                                                    <option value="store">Send Mail when store is updated</option>
                                                    <option value="none">None</option>
                                                </select>
                                            </div>
                                            {/* SMS Notifications */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="sms_notifications" className="form-label">
                                                    SMS Notifications
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="sms_notifications"
                                                    name="sms_notifications"
                                                >
                                                    <option value='order'>Send SMS when new order is created</option>
                                                    <option value="payment">Send SMS when payment is received</option>
                                                    <option value="customer">Send SMS when new customer is added
                                                    </option>
                                                    <option value="product">Send SMS when new product is added</option>
                                                    <option value="stock">Send SMS when stock is updated</option>
                                                    <option value="store">Send SMS when store is updated</option>
                                                    <option value="none">None</option>
                                                </select>
                                            </div>
                                            {/* Theme Selection */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="theme_selection" className="form-label">
                                                    Theme Selection
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="theme_selection"
                                                    name="theme_selection"
                                                    value={formData.theme_selection}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="light">Light</option>
                                                    <option value="dark">Dark</option>
                                                    <option value="system">System Default</option>
                                                </select>
                                            </div>
                                            {/* Language Preference */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="language_preference" className="form-label">
                                                    Language Preference
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="language_preference"
                                                    name="language_preference"
                                                    value={formData.language_preference}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="English">English</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="French">French</option>
                                                    {/* Add more languages as needed */}
                                                </select>
                                            </div>
                                            {/* Time Zone */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="time_zone" className="form-label">
                                                    Time Zone
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="time_zone"
                                                    name="time_zone"
                                                    value={formData.time_zone}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="UTC">UTC</option>
                                                    <option value="GMT">GMT</option>
                                                    <option value="EST">EST</option>
                                                    {/* Add more time zones as needed */}
                                                </select>
                                            </div>
                                            {/* Privacy Settings */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="profile_visibility" className="form-label">
                                                    Profile Visibility
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="profile_visibility"
                                                    name="profile_visibility"
                                                    value={formData.profile_visibility}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                </select>
                                            </div>
                                            {/* Account Security */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="two_factor_authentication" className="form-label">
                                                    Two-Factor Authentication
                                                </label>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="two_factor_authentication"
                                                        name="two_factor_authentication"
                                                        checked={formData.two_factor_authentication}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label"
                                                           htmlFor="two_factor_authentication">
                                                        Enable
                                                    </label>
                                                </div>
                                            </div>
                                            {/* Preferred Currency */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="currency_preference" className="form-label">
                                                    Preferred Currency
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="currency_preference"
                                                    name="currency_preference"
                                                    value={formData.currency_preference}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="JPY">JPY</option>
                                                    {/* Add more currencies as needed */}
                                                </select>
                                            </div>
                                            {/* Date Format */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="date_format" className="form-label">
                                                    Date Format
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="date_format"
                                                    name="date_format"
                                                    value={formData.date_format}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                    <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Save changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyStore;
