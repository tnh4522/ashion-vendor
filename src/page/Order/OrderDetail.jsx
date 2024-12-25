import React, { useEffect, useState, useRef, useCallback } from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { Table, Button, Tag, Modal } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";
import provincesData from "../../constant/province.json";
import {getDistrictInformation, getWardInformation} from "../../component/Helper.jsx";
import formatCurrency from "../../constant/formatCurrency.js";
import SelectStatus from './CustomSelect/SelectStatus.jsx';
import { EditOutlined, PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import PrintOrder from './PrintOrder/PrintOrder.jsx';

function OrderDetail() {
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const { userData, logout } = useUserContext();
    const navigator = useNavigate();
    const order_id = useParams().id;

    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false); 
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
        updated_at: "",
        created_at:""
    });

    const [currentOrderStatus, setCurrentOrderStatus] = useState(formData.status);
    const [currentPaymentStatus, setCurrentPaymentStatus] = useState(formData.payment_status);
    const orderStatuses = ["PENDING", "PROCESSING", "CANCELED", "SHIPPED", "DELIVERED", "RETURNED"];
    const paymentStatuses = ["UNPAID", "PAID", "REFUNDED"];

    const handleOpenStatusModal = () => {
        setCurrentOrderStatus(formData.status);
        setCurrentPaymentStatus(formData.payment_status);
        setIsStatusModalVisible(true);
    };

    const handleStatusChange = async (newOrderStatus, newPaymentStatus) => {
        try {
            const response = await API.patch(`/orders/detail/${order_id}/`, {
                status: newOrderStatus,
                payment_status: newPaymentStatus
            }, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                }
            });

            if (response.status === 200) {
                setFormData(prev => ({
                    ...prev,
                    status: newOrderStatus,
                    payment_status: newPaymentStatus
                }));
                openSuccessNotification('Status updated successfully');
                setIsStatusModalVisible(false);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            openErrorNotification('Failed to update status');
        }
    };

    useEffect(() => {
        const fetchOrderData = async () => {
            const response = await API.get(`orders/detail/${order_id}/`, {
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
                created_at: response.data.created_at || "",
                updated_at: response.data.updated_at || "",
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
            const response = await API.put(`/orders/detail/${order_id}/`, formData, {
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
            render: (record) => {
                return (
                    <strong style={{ color: '#52c41a' }}>
                        {formatCurrency(record)}
                    </strong>
                );
            }
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

    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = useReactToPrint({
      onAfterPrint: () => setIsPrinting(false),
    });
    
    const callbackRef = useCallback(
      (node) => {
        if (node !== null) handlePrint(() => node);
      },
      [handlePrint]
    );

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                <form id="formOrderSettings" method="POST" onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between mt-2 mb-1">
                        <div className="text-start">
                            <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>
                                <span style={{color: '#696cff', marginLeft: '5px'}}>#{formData.order_number}</span>
                            </h3>
                        </div>
                        {/* status */}
                        <div className="text-start">
                            
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Save </button>
                            <Link to={"/orders"} className="btn btn-secondary m-1">
                                <i className="bx bx-arrow-back me-2"></i>
                                Back
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <p style={{flex:"0 0 auto", width:"20%"}}><strong>Created:</strong> {new Date(formData.created_at).toLocaleString()}</p>
                        <p style={{flex:"0 0 auto", width:"25%", paddingLeft:3}}><strong>Modified:</strong> {new Date(formData.updated_at).toLocaleString()}</p>
                    </div>

                    {/* Status */}
                    <div className="row mb-1">
                        <p style={{fontWeight:"bold", flex:"0 0 auto", width:"6.333333%"}}>Status :</p>
                        <div style={{flex:"0 0 auto", width:"7%", paddingRight: 0}}>
                            <Tag color={
                                formData.status === "PENDING" ? 'orange' :
                                formData.status === "PROCESSING" ? 'blue' :
                                formData.status === "CANCELED" ? 'red' :
                                formData.status === "SHIPPED" ? 'green' :
                                formData.status === "DELIVERED" ? 'blue' :
                                formData.status === "RETURNED" ? 'violet' :
                                'gray' 
                            }>
                                {formData.status}
                            </Tag>
                        </div>
                        <p style={{ flex:"0 0 auto", width:"1%"}}>&</p>
                        <div style={{flex:"0 0 auto", width:"7%"}}>
                            <Tag color={
                                formData.payment_status === 'UNPAID' ? 'gray' :
                                formData.payment_status === 'PAID' ? 'blue' :
                                formData.payment_status === 'REFUNDED' ? 'green' :
                                'default' 
                            }>
                                {formData.payment_status}
                            </Tag>
                        </div>
                        <div style={{ flex:"0 0 auto", width:"1%", paddingLeft:0}}>
                            <Button type="button" onClick={handleOpenStatusModal} icon={<EditOutlined />} /> 
                        </div>
                        {/* print order */}
                        <div className="text-end col-md-9">
                            {isPrinting && (
                            <div style={{ display: 'none' }}>
                                    <PrintOrder
                                        ref={callbackRef}
                                        order={formData}
                                        customer={customer}
                                        provinceName={provinceName}
                                        districtName={districtName}
                                        wardName={wardName}
                                    />
                            </div>
                            )}
                            <Button 
                                type="primary" 
                                onClick={() => setIsPrinting(true)}
                                icon={<PrinterOutlined />}
                            >
                            </Button>
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
                        {/* Status Modal */}
                        <Modal
                        open={isStatusModalVisible} 
                        onCancel={() => setIsStatusModalVisible(false)}
                        footer={null}
                        width={400}
                        >
                            <SelectStatus
                                currentOrderStatus={currentOrderStatus}
                                currentPaymentStatus={currentPaymentStatus}
                                orderStatuses={orderStatuses}
                                paymentStatuses={paymentStatuses}
                                onSubmitStatus={handleStatusChange}
                                closeModal={() => setIsStatusModalVisible(false)}
                            />
                        </Modal>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
