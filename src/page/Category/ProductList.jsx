import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, message } from 'antd';
import API from "../../service/service.jsx";

const ProductList = () => {
    const {id, name} = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productCount, setProductCount] = useState(0);
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await API.get(`categories/${id}/products/`);
            setProducts(response.data);
            setProductCount(response.data.length)
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [id]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleDateString(),
        },
    ];

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <h5 className="card-header">Category {name} - {productCount} Products</h5>
                <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
                    <Table
                        columns={columns}
                        dataSource={products}
                        rowKey={(record) => record.id}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductList;