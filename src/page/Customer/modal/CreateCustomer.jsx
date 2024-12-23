import {useState} from 'react';
import SelectProvince from "../../../component/SelectProvince.jsx";
import SelectDistrict from "../../../component/SelectDistrict.jsx";
import SelectWard from "../../../component/SelectWard.jsx";
import API from "../../../service/service.jsx";
import RaiseEvent from "../../../utils/RaiseEvent.jsx";
import useUserContext from "../../../hooks/useUserContext.jsx";
import useNotificationContext from "../../../hooks/useNotificationContext.jsx";

// eslint-disable-next-line react/prop-types
const CreateCustomer = ({onCustomerAdd, closeModal}) => {
    const {userData} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: {
            street_address: '',
            ward: '',
            district: '',
            province: '',
            country: 'Vietnam',
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "street_address") {
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [name]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };


    const onSelectProvince = (province) => {
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                province,
            },
        });
    };

    const onSelectDistrict = (district) => {
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                district,
            },
        });
    }

    const onSelectWard = (ward) => {
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                ward,
            },
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.first_name === '' || formData.last_name === '' || formData.email === '') {
            openErrorNotification('First name, last name, and email are required.');
            return;
        }

        try {
            const customerResponse = await API.post('customer/create/', formData, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'application/json',
                }
            });

            if (customerResponse.status === 201) {
                await RaiseEvent(userData, '201', 'CREATE', 'CUSTOMER', 'Create new customer', formData);
                openSuccessNotification('Customer created successfully');
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                    address: {
                        street_address: '',
                        ward: '',
                        district: '',
                        province: '',
                        country: 'Vietnam',
                    }
                });
                onCustomerAdd(customerResponse.data.customer);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
                    .join(' ');
                openErrorNotification(errorMessages);
            } else {
                openErrorNotification('Error creating customer.');
            }
        }
    };

    return (
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
                    {/* Province */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="province" className="form-label">Province</label>
                        <SelectProvince
                            id="province"
                            selectedProvince={formData.address.province}
                            onSelectProvince={onSelectProvince}
                        ></SelectProvince>
                    </div>
                    {/* District */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="district" className="form-label">District</label>
                        <SelectDistrict
                            id="district"
                            province_id={formData.address.province}
                            selectedDistrict={formData.address.district}
                            onSelectDistrict={onSelectDistrict}
                        ></SelectDistrict>
                    </div>
                    {/* Ward */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="ward" className="form-label">Ward</label>
                        <SelectWard
                            id="ward"
                            district_id={formData.address.district}
                            selectedWard={formData.address.ward}
                            onSelectWard={onSelectWard}
                        ></SelectWard>
                    </div>
                    {/* Street Address */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="street_address" className="form-label">Street Address</label>
                        <input
                            className="form-control"
                            type="text"
                            id="street_address"
                            name="street_address"
                            value={formData.address.street_address}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end m-2">
                    <button
                        type="button"
                        className="btn btn-secondary mx-2"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Create Customer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCustomer;
