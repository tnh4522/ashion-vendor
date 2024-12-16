import { useState } from 'react';
import { Select, Button, Form } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;

// eslint-disable-next-line react/prop-types
const SelectStatus = ({ currentOrderStatus, currentPaymentStatus, orderStatuses, paymentStatuses, onSubmitStatus }) => {
    const [orderStatus, setOrderStatus] = useState(currentOrderStatus);
    const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
    const handleSave = () => {
        onSubmitStatus(orderStatus, paymentStatus);
    };

    return (
        <div className="row" style={{ padding: '20px' }}>
            <h3>Update Status</h3>
            <Form layout="vertical">
                <Form.Item label="Order Status">
                    <Select
                        value={orderStatus}
                        onChange={setOrderStatus}
                        style={{ width: '100%' }}
                    >
                        {orderStatuses.map(status => (
                            <Option key={status} value={status}>
                                {status}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Payment Status">
                    <Select
                        value={paymentStatus}
                        onChange={setPaymentStatus}
                        style={{ width: '100%' }}
                    >
                        {paymentStatuses.map(status => (
                            <Option key={status} value={status}>
                                {status}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                    <Button type="primary" onClick={handleSave}>Save Changes</Button>
                </div>
            </Form>
        </div>
    );
};

SelectStatus.propTypes = {
    currentOrderStatus: PropTypes.string.isRequired,
    currentPaymentStatus: PropTypes.string.isRequired,
    orderStatuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    paymentStatuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmitStatus: PropTypes.func.isRequired
};

export default SelectStatus;