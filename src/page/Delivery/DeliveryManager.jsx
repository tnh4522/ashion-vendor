import { useEffect, useState } from "react";
import {Collapse, Empty, Form, Input, Button, message, theme} from "antd";
import delivery_service from "../../constant/delivery_service.json";
import {CaretRightOutlined} from "@ant-design/icons";

const DeliveryManager = () => {
    const [standardServices, setStandardServices] = useState([]);
    const [expressServices, setExpressServices] = useState([]);

    useEffect(() => {
        const standard = delivery_service.filter(
            (service) => service.shipping_method === "Standard"
        );
        const express = delivery_service.filter(
            (service) => service.shipping_method === "Express"
        );

        setStandardServices(standard);
        setExpressServices(express);
    }, []);

    const handleFormSubmit = (values, service) => {
        console.log("Updated Values:", values);
        console.log("Service Being Updated:", service);

        message.success(`Service "${service.name_service}" updated successfully!`);
    };

    const { token } = theme.useToken();
    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    const renderCollapseItems = (services) => {
        if (services.length === 0) {
            return [
                {
                    key: 'no-data',
                    label: 'No Services Available',
                    children: <Empty description="No Services Available" />,
                },
            ];
        }

        return services.map((service) => ({
            key: service.code,
            label: service.name_service,
            style: panelStyle,
            children: (
                <Form
                    className="row"
                    layout="vertical"
                    initialValues={{
                        code: service.code,
                        token: service.config.token,
                        shop_id: service.config.shop_id,
                        client_id: service.config.client_id || "",
                    }}
                    onFinish={(values) => handleFormSubmit(values, service)}
                >
                    <Form.Item
                        label="Code"
                        name="code"
                        className="mb-3 col-md-6"
                    >
                        <Input placeholder="Enter service code" />
                    </Form.Item>

                    <Form.Item
                        label="Shop ID"
                        name="shop_id"
                        className="mb-3 col-md-6"
                    >
                        <Input placeholder="Enter Shop ID" />
                    </Form.Item>

                    <Form.Item
                        label="Token"
                        name="token"
                        className="mb-3 col-md-6"
                    >
                        <Input placeholder="Enter token" />
                    </Form.Item>

                    <Form.Item
                        label="API Key"
                        name="api_key"
                        className="mb-3 col-md-6"
                    >
                        <Input placeholder="Enter API Key" />
                    </Form.Item>

                    <Form.Item
                        label="Client ID"
                        name="client_id"
                        className="mb-3 col-md-6"
                    >
                        <Input placeholder="Enter Client ID" />
                    </Form.Item>

                    <Form.Item
                        label="Client Secret"
                        name="client_secret"
                        className="mb-3 col-md-6"
                    >
                        <Input placeholder="Enter Client Secret" />
                    </Form.Item>

                    <Form.Item className="mt-3 text-end">
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            ),
        }));
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title" style={{ color: "#696cff" }}>
                        Standard Delivery
                    </h4>
                </div>
                <div className="card-body">
                    <Collapse
                        bordered={false}
                        defaultActiveKey={["1"]}
                        onChange={(key) => console.log("Active Collapse Panel Key:", key)}
                        items={renderCollapseItems(standardServices)}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        style={{
                            background: token.colorBgContainer,
                        }}
                    />
                </div>
            </div>

            <div className="card mt-3">
                <div className="card-header">
                    <h4 className="card-title" style={{ color: "#696cff" }}>
                        Express Delivery
                    </h4>
                </div>
                <div className="card-body">
                    <Collapse
                        bordered={false}
                        defaultActiveKey={["1"]}
                        onChange={(key) => console.log("Active Collapse Panel Key:", key)}
                        items={renderCollapseItems(expressServices)}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        style={{
                            background: token.colorBgContainer,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeliveryManager;
