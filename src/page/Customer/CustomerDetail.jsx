import { useEffect, useState } from "react";
import { Tabs } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";

import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import API from "../../service/service.jsx";
import RaiseEvent from "../../utils/RaiseEvent.jsx";


import provincesData from "../../constant/province.json";
import { getDistrictInformation, getWardInformation } from "../../component/Helper.jsx";
import SelectProvince from "../../component/SelectProvince.jsx";
import SelectDistrict from "../../component/SelectDistrict.jsx";
import SelectWard from "../../component/SelectWard.jsx";

function CustomerDetail() {
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const { userData, logout } = useUserContext();
    const navigate = useNavigate();
    const { id: customer_id } = useParams();

    const [customer, setCustomer] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
    });

    const [addressData, setAddressData] = useState({
        id: null,
        full_name: "",
        phone_number: "",
        street_address: "",
        province: "",
        district: "",
        ward: "",
        postal_code: "",
        country: "Vietnam",
    });

    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await API.get(`/customer/detail/${customer_id}/`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.code === "token_not_valid") {
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
                        full_name: response.data.address.full_name || "",
                        phone_number: response.data.address.phone_number || "",
                        street_address: response.data.address.street_address || "",
                        province: response.data.address.province || "",   // ID (int/string)
                        district: response.data.address.district || "",   // ID (int/string)
                        ward: response.data.address.ward || "",           // WardCode
                        city: response.data.address.city || "",
                        postal_code: response.data.address.postal_code || "",
                        country: response.data.address.country || "Vietnam",
                    });
                }
            } catch (error) {
                console.error("Error fetching customer data:", error);
                if (error.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                }
            }
        };

        if (userData.access) {
            fetchCustomerData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData.access, customer_id]);

    useEffect(() => {
        if (customer && addressData.province) {
            const province = provincesData.data.find(
                (item) => item.ProvinceID === parseInt(addressData.province, 10)
            );
            setProvinceName(province ? province.ProvinceName : "Unknown");

            getDistrictInformation(addressData.province)
                .then((districts) => {
                    const district = districts.find(
                        (item) => item.DistrictID === parseInt(addressData.district, 10)
                    );
                    setDistrictName(district ? district.DistrictName : "Unknown");
                })
                .catch((err) => {
                    console.error("Error fetching district:", err);
                    setDistrictName("Unknown");
                });

            getWardInformation(addressData.district)
                .then((wards) => {
                    const ward = wards.find((item) => item.WardCode === addressData.ward);
                    setWardName(ward ? ward.WardName : "Unknown");
                })
                .catch((err) => {
                    console.error("Error fetching ward:", err);
                    setWardName("Unknown");
                });
        } else {
            setProvinceName("");
            setDistrictName("");
            setWardName("");
        }
    }, [
        customer,
        addressData.province,
        addressData.district,
        addressData.ward,
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = {
                ...formData,
                address: addressData,
            };

            if (addressData.id) {
                await API.put(`/address/detail/${addressData.id}/`, addressData, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                        "Content-Type": "application/json",
                    },
                });
            } else {
                const addressResponse = await API.post(`/address/create`, addressData, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                        "Content-Type": "application/json",
                    },
                });
                formDataToSend.address = addressResponse.data;
            }

            const response = await API.put(`/customer/detail/${customer_id}/`, formDataToSend, {
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

            if (response.status === 400) {
                openErrorNotification("Failed to update customer.");
                return;
            }
            if (response.status === 404) {
                openErrorNotification("Customer not found.");
                return;
            }
            if (response.status === 500) {
                openErrorNotification("Internal server error.");
                return;
            }

            if (response.status === 200 || response.status === 201) {
                await RaiseEvent(userData, "201", "UPDATE", "CUSTOMER", "Update customer", response.data);
                setCustomer(response.data);
                openSuccessNotification("Customer updated successfully!");
                navigate("/customers");
            }
        } catch (error) {
            console.error("Error updating customer data:", error);
            openErrorNotification("Failed to update customer.");
        }
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

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <Link to={"/customers"} className="btn btn-primary mb-4">
                        <i className="bx bx-arrow-back me-2"></i>
                        Back to Customers
                    </Link>

                    <div className="card mb-4">
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            style={{ margin: '1.5rem 1rem' }}
                        >
                            {/* TAB 1: Thông tin Khách hàng */}
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

                            {/* TAB 2: Thông tin Địa chỉ */}
                            <Tabs.TabPane tab="Address Information" key="2">
                                <div className="card-body">
                                    {/* Bạn có thể gộp chung form với tab 1,
                      ở đây ta tách để code rõ ràng.
                      Khi submit vẫn gọi handleSubmit() */}
                                    <div className="row">
                                        {/* Street Address */}
                                        <div className="mb-3 col-md-6">
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
                                        {/* Province */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="province" className="form-label">Province</label>
                                            <SelectProvince
                                                id="province"
                                                selectedProvince={addressData.province}
                                                onSelectProvince={onSelectProvince}
                                            />
                                        </div>
                                        {/* District */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="district" className="form-label">District</label>
                                            <SelectDistrict
                                                id="district"
                                                province_id={addressData.province}
                                                selectedDistrict={addressData.district}
                                                onSelectDistrict={onSelectDistrict}
                                            />
                                        </div>
                                        {/* Ward */}
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="ward" className="form-label">Ward</label>
                                            <SelectWard
                                                id="ward"
                                                district_id={addressData.district}
                                                selectedWard={addressData.ward}
                                                onSelectWard={onSelectWard}
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

                        {/* Footer: nút lưu/cancel */}
                        <div className="m-3 text-end">
                            <button
                                type="reset"
                                className="btn btn-outline-secondary me-2"
                                onClick={() => navigate("/customers")}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerDetail;
