import React from 'react';
import PropTypes from 'prop-types';
import formatCurrency from "../../../constant/formatCurrency.js";

// eslint-disable-next-line react/prop-types
const PrintOrder = React.forwardRef(({ order, customer, provinceName, districtName, wardName }, ref) => {
    console.log(order);
    if (!order || !order.order_number) {
        return null; // hoặc return <div>Loading...</div>;
    }
    return (
        <div ref={ref} style={{ padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2>ORDER INVOICE</h2>
                <h3>#{order.order_number}</h3>
                <p>Date: {new Date(order.created_at).toLocaleString()}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h4>Customer Information</h4>
                <p>Name: {customer?.first_name} {customer?.last_name}</p>
                <p>Email: {customer?.email}</p>
                <p>Phone: {customer?.phone_number}</p>
                <p>Address: {wardName}, {districtName}, {provinceName}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h4>Order Details</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Size</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Color</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.product_name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.size}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.color}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatCurrency(item.price)}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatCurrency(item.total_price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal_price)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <span>Shipping:</span>
                    <span>{formatCurrency(order.shipping_cost)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <span>Tax:</span>
                    <span>{formatCurrency(order.tax_amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <span>Discount:</span>
                    <span>{formatCurrency(order.discount_amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                    <strong>Total:</strong>
                    <strong>{formatCurrency(order.total_price)}</strong>
                </div>
            </div>
        </div>
    );
});

PrintOrder.propTypes = {
    order: PropTypes.object.isRequired,
    customer: PropTypes.object,
    provinceName: PropTypes.string,
    districtName: PropTypes.string,
    wardName: PropTypes.string
};

PrintOrder.displayName = 'PrintOrder';

export default PrintOrder;