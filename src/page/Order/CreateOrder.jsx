import {useState, useEffect} from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {useNavigate} from "react-router-dom";
import {Modal, Button, Select} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import SelectProduct from "./SelectProduct.jsx";
import SelectCustomer from "./SelectCustomer.jsx";

const {Option} = Select;

const CreateOrder = () => {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();
    const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);

    const [orderData, setOrderData] = useState({
        customer: '',
        subtotal_price: 0,
        shipping_cost: 0,
        discount_amount: 0,
        tax_amount: 0,
        total_price: 0,
        total_weight: 0,
        shipping_address: '',
        billing_address: '',
        shipping_method: '',
        payment_method: '',
        note: '',
        items: [
            {
                product: '',
                quantity: 1,
                price: 0,
                total_price: 0,
                size: '',
                color: ''
            }
        ],
    });

    useEffect(() => {
        calculateTotals();
    }, [orderData.items]);


    const calculateTotals = () => {
        const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const shipping = orderData.shipping_cost || 0;
        const discount = orderData.discount_amount || 0;

        setOrderData(prev => ({
            ...prev,
            subtotal_price: subtotal,
            tax_amount: tax,
            total_price: subtotal + tax + shipping - discount
        }));
    };

    const showCustomerModal = async () => {
        setIsCustomerModalVisible(true);
    };

    const showProductModal = async (index) => {
        setSelectedProductIndex(index);
        setIsProductModalVisible(true);
    }

    const handleCustomerSelect = async (customer) => {
        setSelectedCustomer(customer);
        setOrderData(prev => ({
            ...prev,
            customer: customer.id,
            shipping_address: customer.address.id,
            billing_address: customer.address.id
        }));

        setShippingAddress(customer.address);
        setBillingAddress(customer.address);

        setIsCustomerModalVisible(false);
    };

    const handleProductSelect = (product) => {
        if (product) {
            const updatedItems = [...orderData.items];
            updatedItems[selectedProductIndex] = {
                ...updatedItems[selectedProductIndex],
                product: product.id,
                productName: product.name,
                price: product.price,
                total_price: product.price * updatedItems[selectedProductIndex].quantity
            };
            setOrderData({...orderData, items: updatedItems});
        }
        setIsProductModalVisible(false);
    };

    const handleOrderChange = (e) => {
        const {name, value} = e.target;
        setOrderData({
            ...orderData,
            [name]: value,
        });
    };

    const handleItemChange = (index, e) => {
        const {name, value} = e.target;
        const updatedItems = [...orderData.items];
        updatedItems[index][name] = value;

        if (name === 'quantity' || name === 'price') {
            updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].price;
        }

        setOrderData({...orderData, items: updatedItems});
    };

    const paymentMethods = [
        {value: 'COD', label: 'Cash on Delivery'},
        {value: 'BANK_TRANSFER', label: 'Bank Transfer'},
        {value: 'CREDIT_CARD', label: 'Credit Card'},
        {value: 'PAYPAL', label: 'PayPal'}
    ];

    const shippingMethods = [
        {value: 'STANDARD', label: 'Standard Shipping'},
        {value: 'EXPRESS', label: 'Express Shipping'}
    ];

    const addItem = () => {
        setOrderData({
            ...orderData,
            items: [...orderData.items, {product: '', quantity: 1, price: ''}]
        });
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('orders/create/', orderData, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            if (response.status === 201) {
                openSuccessNotification('Order created successfully');
                navigate('/orders');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('There was an error creating the order:', error);
            openErrorNotification('There was an error creating the order');
        }
    };

    const removeItem = (index) => {
        const updatedItems = [...orderData.items];
        updatedItems.splice(index, 1);
        setOrderData({...orderData, items: updatedItems});
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <h5 className="card-header">Create Order</h5>
                        <div className="card-body">
                            <form id="formCreateOrder" method="POST" onSubmit={handleOrderSubmit}>
                                <div className="row">
                                    {/* Customer Selection */}
                                    <div className="mb-3 col-md-12">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label className="form-label">Customer</label>
                                            <Button type="button" className="btn-link"
                                                    onClick={showCustomerModal} icon={<SearchOutlined/>}>
                                                Select Customer
                                            </Button>
                                        </div>
                                        {selectedCustomer && (
                                            <div className="selected-customer-info mt-2 p-2 border rounded">
                                                <p className="mb-1">
                                                    <strong>Name:</strong> {selectedCustomer.first_name + ' ' + selectedCustomer.last_name}
                                                </p>
                                                <p className="mb-1"><strong>Email:</strong> {selectedCustomer.email}</p>
                                                <p className="mb-0">
                                                    <strong>Phone:</strong> {selectedCustomer.phone_number}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Addresses */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Shipping Address</label>
                                        {selectedCustomer ? (
                                            <div className="selected-customer-info mt-2 p-2 border rounded">
                                                <p className="mb-1"><strong>City:</strong> {shippingAddress.city}</p>
                                                <p className="mb-1"><strong>Country:</strong> {shippingAddress.country}
                                                </p>
                                                <p className="mb-0"><strong>Zip
                                                    Code:</strong> {shippingAddress.postal_code}</p>
                                                <p className="mb-0">
                                                    <strong>Address:</strong> {shippingAddress.street_address}</p>
                                            </div>
                                        ) : (
                                            <textarea
                                                className="form-control"
                                                name="shipping_address"
                                                value={orderData.shipping_address}
                                                onChange={handleOrderChange}
                                                rows="3"
                                                required
                                            />
                                        )}
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Billing Address</label>
                                        {selectedCustomer ? (
                                            <div className="selected-customer-info mt-2 p-2 border rounded">
                                                <p className="mb-1"><strong>City:</strong> {billingAddress.city}</p>
                                                <p className="mb-1"><strong>Country:</strong> {billingAddress.country}
                                                </p>
                                                <p className="mb-0"><strong>Zip
                                                    Code:</strong> {billingAddress.postal_code}</p>
                                                <p className="mb-0">
                                                    <strong>Address:</strong> {billingAddress.street_address}</p>
                                            </div>
                                        ) : (
                                            <textarea
                                                className="form-control"
                                                name="billing_address"
                                                value={orderData.billing_address}
                                                onChange={handleOrderChange}
                                                rows="3"
                                                required
                                            />
                                        )}
                                    </div>

                                    {/* Shipping and Payment */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Shipping Method</label>
                                        <Select
                                            className="w-100"
                                            placeholder="Select shipping method"
                                            value={orderData.shipping_method}
                                            onChange={(value) => handleOrderChange({
                                                target: {
                                                    name: 'shipping_method',
                                                    value
                                                }
                                            })}
                                            required
                                        >
                                            {shippingMethods.map(method => (
                                                <Option key={method.value} value={method.value}>
                                                    {method.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Payment Method</label>
                                        <Select
                                            className="w-100"
                                            placeholder="Select payment method"
                                            value={orderData.payment_method}
                                            onChange={(value) => handleOrderChange({
                                                target: {
                                                    name: 'payment_method',
                                                    value
                                                }
                                            })}
                                            required
                                        >
                                            {paymentMethods.map(method => (
                                                <Option key={method.value} value={method.value}>
                                                    {method.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label">Order Items</label>
                                        {orderData.items.map((item, index) => (
                                            <div key={index} className="row mb-3 align-items-end">
                                                <div className="col-md-4">
                                                    {item.productName ?
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            value={item.productName}
                                                            readOnly
                                                        /> :
                                                        <Button icon={<SearchOutlined/>} type="button"
                                                                className="btn-link"
                                                                onClick={() => showProductModal(index)}>
                                                            Select Product From Inventory
                                                        </Button>
                                                    }
                                                </div>
                                                <div className="col-md-1">
                                                    <label className="form-label">Size</label>
                                                    <select
                                                        className="form-select"
                                                        name="size"
                                                        value={item.size}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                    >
                                                        <option value="S">S</option>
                                                        <option value="M">M</option>
                                                        <option value="L">L</option>
                                                        <option value="XL">XL</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-1">
                                                    <label className="form-label">Color</label>
                                                    <select
                                                        className="form-select"
                                                        name="color"
                                                        value={item.color}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                    >
                                                        <option style={{color: 'red'}} value="Red">Red</option>
                                                        <option style={{color: 'blue'}} value="Blue">Blue</option>
                                                        <option style={{color: 'green'}} value="Green">Green</option>
                                                        <option style={{color: 'black'}} value="Black">Black</option>
                                                        <option style={{color: 'yellow'}} value="Yellow">Yellow</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-1">
                                                    <label className="form-label">Qty</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        name="quantity"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Price</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        name="price"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                        required
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Total</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        value={item.total_price}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="col-md-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={addItem}
                                        >
                                            + Add Item
                                        </button>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="col-md-12">
                                        <div className="row justify-content-end">
                                            <div className="col-md-6">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h6 className="card-title">Order Summary</h6>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Subtotal:</span>
                                                            <span>${orderData.subtotal_price}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Shipping:</span>
                                                            <span>${orderData.shipping_cost}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Tax:</span>
                                                            <span>${orderData.tax_amount}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Discount:</span>
                                                            <span>${orderData.discount_amount}</span>
                                                        </div>
                                                        <hr/>
                                                        <div className="d-flex justify-content-between">
                                                            <strong>Total:</strong>
                                                            <strong>${orderData.total_price}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label">Order Note</label>
                                        <textarea
                                            className="form-control"
                                            name="note"
                                            value={orderData.note}
                                            onChange={handleOrderChange}
                                            rows="3"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 text-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary me-2"
                                            onClick={() => navigate('/orders')}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">Create Order</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Select Customer"
                visible={isCustomerModalVisible}
                onCancel={() => setIsCustomerModalVisible(false)}
                footer={null}
                width={1000}
            >
                <SelectCustomer
                    onCustomerSelect={handleCustomerSelect}
                />
            </Modal>


            <Modal
                title="Select Product"
                visible={isProductModalVisible}
                onCancel={() => setIsProductModalVisible(false)}
                footer={null}
                width={1000}
            >
                <SelectProduct
                    onProductSelect={handleProductSelect}
                />
            </Modal>
        </div>
    );
};

export default CreateOrder;