import { useState, useEffect } from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { useNavigate } from "react-router-dom";
import CustomerSelection from './CustomerSlection.jsx';
import OrderItems from './OrderItem.jsx';
import OrderSummary from './OrderSummary';
import { Select} from 'antd';

const CreateOrder = () => {
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [products, setProducts] = useState([]);

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
        const calculateTotals = () => {
            const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0;
            const shipping = orderData.shipping_cost || 0;
            const discount = orderData.discount_amount || 0;

            setOrderData(prev => ({
                ...prev,
                subtotal_price: subtotal,
                tax_amount: tax,
                total_price: subtotal + tax + shipping - discount
            }));
        };

        calculateTotals();
    }, [orderData.items, orderData.shipping_cost, orderData.discount_amount]);

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
    }, [userData.access, openErrorNotification]);

    const showModal = async () => {
        try {
            const response = await API.get('users/', { 
                headers: { 'Authorization': `Bearer ${userData.access}` },
                params: {
                page_size: 1000 
            }
            });

            const filteredUsers = response.data.results.filter(user => 
                user.role === null 
            );
            
            setCustomers(filteredUsers);
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error:', error); 
            openErrorNotification('Error loading customers');
        }
    };

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setOrderData(prev => ({
            ...prev,
            customer: customer.id,
            shipping_address: customer.default_shipping_address,
            billing_address: customer.default_billing_address,
        }));
        setIsModalVisible(false);
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

        // Calculate item total
        if (name === 'quantity' || name === 'price') {
            updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].price;
        }

        setOrderData({ ...orderData, items: updatedItems });
    };

    const handleProductSelect = (index, productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const updatedItems = [...orderData.items];
            updatedItems[index] = {
                ...updatedItems[index],
                product: productId,
                price: product.price,
                total_price: product.price * updatedItems[index].quantity
            };
            setOrderData({ ...orderData, items: updatedItems });
        }
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
            <div className="card mb-4">
                <h5 className="card-header">Create Order</h5>
                <div className="card-body">
                    <form onSubmit={handleOrderSubmit}>
                        <div className="row">
                            <CustomerSelection 
                                selectedCustomer={selectedCustomer}
                                showModal={showModal}
                                isModalVisible={isModalVisible}
                                setIsModalVisible={setIsModalVisible}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                customers={customers}
                                handleCustomerSelect={handleCustomerSelect}
                            />

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
                                                <Select.Option key={method.value} value={method.value}>
                                                    {method.label}
                                                </Select.Option>
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
                                                <Select.Option key={method.value} value={method.value}>
                                                    {method.label}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>

                            <OrderItems 
                                orderData={orderData}
                                products={products}
                                handleProductSelect={handleProductSelect}
                                handleItemChange={handleItemChange}
                                removeItem={removeItem}
                                addItem={addItem}
                            />

                            <OrderSummary orderData={orderData} />

                            {/* Action Buttons - Thêm class d-flex và justify-content-end */}
                            <div className="mt-4 d-flex justify-content-end">
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
    );
};

export default CreateOrder;