import { useEffect, useState } from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { Table, Select } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";
import { orderStatus, paymentStatus } from '../../utils/Constant';
import provincesData from "../../constant/province.json";
import {getDistrictInformation, getWardInformation} from "../../component/Helper.jsx";
import formatCurrency from "../../constant/formatCurrency.js";

const { Option } = Select;

function OrderDetail() {
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const { userData, logout } = useUserContext();
    const navigator = useNavigate();
    const order_id = useParams().id;

    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [formData, setFormData] = useState({
        order_number: "",
        subtotal_price: "",
        shipping_cost: "",
        discount_amount: "",
        tax_amount: "",
        total_price: "",
        shipping_method: "",
        payment_method: "",
        payment_status: "",
        status: "",
        note: "",
        items: [],
        shipping_address: "",
        billing_address: "",
    });

    useEffect(() => {
        const fetchOrderData = async () => {
            const response = await API.get(`orders/${order_id}/`, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                },
            });

            if (response.status === 401 || response.code === 'token_not_valid') {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }

            setOrder(response.data);
            setFormData({
                customer: response.data.customer ,
                order_number: response.data.order_number || "",
                subtotal_price: response.data.subtotal_price || "",
                shipping_cost: response.data.shipping_cost || "",
                discount_amount: response.data.discount_amount || "",
                tax_amount: response.data.tax_amount || "",
                total_price: response.data.total_price || "",
                shipping_method: response.data.shipping_method || "",
                payment_method: response.data.payment_method || "",
                payment_status: response.data.payment_status || "",
                status: response.data.status || "",
                note: response.data.note || "",
                items: response.data.items || [],
                shipping_address: response.data.shipping_address || "",
                billing_address: response.data.billing_address || "",
            });

            const customerResponse = await API.get(`customer/detail/${response.data.customer}/`, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                },
            });
            setCustomer(customerResponse.data);

            const fetchProductDetails = async (item) => {
                const productResponse = await API.get(`/product/detail/${item.product}/`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });
                return { 
                    ...item,
                    product_name: productResponse.data.name,
                    main_image: productResponse.data.images[0].image,
                };
            };

            const itemsProduct = await Promise.all(response.data.items.map(fetchProductDetails));

            setFormData(prevState => ({
                ...prevState,
                items: itemsProduct,
            }));
        }

        if (userData.access) {
            fetchOrderData();
        }
    }, [userData.access]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.put(`/orders/${order_id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                },
            });

            setOrder(response.data);
            openSuccessNotification("Order updated successfully!");
            navigator("/orders");
        } catch (error) {
            console.error("Error updating order data:", error);
            openErrorNotification("Failed to update order.");
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'main_image',
            key: 'image',
            width: '10%',
            render: (record) => 
                record ? (
                    <img
                        src={record}
                        alt={record.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0' }} />
                )
            ,
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
        },
        {
            title: 'Size',
            dataIndex: 'size',
        },
        {
            title: 'Color',
            dataIndex: 'color',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (record) => formatCurrency(record),
        },
        {
            title: 'Total Price',
            dataIndex: 'total_price',
            render: (record) => formatCurrency(record),
        },
    ];

    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');

    useEffect(() => {
        if (customer) {
            const province = provincesData.data.find(
                item => item.ProvinceID === parseInt(customer.address.province, 10)
            );
            setProvinceName(province ? province.ProvinceName : 'Unknown');

            getDistrictInformation(customer.address.province)
                .then(districts => {
                    const district = districts.find(
                        item => item.DistrictID === parseInt(customer.address.district, 10)
                    );
                    setDistrictName(district ? district.DistrictName : 'Unknown');
                })
                .catch(err => {
                    console.error('Error fetching district:', err);
                    setDistrictName('Unknown');
                });

            getWardInformation(customer.address.district)
                .then(wards => {
                    const ward = wards.find(
                        item => item.WardCode === customer.address.ward
                    );
                    setWardName(ward ? ward.WardName : 'Unknown');
                })
                .catch(err => {
                    console.error('Error fetching ward:', err);
                    setWardName('Unknown');
                });
        } else {
            setProvinceName('');
            setDistrictName('');
            setWardName('');
        }
    }, [customer]);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                <form id="formOrderSettings" method="POST" onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between mt-2 mb-2">
                        <div className="text-start">
                            <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>Order Details /
                                <span style={{color: '#696cff', marginLeft: '5px'}}>#{formData.order_number}</span>
                            </h3>
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Save changes</button>
                            <Link to={"/orders"} className="btn btn-secondary m-2">
                                <i className="bx bx-arrow-back me-2"></i>
                                Back
                            </Link>
                        </div>
                    </div>
                    {/* Order Details */}
                    <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                            <div className="col-md-8">
                                                {/* Order Information */}
                                                <div className="mb-4 col-md-12">
                                                    <h5 className="card-title">Order Information</h5>
                                                    <div className="card p-3">
                                                        <div className="row">
                                                            <div className="mb-3 col-md-6">
                                                                <label className="form-label">Customer Information</label>
                                                                {customer ? (
                                                                    <div className="selected-customer-info p-2 ">
                                                                        <p className="mb-2">Name: <strong style={{ color: '#68798c' }}>{customer.first_name} {customer.last_name}</strong></p>
                                                                        <p className="mb-2">Email: <strong style={{ color: '#68798c' }}>{customer.email}</strong></p>
                                                                        <p className="mb-0">Phone: <strong style={{ color: '#68798c' }}>{customer.phone_number}</strong></p>
                                                                    </div>
                                                                ) : (
                                                                    <p>Loading customer information...</p>
                                                                )}
                                                            </div>
                                                            {/* Address */}
                                                            <div className="mb-3 col-md-6">
                                                                <label className="form-label">Shipping Address</label>
                                                                {customer ? (
                                                                    <div className="selected-customer-info p-2 ">
                                                                        <p className="mb-2">Province: <strong style={{ color: '#68798c' }}>{provinceName}</strong></p>
                                                                        <p className="mb-2">District: <strong style={{ color: '#68798c' }}>{districtName}</strong></p>
                                                                        <p className="mb-0">Ward: <strong style={{ color: '#68798c' }}>{wardName}</strong></p>
                                                                    </div>
                                                                ) : (
                                                                    <p>Loading address information...</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            {/* Payment Method */}
                                                            <div className="mb-2 col-md-6">
                                                                <label className="form-label">Payment Method</label>
                                                                <p><strong>{formData.payment_method}</strong></p>
                                                            </div>
                                                            {/* Shipping Method */}
                                                            <div className="mb-2 col-md-6">
                                                                <label className="form-label">Shipping Method</label>
                                                                <p><strong>{formData.shipping_method}</strong></p>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            {/* Order Status */}
                                                            <div className="mb-3 col-md-6">
                                                                <label className="form-label">Status</label>
                                                                <Select
                                                                    className="w-100"
                                                                    id="status"
                                                                    name="status"
                                                                    value={formData.status}
                                                                    onChange={(value) => handleInputChange({
                                                                        target: {
                                                                            name: 'status',
                                                                            value
                                                                            }
                                                                    })}
                                                                    required
                                                                >
                                                                    {Object.entries(orderStatus).map(([key, value]) => (
                                                                        <Option key={value} value={value}>
                                                                            {key.charAt(0) + key.slice(1).toLowerCase()}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </div>

                                                            {/* Payment Status */}
                                                            <div className="mb-3 col-md-6">
                                                                    <label className="form-label">Payment Status</label>
                                                                    <Select
                                                                        className="w-100"
                                                                        id="payment_status"
                                                                        name="payment_status"
                                                                        value={formData.payment_status}
                                                                        onChange={(value) => handleInputChange({
                                                                            target: {
                                                                                name: 'payment_status',
                                                                                value
                                                                                }
                                                                        })}
                                                                    >
                                                                        {paymentStatus.map(status => (
                                                                            <Option key={status.value} value={status.value}>
                                                                                {status.label}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="mt-3 mb-3 col-md-12">
                                                    <h5>Order Items</h5>
                                                    <div className="card">
                                                        <Table
                                                            columns={columns}
                                                            dataSource={formData.items}
                                                            pagination={false}
                                                            rowKey={(record) => record.product_name}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                {/* Order Summary */}
                                                <div className="mb-4">
                                                    <h5 className="card-title">Order Summary</h5>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Subtotal:</span>
                                                            <span>{formatCurrency(formData.subtotal_price)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Shipping:</span>
                                                            <span>{formatCurrency(formData.shipping_cost)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Tax:</span>
                                                            <span>{formatCurrency(formData.tax_amount)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Discount:</span>
                                                            <span>{formatCurrency(formData.discount_amount)}</span>
                                                        </div>
                                                        <hr/>
                                                        <div className="d-flex justify-content-between">
                                                            <strong>Total:</strong>
                                                            <strong>{formatCurrency(formData.total_price)}</strong>
                                                        </div>
                                                </div>
                                                {/* Note */}
                                                <div className="mb-3">
                                                        <label className="form-label">Note</label>
                                                        <textarea
                                                            className="form-control"
                                                            id="note"
                                                            name="note"
                                                            rows="3"
                                                            value={formData.note}
                                                            onChange={handleInputChange}
                                                        ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
