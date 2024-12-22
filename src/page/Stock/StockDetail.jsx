import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table, Typography, Image } from "antd";
import API from "../../service/service.jsx";

const { Text } = Typography;

function StockDetail() {
    const { id } = useParams(); // Lấy ID kho từ URL
    const [data, setData] = useState([]); // Lưu danh sách sản phẩm
    const [loading, setLoading] = useState(false); // Trạng thái loading

    useEffect(() => {
        setLoading(true);
        API.get(`stock/${id}/products`)
            .then((response) => {
                setData(response.data.results || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [id]);

    // Cột trong bảng
    const columns = [
        {
            title: "Image",
            dataIndex: "product",
            key: "image",
            render: (product) => (
                <Image
                    src={product.main_image}
                    alt={product.name}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                    fallback="https://via.placeholder.com/50"
                />
            ),
        },
        {
            title: "Product Name",
            dataIndex: "product",
            key: "name",
            render: (product) => <Text strong>{product.name}</Text>,
        },
        {
            title: "Variants",
            dataIndex: "product",
            key: "variants",
            render: (product) =>
                product.stock_variants.map((variant) => (
                    <div key={variant.id}>
                        <Text>{variant.variant_name}:</Text> <Text strong>{variant.quantity}</Text>
                    </div>
                )),
        },
        {
            title: "Price",
            dataIndex: "product",
            key: "price",
            render: (product) => <Text>{product.price}</Text>,
        },
        {
            title: "Stock",
            dataIndex: "product",
            key: "stock",
            render: (product) => {
                if(product.stock > 100) {
                    return <Text type="success" strong={true}>{product.stock}</Text>
                } else if(product.stock < 10) {
                    return <Text type="danger" strong={true}>{product.stock}</Text>
                } else {
                    return <Text type="warning" strong={true}>{product.stock}</Text>
                }
            }
        }
    ];

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ marginTop: "20px" }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.id}
                    loading={loading}
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
}

export default StockDetail;
