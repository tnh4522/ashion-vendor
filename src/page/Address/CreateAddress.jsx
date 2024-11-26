import { Form, Input, Select, Switch, Button } from 'antd';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateAddress = () => {
    const { userData } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const response = await API.post('address/create/', values, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                openSuccessNotification('Address created successfully');
                navigate('/users');
            }
        } catch (error) {
            console.error('Error creating address:', error);
            openErrorNotification('Error creating address');
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <h5 className="card-header">Create New Address</h5>
                <div className="card-body">
                    <Form
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item
                                name="full_name"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please enter full name' }]}
                            >
                                <Input />
                        </Form.Item>

                        <Form.Item
                                name="phone_number"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please enter phone number' }]}
                            >
                                <Input />
                        </Form.Item>

                        <Form.Item
                                name="province"
                                label="Province"
                                rules={[{ required: true, message: 'Please enter province' }]}
                            >
                                <Input />
                        </Form.Item>

                        <Form.Item
                            name="street_address"
                            label="Street Address"
                            rules={[{ required: true, message: 'Please enter street address' }]}
                        >
                            <Input placeholder="Enter street address" />
                        </Form.Item>

                        <Form.Item
                            name="city"
                            label="City"
                            rules={[{ required: true, message: 'Please enter city' }]}
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>

                        <Form.Item
                            name="state"
                            label="State"
                            rules={[{ required: true, message: 'Please enter state' }]}
                        >
                            <Input placeholder="Enter state" />
                        </Form.Item>

                        <Form.Item
                            name="postal_code"
                            label="Postal Code"
                            rules={[{ required: true, message: 'Please enter postal code' }]}
                        >
                            <Input placeholder="Enter postal code" />
                        </Form.Item>

                        <Form.Item
                            name="country"
                            label="Country"
                            rules={[{ required: true, message: 'Please select country' }]}
                        >
                            <Select placeholder="Select country">
                                <Option value="US">United States</Option>
                                <Option value="CA">Canada</Option>
                                <Option value="UK">United Kingdom</Option>
                                <Option value="AU">Australia</Option>
                                <Option value="VN">Vietnam</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="is_default"
                            label="Set as Default Address"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Form>
                    <div className="mt-4">
                        <Button type="primary" onClick={handleSubmit} className="me-2">
                            Save Address
                        </Button>
                        <Button onClick={() => navigate('/users')}> 
                            Cancel
                        </Button> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAddress; 