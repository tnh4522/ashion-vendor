import React, {useEffect, useState} from "react";
import {Tabs, Descriptions, Spin, Alert} from 'antd';
import {Link, useNavigate, useParams} from "react-router-dom";

import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import API from "../../service/service.jsx";

import provincesData from "../../constant/province.json";
import {getDistrictInformation, getWardInformation} from "../../component/Helper.jsx";

import StatisticTab from './chart/StatisticTab';
import OrderCustomer from "./component/OrderCustomer.jsx"; // Import StatisticTab

function CustomerDetail() {
    const {openErrorNotification} = useNotificationContext();
    const {userData, logout} = useUserContext();
    const navigate = useNavigate();
    const {id: customer_id} = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                if (response.status === 401 || response.data.code === "token_not_valid") {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                setCustomer(response.data);

                // Fetch address details if available
                if (response.data.address) {
                    const {province: provinceId, district: districtId, ward: wardCode} = response.data.address;

                    // Find Province Name
                    const provinceObj = provincesData.data.find(
                        (item) => item.ProvinceID === parseInt(provinceId, 10)
                    );
                    setProvinceName(provinceObj ? provinceObj.ProvinceName : "Unknown");

                    // Find District Name
                    const districts = await getDistrictInformation(provinceId);
                    const districtObj = districts.find(
                        (item) => item.DistrictID === parseInt(districtId, 10)
                    );
                    setDistrictName(districtObj ? districtObj.DistrictName : "Unknown");

                    // Find Ward Name
                    const wards = await getWardInformation(districtId);
                    const wardObj = wards.find(
                        (item) => item.WardCode === wardCode
                    );
                    setWardName(wardObj ? wardObj.WardName : "Unknown");
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching customer data:", error);
                setError("Failed to load customer details.");
                setLoading(false);
                if (error.response && error.response.status === 401) {
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

    if (loading) {
        return (
            <div className="container-xxl flex-grow-1 container-p-y text-center">
                <Spin size="large"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-xxl flex-grow-1 container-p-y">
                <Alert message="Error" description={error} type="error" showIcon/>
                <Link to="/customers" className="btn btn-primary mt-3">
                    Back to Customers
                </Link>
            </div>
        );
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title">Customer: <strong style={{color: '#696cff'}}>{customer.first_name} {customer.last_name}</strong></h4>
                            <div className="card-options">
                                <button
                                    className="btn btn-secondary mx-1"
                                    onClick={() => navigate("/customers")}
                                >
                                    <i className="bx bx-arrow-back me-2"></i> Back to Customers
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/edit-customer/${customer_id}`)}
                                >
                                    Edit Customer
                                </button>
                            </div>
                        </div>
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            style={{margin: '1.5rem 1rem'}}
                        >
                            {/* TAB 1: Customer Details */}
                            <Tabs.TabPane tab="Customer Details" key="1">
                                <div className="card-body">
                                    <Descriptions bordered column={1}>
                                        <Descriptions.Item label="First Name">
                                            {customer.first_name || "N/A"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Last Name">
                                            {customer.last_name || "N/A"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Email">
                                            {customer.email || "N/A"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Phone Number">
                                            {customer.phone_number || "N/A"}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </div>
                            </Tabs.TabPane>

                            {/* TAB 2: Address Information */}
                            <Tabs.TabPane tab="Address Information" key="2">
                                <div className="card-body">
                                    {customer.address ? (
                                        <Descriptions bordered column={1}>
                                            <Descriptions.Item label="Street Address">
                                                {customer.address.street_address || "N/A"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Province">
                                                {provinceName}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="District">
                                                {districtName}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Ward">
                                                {wardName}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Postal Code">
                                                {customer.address.postal_code || "N/A"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Country">
                                                {customer.address.country || "Vietnam"}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    ) : (
                                        <Alert
                                            message="No Address Information"
                                            type="info"
                                            showIcon
                                        />
                                    )}
                                </div>
                            </Tabs.TabPane>

                            {/* TAB 3: Statistic */}
                            <Tabs.TabPane tab="Statistic" key="3">
                                <StatisticTab customer_id={customer_id}/>
                            </Tabs.TabPane>

                            {/* TAB 4: Orders */}
                            <Tabs.TabPane tab="Orders" key="4">
                                <div className="card-body">
                                    <OrderCustomer customer_id={customer_id}/>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerDetail;
