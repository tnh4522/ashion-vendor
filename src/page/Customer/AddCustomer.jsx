import { useState } from 'react';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import { useNavigate } from "react-router-dom";
import { Tabs } from 'antd';

function AddCustomer() {
    const { userData } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });
    const [addressData, setAddressData] = useState({
        full_name: '',
        phone_number: '',
        street_address: '',
        city: '',
        province: '',
        postal_code: '',
        country: 'Vietnam',
    });
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
        setLoading(true);

        if (formData.first_name === '' || formData.last_name === '' || formData.email === '') {
            openErrorNotification('First name, last name, and email are required.');
            setLoading(false);
            return;
        }

        try {
            const addressResponse = await API.post('address/create/', addressData, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'application/json',
                }
            });

            const addressId = addressResponse.data.id;
            const customerData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: addressId,
            }
            const customerResponse = await API.post('customer/create/', customerData, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'application/json',
                }
            });

            openSuccessNotification('Customer created successfully');
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone_number: '',
            });
            setAddressData({
                full_name: '',
                phone_number: '',
                street_address: '',
                city: '',
                province: '',
                postal_code: '',
                country: 'Vietnam',
            });
            navigator('/customers');
        } catch (error) {
            console.error('Error creating customer:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
                    .join(' ');
                openErrorNotification(errorMessages);
            } else {
                openErrorNotification('Error creating customer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form id="formCustomerSettings" method="POST" onSubmit={handleSubmit}>
                                <Tabs
                                    defaultActiveKey="1"
                                    type="card"
                                    size="large"
                                    style={{ marginBottom: '1.5rem' }}
                                >
                                    <Tabs.TabPane tab="Customer Information" key="1">
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
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="Address Information" key="2">
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
                                                />
                                            </div>
                                        </div>
                                    </Tabs.TabPane>
                                </Tabs>

                                <div className="mt-2 text-end">
                                    <button
                                        type="reset"
                                        className="btn btn-outline-secondary me-2"
                                        onClick={() => {
                                            setFormData({
                                                first_name: '',
                                                last_name: '',
                                                email: '',
                                                phone_number: '',
                                            });
                                            setAddressData({
                                                full_name: '',
                                                phone_number: '',
                                                street_address: '',
                                                city: '',
                                                province: '',
                                                postal_code: '',
                                                country: 'Vietnam',
                                            });
                                            navigator('/customers');
                                        }}
                                    >
                                        Turn Back
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Loading...' : 'Create Customer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCustomer;