import React from 'react';
import { Form, Input, Select, Switch, Button } from 'antd';

const { Option } = Select;

const AddressForm = ({ onSubmit }) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <div className="card">
            <h5 className="card-header" style={{ color: '#696cff' }}>Add New Address</h5>
            <div className="card-body">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        country: 'Vietnam',
                        default: false,
                    }}
                >
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                name="full_name"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please enter full name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="col-md-6">
                            <Form.Item
                                name="phone_number"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please enter phone number' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        name="street_address"
                        label="Street Address"
                        rules={[{ required: true, message: 'Please enter street address' }]}
                    >
                        <Input />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                name="city"
                                label="City"
                                rules={[{ required: true, message: 'Please enter city' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                name="province"
                                label="Province"
                                rules={[{ required: true, message: 'Please enter province' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                name="postal_code"
                                label="Postal Code"
                                rules={[{ required: true, message: 'Please enter postal code' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                name="country"
                                label="Country"
                            >
                                <Input disabled defaultValue="Vietnam" />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        name="address_type"
                        label="Address Type"
                        rules={[{ required: true, message: 'Please select address type' }]}
                    >
                        <Select>
                            <Option value="SHIPPING">Shipping</Option>
                            <Option value="BILLING">Billing</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="default"
                        valuePropName="checked"
                        label="Set as Default Address"
                    >
                        <Switch />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                name="latitude"
                                label="Latitude"
                                rules={[{ type: 'number', message: 'Latitude must be a number' }]}
                            >
                                <Input type="number" step="0.000001" />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                name="longitude"
                                label="Longitude"
                                rules={[{ type: 'number', message: 'Longitude must be a number' }]}
                            >
                                <Input type="number" step="0.000001" />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Button type="primary" onClick={handleSubmit}>
                            Save Address
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddressForm;
