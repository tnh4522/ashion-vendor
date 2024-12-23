import {useState} from 'react';
import {Tabs} from 'antd';
import {useNavigate} from 'react-router-dom';

import SelectProvince from '../../component/SelectProvince.jsx';
import SelectDistrict from '../../component/SelectDistrict.jsx';
import SelectWard from '../../component/SelectWard.jsx';
import API from '../../service/service.jsx';
import RaiseEvent from '../../utils/RaiseEvent.jsx';
import useUserContext from '../../hooks/useUserContext.jsx';
import useNotificationContext from '../../hooks/useNotificationContext.jsx';

function AddCustomer() {
    const {userData} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
        ward: '',
        district: '',
        province: '',
        city: '',
        postal_code: '',
        country: 'Vietnam',
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const {name, value} = e.target;
        setAddressData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onSelectProvince = (province) => {
        setAddressData((prev) => ({
            ...prev,
            province,
            district: '',
            ward: '',
        }));
    };

    const onSelectDistrict = (district) => {
        setAddressData((prev) => ({
            ...prev,
            district,
            ward: '',
        }));
    };

    const onSelectWard = (ward) => {
        setAddressData((prev) => ({
            ...prev,
            ward,
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
            const customerData = {
                ...formData,
                address: {
                    full_name: addressData.full_name,
                    phone_number: addressData.phone_number,
                    street_address: addressData.street_address,
                    ward: addressData.ward,
                    district: addressData.district,
                    province: addressData.province,
                    city: addressData.city,
                    postal_code: addressData.postal_code,
                    country: addressData.country,
                },
            };

            const customerResponse = await API.post('customer/create/', customerData, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    'Content-Type': 'application/json',
                },
            });

            if (customerResponse.status === 201) {
                await RaiseEvent(userData, '201', 'CREATE', 'CUSTOMER', 'Create new customer', customerData);
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
                    ward: '',
                    district: '',
                    province: '',
                    city: '',
                    postal_code: '',
                    country: 'Vietnam',
                });

                navigate('/customers');
            }
        } catch (error) {
            console.error('Error creating customer:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .map(([field, messages]) =>
                        `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`
                    )
                    .join(' ');
                openErrorNotification(errorMessages);
            } else {
                openErrorNotification('Error creating customer.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
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
            ward: '',
            district: '',
            province: '',
            city: '',
            postal_code: '',
            country: 'Vietnam',
        });
        navigate('/customers');
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form id="formCustomerSettings" method="POST" onSubmit={handleSubmit}>
                                <Tabs defaultActiveKey="1" type="card" size="large" style={{ marginBottom: '1.5rem' }}>
                                    {/* TAB 1: Customer Information */}
                                    <Tabs.TabPane tab="Customer Information" key="1">
                                        <div className="row">
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

                                    {/* TAB 2: Address Information */}
                                    <Tabs.TabPane tab="Address Information" key="2">
                                        <div className="row">
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
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="address_phone_number" className="form-label">
                                                    Phone Number (Address)
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="address_phone_number"
                                                    name="phone_number"
                                                    value={addressData.phone_number}
                                                    onChange={handleAddressChange}
                                                />
                                            </div>
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
                                            {/* Province, District, Ward (Select components) */}
                                            <div className="mb-3 col-md-4">
                                                <label htmlFor="province" className="form-label">Province</label>
                                                <SelectProvince
                                                    id="province"
                                                    selectedProvince={addressData.province}
                                                    onSelectProvince={onSelectProvince}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-4">
                                                <label htmlFor="district" className="form-label">District</label>
                                                <SelectDistrict
                                                    id="district"
                                                    province_id={addressData.province}
                                                    selectedDistrict={addressData.district}
                                                    onSelectDistrict={onSelectDistrict}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-4">
                                                <label htmlFor="ward" className="form-label">Ward</label>
                                                <SelectWard
                                                    id="ward"
                                                    district_id={addressData.district}
                                                    selectedWard={addressData.ward}
                                                    onSelectWard={onSelectWard}
                                                />
                                            </div>
                                            {/* Optional city/postal_code fields if needed */}
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
                                        type="button"
                                        className="btn btn-outline-secondary me-2"
                                        onClick={handleCancel}
                                    >
                                        Cancel
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
