import { useEffect, useState } from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { Select } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";
import { orderStatus, paymentStatus } from '../../utils/Constant';

const { Option } = Select; 

function OrderDetail() {
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const { userData, logout } = useUserContext();
    const navigator = useNavigate();
    const order_id = useParams().id;

    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [address, setAddress] = useState(null);
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
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await API.get(`/orders/${order_id}/`, {
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
                
                const customerResponse = await API.get(`/customers/`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });
                const customer = customerResponse.data.results.find(customer => customer.address.id === response.data.shipping_address);
                if (customer) {
                    setCustomer(customer);
                } else {
                    console.error("Customer not found for addressId:", response.data.shipping_address);
                    openErrorNotification("Customer not found.");
                }

                const addressResponse = await API.get(`/address/${response.data.shipping_address}`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });
                if (addressResponse.data) {
                    setAddress(addressResponse.data);
                    setFormData(prevState => ({
                        ...prevState,
                        shipping_address: addressResponse.data.id || "",
                        billing_address: addressResponse.data.id || "",
                    }));
                } else {
                    console.error("Address not found for addressId:", response.data.shipping_address);
                    openErrorNotification("Address not found.");
                }

                const productResponse = await API.get(`/products/`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });
                setProducts(productResponse.data);
                setFormData(prevState => ({
                    ...prevState,
                    items: response.data.items.map(item => {
                        const product = productResponse.data.results.find(product => product.id === item.product);
                        return {
                            ...item,
                            product_name: product ? product.name : '',
                        };
                    }),
                }));
            } catch (error) {
                console.error("Error fetching order data:", error);
                if (error.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
            }
        };

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
                                                <div className="mb-3 col-md-12">
                                                    <h5 className="card-title">Order Information</h5>
                                                    <div className="card p-3">
                                                        <div className="row">
                                                            <div className="mb-2 col-md-6">
                                                                <label className="form-label">Customer Information</label>
                                                                {customer ? (
                                                                    <div className="selected-customer-info p-2 ">
                                                                        <p className="mb-1"><strong style={{ color: '#68798c' }}>Name:</strong> {customer.first_name} {customer.last_name}</p>
                                                                        <p className="mb-1"><strong style={{ color: '#68798c' }}>Email:</strong> {customer.email}</p>
                                                                        <p><strong style={{ color: '#68798c' }}>Phone:</strong> {customer.phone_number}</p>
                                                                    </div>
                                                                ) : (
                                                                    <p>Loading customer information...</p>
                                                                )}
                                                            </div>
                                                            {/* Address */}
                                                            <div className="mb-2 col-md-6">
                                                                <label className="form-label">Shipping Address</label>
                                                                {address ? (
                                                                    <div className="selected-customer-info p-2 ">
                                                                        <p className="mb-1"><strong style={{ color: '#68798c' }}>City:</strong> {address.city}</p>
                                                                        <p className="mb-1"><strong style={{ color: '#68798c' }}>Country:</strong> {address.country}</p>
                                                                        <p className="mb-0"><strong style={{ color: '#68798c' }}>Zip Code:</strong> {address.postal_code}</p>
                                                                        <p className="mb-0"><strong style={{ color: '#68798c' }}>Address:</strong> {address.street_address}</p>
                                                                    </div>
                                                                ) : (
                                                                    <p>Loading address information...</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            {/* Payment Method */}
                                                            <div className="mb-3 col-md-6">
                                                                <label className="form-label">Payment Method</label>
                                                                <p>{formData.payment_method}</p> {/* Hiển thị tên phương thức thanh toán */}
                                                            </div>
                                                            {/* Shipping Method */}
                                                            <div className="mb-3 col-md-6">
                                                                <label className="form-label">Shipping Method</label>
                                                                <p>{formData.shipping_method}</p> {/* Hiển thị tên phương thức vận chuyển */}
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
                                                    <h5 className="card-title">Order Items</h5>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <table className="table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Image</th>
                                                                        <th>Product</th>
                                                                        <th>Size</th>
                                                                        <th>Quantity</th>
                                                                        <th>Price</th>
                                                                        <th>Total Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {formData.items.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td>{}</td>
                                                                            <td>{item.product_name}</td>
                                                                            <td>{item.size}</td>
                                                                            <td>{item.quantity}</td>
                                                                            <td>${item.price}</td>
                                                                            <td>${item.total_price}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                

                                            </div>

                                            <div className="col-md-4">
                                                {/* Order Summary */}
                                                <div className="mb-3">
                                                    <h5 className="card-title">Order Summary</h5>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Subtotal:</span>
                                                            <span>${formData.subtotal_price}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Shipping:</span>
                                                            <span>${formData.shipping_cost}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Tax:</span>
                                                            <span>${formData.tax_amount}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Discount:</span>
                                                            <span>${formData.discount_amount}</span>
                                                        </div>
                                                        <hr/>
                                                        <div className="d-flex justify-content-between">
                                                            <strong>Total:</strong>
                                                            <strong>${formData.total_price}</strong>
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
