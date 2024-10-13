import { useEffect, useState } from 'react';
import { Table } from 'antd';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";

const Categories = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const {logout} = useUserContext();

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image',
            width: '10%',
            render: (text, record) => (
                record.image? (
                    <img
                        src={convertUrl(record.image)}
                        alt={record.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0' }} />
                )
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Is Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (isActive ? 'Yes' : 'No'),
        },
        {
            title: 'Action',
            key: 'x',
            dataIndex: '',
            render: () => (
                <span>
                    <i className="fa-solid fa-pen-to-square" style={{ marginRight: '10px' }}></i>
                    <i className="fa-solid fa-trash"></i>
                </span>
            ),
        }
    ];

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    }

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await API.get('categories/');
                setData(response.data.results);
            } catch (error) {
                if(error.status === 401) {
                    logout();
                    return;
                };
                console.error('There was an error fetching the categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <h5 className="card-header">List Categories</h5>
                <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey={(record) => record.id}
                        loading={loading}
                    />
                </div>
            </div>
            <hr className="my-5" />
        </div>
    );
};

export default Categories;
