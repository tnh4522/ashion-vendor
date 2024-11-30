import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const {logout} = useUserContext();
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        try {
            await API.delete(`categories/${id}/delete/`, {
                headers: {
                    // 'Authorization': `Bearer ${userData.access}`,
                },
            });
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            console.error('There was an error deleting the category:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-category/${id}/`);
    };

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
            render: (text, record) => (
                <span>
                    <span>
                    <Button
                        type="link"
                        icon={<i className="fa-solid fa-pen-to-square"></i>}
                        onClick={() => handleEdit(record.id)}
                    >
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<i className="fa-solid fa-trash"></i>}
                        onClick={() => handleDelete(record.id)}
                    >
                    </Button>
                </span>
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
