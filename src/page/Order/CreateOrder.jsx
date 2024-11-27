import { useState, useEffect } from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Input, Select} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateOrder = () => {
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();
    const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [products, setProducts] = useState([]);
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get('products/', {
                    headers: { 'Authorization': `Bearer ${userData.access}` }
                });
                setProducts(response.data.results);
            } catch {
                openErrorNotification('Error loading products');
            }
        };
        fetchProducts();
    }, []);

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
        try {
            const response = await API.get('customers/', {
                headers: { 'Authorization': `Bearer ${userData.access}` },
                params: {
                    page_size: 1000
                }
            });

            setCustomers(response.data.results);
            setIsCustomerModalVisible(true);
        } catch (error) {
            console.error('Error:', error);
            openErrorNotification('Error loading customers');
        }
    };

    const showProductModal = async (index) => {
        setSelectedProductIndex(index);
        setIsProductModalVisible(true);
    }

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setOrderData(prev => ({
            ...prev,
            customer: customer.id,
            shipping_address: customer.address,
            billing_address: customer.address,
        }));
        setIsCustomerModalVisible(false);
    };

    const handleProductSelect = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const updatedItems = [...orderData.items];
            updatedItems[selectedProductIndex] = {
                ...updatedItems[selectedProductIndex],
                product: productId,
                productName: product.name,
                price: product.price,
                total_price: product.price * updatedItems[selectedProductIndex].quantity
            };
            setOrderData({ ...orderData, items: updatedItems });
        }
        setIsProductModalVisible(false);
    };

    const handleOrderChange = (e) => {
        const { name, value } = e.target;
        setOrderData({
            ...orderData,
            [name]: value,
        });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...orderData.items];
        updatedItems[index][name] = value;

        if (name === 'quantity' || name === 'price') {
            updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].price;
        }

        setOrderData({ ...orderData, items: updatedItems });
    };

    const paymentMethods = [
        { value: 'COD', label: 'Cash on Delivery' },
        { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
        { value: 'PAYPAL', label: 'PayPal' }
    ];

    const shippingMethods = [
        { value: 'STANDARD', label: 'Standard Shipping' },
        { value: 'EXPRESS', label: 'Express Shipping' }
    ];

    const addItem = () => {
        setOrderData({
            ...orderData,
            items: [...orderData.items, { product: '', quantity: 1, price: '' }]
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
        setOrderData({ ...orderData, items: updatedItems });
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
                                            <Button type="button" onClick={showCustomerModal} icon={<SearchOutlined />}>
                                                Select Customer
                                            </Button>
                                        </div>
                                        {selectedCustomer && (
                                            <div className="selected-customer-info mt-2 p-2 border rounded">
                                                <p className="mb-1"><strong>Name:</strong> {selectedCustomer.first_name + ' ' + selectedCustomer.last_name }</p>
                                                <p className="mb-1"><strong>Email:</strong> {selectedCustomer.email}</p>
                                                <p className="mb-0"><strong>Phone:</strong> {selectedCustomer.phone_number}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Addresses */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Shipping Address</label>
                                        {selectedCustomer ? (
                                            <div className="selected-customer-info mt-2 p-2 border rounded">
                                                <p className="mb-1"><strong>City:</strong> {selectedCustomer.address.city}</p>
                                                <p className="mb-1"><strong>Country:</strong> {selectedCustomer.address.country}</p>
                                                <p className="mb-0"><strong>Zip Code:</strong> {selectedCustomer.address.postal_code}</p>
                                                <p className="mb-0"><strong>Address:</strong> {selectedCustomer.address.street_address}</p>
                                            </div>
                                        ): (
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
                                                <p className="mb-1"><strong>City:</strong> {selectedCustomer.address.city}</p>
                                                <p className="mb-1"><strong>Country:</strong> {selectedCustomer.address.country}</p>
                                                <p className="mb-0"><strong>Zip Code:</strong> {selectedCustomer.address.postal_code}</p>
                                                <p className="mb-0"><strong>Address:</strong> {selectedCustomer.address.street_address}</p>
                                            </div>
                                        ): (
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
                                            onChange={(value) => handleOrderChange({ target: { name: 'shipping_method', value }})}
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
                                            onChange={(value) => handleOrderChange({ target: { name: 'payment_method', value }})}
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
                                                <div className="col-md-5">
                                                    <Button type="button" onClick={() => showProductModal(index)}>
                                                        {item.productName ? item.productName : 'Select Product from your store'}
                                                    </Button>
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
                                                <div className="col-md-2 mt-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        Remove
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
                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary me-2">Create Order</button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/orders')}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Selection Modal */}
            <Modal
                title="Select Customer"
                visible={isCustomerModalVisible}
                onCancel={() => setIsCustomerModalVisible(false)}
                footer={null}
                width={800}
            >
                <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined />}
                    className="mb-3"
                />
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers
                                .filter(customer => {
                                    const username = customer.first_name || '';
                                    const email = customer.email || '';
                                    const phone = customer.phone_number || '';
                                    const search = searchTerm.toLowerCase();

                                    return username.toLowerCase().includes(search) ||
                                        email.toLowerCase().includes(search) ||
                                        phone.includes(searchTerm);
                                })
                                .map(customer => (
                                    <tr key={customer.id}>
                                        <td>{customer.first_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone_number}</td>
                                        <td>
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={() => handleCustomerSelect(customer)}
                                            >
                                                Select
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Modal>

            <Modal
                title="Select Product"
                visible={isProductModalVisible}
                onCancel={() => setIsProductModalVisible(false)}
                footer={null}
                width={800}
            >
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined />}
                    className="mb-3"
                />
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products
                            .filter(product => {
                                const name = product.name || '';
                                const search = searchTerm.toLowerCase();

                                return name.toLowerCase().includes(search);
                            })
                            .map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        <Button
                                            type="primary"
                                            size="small"
                                            onClick={() => handleProductSelect(product.id)}
                                        >
                                            Select
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
};

export default CreateOrder;