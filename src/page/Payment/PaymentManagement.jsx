import {useEffect, useState} from "react";
import {
    Collapse,
    Empty,
    Form,
    Input,
    Button,
    message,
    Switch,
    Divider,
    Typography,
    theme,
    Table,
    Select,
    Space,
} from "antd";
import payment_service from "../../constant/module_payment.json";
import {CaretRightOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const {Panel} = Collapse;
const {Title} = Typography;

const PaymentManagement = () => {
    const navigator = useNavigate();
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        setPaymentMethods(payment_service);
    }, []);

    const handleFormSubmit = (values, methodIndex, env) => {
        const updatedMethods = [...paymentMethods];
        const method = updatedMethods[methodIndex];

        if (env === "test") {
            method.test_mode = values.test_mode ? "on" : "off";
            method.client_id_test = values.client_id_test;
            method.client_secret_test = values.client_secret_test;
            method.merchant_id_test = values.merchant_id_test;
            method.cle_api_test = values.cle_api_test;
        } else if (env === "prod") {
            method.client_id_prod = values.client_id_prod;
            method.client_secret_prod = values.client_secret_prod;
            method.merchant_id_prod = values.merchant_id_prod;
            method.cle_api_prod = values.cle_api_prod;
        }

        method.site_code_viva = values.site_code_viva;
        method.payment_form_color = values.payment_form_color;

        setPaymentMethods(updatedMethods);
        message.success(`Payment Method "${method.name}" updated successfully!`);
    };

    const {token} = theme.useToken();
    const panelStyle = {
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
    };

    const options = [
        {
            label: 'Card Payment',
            value: 'card',
            emoji: '💳',
            desc: 'Card Payment',
        },
        {
            label: 'Bank Transfer',
            value: 'bank',
            emoji: '🏦',
            desc: 'Bank Transfer',
        },
        {
            label: 'QR Code',
            value: 'qr',
            emoji: '📱',
            desc: 'QR Code',
        },
        {
            label: 'Paypal',
            value: 'paypal',
            emoji: '💰',
            desc: 'Paypal',
        }
    ];


    const renderCollapsePanels = () => {
        if (paymentMethods.length === 0) {
            return (
                <Panel header="No Payment Methods Available" key="no-data" style={panelStyle}>
                    <Empty description="No Payment Methods Available"/>
                </Panel>
            );
        }

        return paymentMethods.map((method, index) => (
            <Panel
                header={
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Title level={5} style={{color: "rgb(27 32 116)"}}>
                            {method.lib}<span className="link-danger mx-3"
                                              onClick={() => window.open(method.platform_url, '_blank')}>
                            <i className="fa-solid fa-share-from-square"></i> Connect to Viva Login Page
                        </span>
                        </Title>
                        <img className="me-3" src={method.logo_url} alt={method.lib} style={{width: "90px"}}/>
                    </div>
                }
                key={method.module_name}
                style={panelStyle}
            >
                <div>
                    <Divider orientation="left">Test Environment
                        <Switch className="ms-3" defaultChecked={method.test_mode === "on"}/>
                    </Divider>
                    <Form
                        className="row"
                        layout="vertical"
                        initialValues={{
                            test_mode: method.test_mode === "on",
                            client_id_test: method.client_id_test,
                            client_secret_test: method.client_secret_test,
                            merchant_id_test: method.merchant_id_test,
                            cle_api_test: method.cle_api_test,
                            site_code_viva: method.site_code_viva,
                            payment_form_color: method.payment_form_color,
                            payment_method: method.payment_method,
                        }}
                        onFinish={(values) => handleFormSubmit(values, index, "test")}
                    >
                        <Form.Item
                            label="Payment Method"
                            name="payment_method"
                            className="mb-3 col-md-6"
                        >
                            <Select
                                mode="multiple"
                                style={{
                                    width: '100%',
                                }}
                                placeholder="select one country"
                                defaultValue={payment_service.payment_method}
                                options={options}
                                optionRender={(option) => (
                                    <Space><span role="img" aria-label={option.data.label}>{option.data.emoji}</span>
                                        {option.data.desc}
                                    </Space>
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Client ID (Test)"
                            name="client_id_test"
                            className="mb-3 col-md-6"
                            rules={[
                                {required: true, message: "Please enter Client ID for Test."},
                            ]}
                        >
                            <Input placeholder="Enter Client ID for Test"/>
                        </Form.Item>

                        <Form.Item
                            label="Client Secret (Test)"
                            name="client_secret_test"
                            className="mb-3 col-md-6"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Client Secret for Test.",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Enter Client Secret for Test"/>
                        </Form.Item>

                        <Form.Item
                            label="Merchant ID (Test)"
                            name="merchant_id_test"
                            className="mb-3 col-md-6"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Merchant ID for Test.",
                                },
                            ]}
                        >
                            <Input placeholder="Enter Merchant ID for Test"/>
                        </Form.Item>

                        <Form.Item
                            label="CLE API (Test)"
                            name="cle_api_test"
                            className="mb-3 col-md-6"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter CLE API for Test.",
                                },
                            ]}
                        >
                            <Input placeholder="Enter CLE API for Test"/>
                        </Form.Item>

                        <Form.Item
                            label="Site Code Viva"
                            name="site_code_viva"
                            className="mb-3 col-md-6"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Site Code Viva.",
                                },
                            ]}
                        >
                            <Input placeholder="Enter Site Code Viva"/>
                        </Form.Item>

                        <Form.Item className="mt-3 text-end">
                            <Button type="primary" htmlType="submit">
                                Save Test Configuration
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider orientation="left">Production Environment
                        <Switch className="ms-3" defaultChecked={method.test_mode === "off"}/>
                    </Divider>

                    <Form
                        className="row"
                        layout="vertical"
                        initialValues={{
                            client_id_prod: method.client_id_prod,
                            client_secret_prod: method.client_secret_prod,
                            merchant_id_prod: method.merchant_id_prod,
                            cle_api_prod: method.cle_api_prod,
                            site_code_viva: method.site_code_viva,
                            payment_form_color: method.payment_form_color,
                        }}
                        onFinish={(values) => handleFormSubmit(values, index, "prod")}
                    >
                        <Form.Item
                            label="Payment Method"
                            name="payment_method"
                            className="mb-3 col-md-6"
                        >
                            <Select
                                mode="multiple"
                                style={{
                                    width: '100%',
                                }}
                                placeholder="select one country"
                                defaultValue={payment_service.payment_method}
                                options={options}
                                optionRender={(option) => (
                                    <Space><span role="img" aria-label={option.data.label}>{option.data.emoji}</span>
                                        {option.data.desc}
                                    </Space>
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Client ID (Production)"
                            name="client_id_prod"
                            className="mb-3 col-md-6"
                            rules={[
                                {required: true, message: "Please enter Client ID for Prod."},
                            ]}
                        >
                            <Input placeholder="Enter Client ID for Production"/>
                        </Form.Item>

                        <Form.Item
                            label="Client Secret (Production)"
                            name="client_secret_prod"
                            className="mb-3 col-md-6"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Client Secret for Prod.",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Enter Client Secret for Production"/>
                        </Form.Item>

                        <Form.Item
                            label="Merchant ID (Production)"
                            name="merchant_id_prod"
                            className="mb-3 col-md-6"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Merchant ID for Prod.",
                                },
                            ]}
                        >
                            <Input placeholder="Enter Merchant ID for Production"/>
                        </Form.Item>

                        <Form.Item
                            label="CLE API (Production)"
                            name="cle_api_prod"
                            className="mb-3 col-md-6"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter CLE API for Prod.",
                                },
                            ]}
                        >
                            <Input placeholder="Enter CLE API for Production"/>
                        </Form.Item>

                        <Form.Item
                            label="Site Code Viva"
                            name="site_code_viva"
                            className="mb-3 col-md-6"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Site Code Viva.",
                                },
                            ]}
                        >
                            <Input placeholder="Enter Site Code Viva"/>
                        </Form.Item>

                        <Form.Item className="mt-3 text-end">
                            <Button type="primary" htmlType="submit">
                                Save Production Configuration
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Panel>
        ));
    };

    const data = [
        {
            key: '1',
            name: 'Cash on Delivery',
            description: 'Payment method for cash on delivery',
            status: 'Active',
            actions: [],
            emoji: '💵',
            module: 'COD',
        },
        {
            key: '2',
            name: 'Card Payment',
            description: 'Payment method for card payment',
            status: 'Active',
            actions: ['Edit'],
            emoji: '💳',
            module: 'Viva',
        },
        {
            key: '3',
            name: 'QR Code',
            description: 'Payment method for QR Code',
            status: 'Active',
            actions: ['Edit'],
            emoji: '📱',
            module: 'PayOS',
        },
        {
            key: '4',
            name: 'Bank Transfer',
            description: 'Payment method for Bank Transfer',
            status: 'Active',
            actions: ['Edit'],
            emoji: '🏦',
            module: 'Bank',
        },
        {
            key: '5',
            name: 'Paypal',
            description: 'Payment method for Paypal',
            status: 'Active',
            actions: ['Edit'],
            emoji: '💰',
            module: 'Viva',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '10px'}}>{record.emoji}</span>
                    {name}
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            render: (module) => (
                <span
                    className="badge bg-primary"
                    style={{padding: '5px 10px', borderRadius: '5px', color: 'white'}}
                >
                    {module}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span
                    className={`badge ${status === 'Active' ? 'bg-success' : 'bg-danger'}`}
                    style={{padding: '5px 10px', borderRadius: '5px', color: 'white'}}
                >
                    {status}
                </span>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (actions) => (
                <div>
                    {actions.map((action) => (
                        <button key={action} className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => navigator("/edit-payment-method")}>
                            {action}
                        </button>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header">
                    <Title level={4} style={{color: "#696cff"}}>
                        Default Payment Method
                    </Title>
                </div>
                <div className="card-body">
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    />
                </div>
            </div>
            <div className="card mt-3">
                <div className="card-header"
                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Title level={4} style={{color: "#696cff"}}>
                        Module Payment Configuration
                    </Title>
                    <button className="btn btn-primary">
                        Create Module Payment
                    </button>
                </div>
                <div className="card-body">
                    <Collapse
                        bordered={false}
                        defaultActiveKey={
                            paymentMethods.length > 0 ? [paymentMethods[0].name] : []
                        }
                        onChange={(key) => console.log("Active Collapse Panel Key:", key)}
                        expandIcon={({isActive}) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                        )}
                        style={{
                            background: token.colorBgContainer,
                        }}
                    >
                        {renderCollapsePanels()}
                    </Collapse>
                </div>
            </div>
        </div>
    );
};

export default PaymentManagement;
