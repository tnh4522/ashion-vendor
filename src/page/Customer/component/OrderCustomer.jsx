import { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";
import API from "../../../service/service.jsx";
import useUserContext from "../../../hooks/useUserContext.jsx";
import useNotificationContext from "../../../hooks/useNotificationContext.jsx";
import formatCurrency from "../../../constant/formatCurrency.js";
import {Link} from "react-router-dom";

function OrderCustomer({ customer_id }) {
    const { userData, logout } = useUserContext();
    const { openErrorNotification } = useNotificationContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerOrders = async () => {
            setLoading(true);
            try {
                const response = await API.get(`/orders/customer/${customer_id}/`, {
                    headers: { Authorization: `Bearer ${userData.access}` },
                });

                if (response.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                setOrders(response.data.results);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load customer orders.");
                setLoading(false);
                if (error.response?.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                }
            }
        };

        if (userData.access) {
            fetchCustomerOrders();
        }
    }, [customer_id, userData.access, openErrorNotification, logout]);

    const columns = [
        {
            title: "Order ID",
            key: "order_number",
            render: (order) => <Link to={`/order-detail/${order.id}`}>{order.order_number}</Link>,
        },
        {
            title: "Order Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Total Price",
            dataIndex: "total_price",
            key: "total_price",
            render: (price) => <strong>{formatCurrency(price)}</strong>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
    ];

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default OrderCustomer;
