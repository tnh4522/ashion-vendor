import { useEffect, useState } from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { Tabs } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";

const STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELED: 'CANCELED',
    RETURNED: 'RETURNED'
};

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

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            items: prevState.items.map((item, idx) => idx === index ? { ...item, [name]: value } : item)
        }));
        if (name === 'quantity') {
            const updatedItems = [...formData.items];
            updatedItems[index].total_price = updatedItems[index].price * value;
            setFormData({ ...formData, items: updatedItems });
        }
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
                    <Link to={"/orders"} className="btn btn-primary mb-4">
                        <i className="bx bx-arrow-back me-2"></i>
                        Back to Orders
                    </Link>
                    {/* Order Details */}
                    <div className="card mb-4">
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            style={{ margin: '1.5rem 1rem' }}
                        >
                            <Tabs.TabPane tab="Details" key="1">
                                <div className="card-body">
                                    <form id="formOrderSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Order Number (Read Only) */}
                                            <div className="mb-3 col-md-6">                                                <label htmlFor="order_number" className="form-label">Order Number</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="order_number"
                                                    name="order_number"
                                                    value={formData.order_number}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <input
                                                        hidden
                                                    />
                                            </div>
                                            {/* Customer Information */}
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label">Customer Information</label>
                                                {customer ? (
                                                    <div className="selected-customer-info p-2 border rounded">
                                                        <p className="mb-1"><strong style={{ color: '#68798c' }}>Name:</strong> {customer.first_name} {customer.last_name}</p>
                                                        <p className="mb-1"><strong style={{ color: '#68798c' }}>Email:</strong> {customer.email}</p>
                                                        <p><strong style={{ color: '#68798c' }}>Phone:</strong> {customer.phone_number}</p>
                                                    </div>
                                                ) : (
                                                    <p>Loading customer information...</p>
                                                )}
                                            </div>
                                            {/*Address */}
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label">Address</label>
                                                {address ? (
                                                    <div className="selected-customer-info p-2 border rounded">
                                                        <p className="mb-1"><strong style={{ color: '#68798c' }}>City:</strong> {address.city}</p>
                                                        <p className="mb-1"><strong style={{ color: '#68798c' }}>Country:</strong> {address.country}</p>
                                                        <p className="mb-0"><strong style={{ color: '#68798c' }}>Zip Code:</strong> {address.postal_code}</p>
                                                        <p className="mb-0"><strong style={{ color: '#68798c' }}>Address:</strong> {address.street_address}</p>
                                                    </div>
                                                ) : (
                                                    <p>Loading address information...</p>
                                                )}
                                            </div>
                                            
                                            {/* Shipping Cost */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="shipping_cost" className="form-label">Shipping Cost</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="shipping_cost"
                                                    name="shipping_cost"
                                                    value={formData.shipping_cost}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Discount Amount */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="discount_amount" className="form-label">Discount Amount</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="discount_amount"
                                                    name="discount_amount"
                                                    value={formData.discount_amount}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {/* Tax Amount */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="tax_amount" className="form-label">Tax Amount</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="tax_amount"
                                                    name="tax_amount"
                                                    value={formData.tax_amount}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {/* Total Price */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="total_price" className="form-label">Total Price</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="total_price"
                                                    name="total_price"
                                                    value={formData.total_price}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Shipping Method */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="shipping_method" className="form-label">Shipping Method</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="shipping_method"
                                                    name="shipping_method"
                                                    value={formData.shipping_method}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Payment Method */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="payment_method" className="form-label">Payment Method</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="payment_method"
                                                    name="payment_method"
                                                    value={formData.payment_method}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Payment Status */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="payment_status" className="form-label">Payment Status</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="payment_status"
                                                    name="payment_status"
                                                    value={formData.payment_status}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {/* Order Status */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="status" className="form-label">Order Status</label>
                                                <select
                                                    className="form-control"
                                                    id="status"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Select Status</option>
                                                    {Object.entries(STATUS).map(([key, value]) => (
                                                        <option key={key} value={value}>
                                                            {key.charAt(0) + key.slice(1).toLowerCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Note */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="note" className="form-label">Note</label>
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
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">Cancel</button>
                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            
                            <Tabs.TabPane tab='Order Items' key={2}>
                            <div className="card-body">
                                        <form id="formOrderSettings" method="POST" onSubmit={handleSubmit}>
                                            <div className="row">
                                            {/* Order Items */}
                                                <div className="mb-3 col-md-12">
                                                    <label htmlFor="order_items" className="form-label">Order Items</label>
                                                        {formData.items.map((item, index) => (
                                                            <div key={index} className="row mb-3">
                                                                <div className="col-md-4">
                                                                    <label htmlFor={`item_product_${index}`} className="form-label">Product</label>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        id={`item_product_${index}`}
                                                                        name={`item_product_${index}`}
                                                                        value={item.product_name}
                                                                        onChange={(e) => handleItemChange(index, e)}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <label htmlFor={`item_quantity_${index}`} className="form-label">Quantity</label>
                                                                    <input
                                                                        className="form-control"
                                                                        type="number"
                                                                        id={`item_quantity_${index}`}
                                                                        name={`item_quantity_${index}`}
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleItemChange(index, e)}
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label htmlFor={`item_price_${index}`} className="form-label">Price</label>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        id={`item_price_${index}`}
                                                                        name={`item_price_${index}`}
                                                                        value={item.price}
                                                                        onChange={(e) => handleItemChange(index, e)}
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label htmlFor={`item_total_price_${index}`} className="form-label">Total Price</label>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        id={`item_total_price_${index}`}
                                                                        name={`item_total_price_${index}`}
                                                                        value={item.total_price}
                                                                        onChange={(e) => handleItemChange(index, e)}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
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

export default OrderDetail; 
