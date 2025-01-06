import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table, Typography, Image } from "antd";
import API from "../../service/service.jsx";
import formatCurrency from "../../constant/formatCurrency.js";
const { Text } = Typography;

function StockDetail() {
    const { id } = useParams();
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        API.get(`stocks/${id}/products`)
            .then((response) => {
                const filteredData = response.data.results.map(product => {
                    const filteredVariants = product.product.stock_variants.filter(variant => variant.stock.id === parseInt(id));
                    const totalStock = filteredVariants.reduce((total, variant) => total + variant.quantity, 0);
                    return {
                        ...product,
                        product: {
                            ...product.product,
                            stock_variants: filteredVariants,
                            stock: totalStock
                        }
                    };
                });
                console.log(filteredData);
                setData(filteredData || []);
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
            key: "product",
            render: (product) => {
                const imageSrc =
                    product.images?.[0]?.image || // Nếu product.images[0].image hợp lệ
                    "https://via.placeholder.com/50"; // Fallback khi không có hình ảnh
            
                return (
                    <Image
                        src={imageSrc}
                        alt={product.name || "Product Image"}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                        fallback="https://via.placeholder.com/50"
                    />
                );
            },
            
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
            sorter: (a, b) => a.product.price - b.product.price,
            align: 'center',
            render: (product) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {formatCurrency(product.price)}
                </Text>
            ),
        },
        {
            title: "Stock",
            dataIndex: "product",
            key: "stock",
            align: 'center',
            sorter: (a, b) => a.product.stock - b.product.stock,
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