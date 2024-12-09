import {useEffect, useState} from 'react';
import {Table, Modal, Input, Button, Select} from 'antd';
import qs from 'qs';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import {Link, useNavigate} from "react-router-dom";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";

const {confirm} = Modal;
const {Option} = Select;

const Stocks = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        searchText: '',
        location: '',
    });

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        filters: {},
        sortOrder: null,
        sortField: null,
    });

    const {userData} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();

    const fetchData = () => {
        setLoading(true);
        const params = {
            ...getStockParams(tableParams),
        };

        if (searchParams.searchText) {
            params.search = searchParams.searchText;
        }

        if (searchParams.location) {
            params.location = searchParams.location;
        }

        const queryString = qs.stringify(params);
        API.get(`stocks/?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                const {results, count} = response.data;
                setData(results);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: count,
                    },
                });
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error fetching stocks:', error);
                openErrorNotification('There was an error fetching the stock data.');
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const handleDeleteStock = (id) => {
        confirm({
            title: 'Are you sure you want to delete this stock?',
            content: 'Once deleted, this action cannot be undone.',
            onOk() {
                return API.delete(`stocks/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                })
                    .then(() => {
                        openSuccessNotification('Stock deleted successfully');
                        fetchData();
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 401) {
                            openErrorNotification("Unauthorized access");
                            return;
                        }
                        console.error('There was an error deleting the stock:', error);
                        openErrorNotification('There was an error deleting the stock');
                    });
            },
            onCancel() {
            },
        });
    };

    const columns = [
        {
            title: 'Stock Name',
            dataIndex: 'name',
            sorter: true,
            width: '30%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '30%',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '30%',
            render: (location) => location || 'N/A',
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <span>
                    <Link to={`/edit-stock/${record.id}`}>
                        <i className="fa-solid fa-pen-to-square" style={{marginRight: '10px', cursor: 'pointer'}}></i>
                    </Link>
                    <i
                        className="fa-solid fa-trash"
                        style={{color: 'red', cursor: 'pointer'}}
                        onClick={() => handleDeleteStock(record.id)}
                    ></i>
                </span>
            ),
        },
    ];

    const getStockParams = (params) => ({
        page_size: params.pagination?.pageSize,
        page: params.pagination?.current,
        ordering: params.sortField ? `${params.sortOrder === 'descend' ? '-' : ''}${params.sortField}` : undefined,
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: sorter.order,
            sortField: sorter.field,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLocationChange = (value) => {
        setSearchParams((prev) => ({
            ...prev,
            location: value,
        }));
    };

    const handleSearch = () => {
        fetchData()
    };

    const handleResetFilters = () => {
        setSearchParams({
            searchText: '',
            location: '',
        });
        fetchData();
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header"
                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h4 style={{ color: '#696cff' }}>Stock Management</h4>
                    <button className="btn btn-primary" onClick={() => navigate('/add-stock')}>
                        Create New Stock
                    </button>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        {/* Search Text */}
                        <div className="col-md-4">
                            <label htmlFor="searchText" className="form-label">Search Universal</label>
                            <Input
                                id="searchText"
                                name="searchText"
                                value={searchParams.searchText}
                                onChange={handleInputChange}
                                placeholder="Search by name, description, location"
                            />
                        </div>
                        {/* Location */}
                        <div className="col-md-4">
                            <label htmlFor="location" className="form-label">Location</label>
                            <Select
                                id="location"
                                name="location"
                                value={searchParams.location}
                                onChange={handleLocationChange}
                                style={{width: '100%'}}
                            >
                                <Option value="">All Locations</Option>
                                {data.map((stock) => (
                                    <Option key={stock.location} value={stock.location}>
                                        {stock.location}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        {/* Buttons */}
                        <div className="col-md-4">
                            <div className="col-md-6 d-flex">
                                <Button type="default" onClick={handleResetFilters} style={{marginRight: '10px'}}>Reset Filters</Button>
                                <Button type="primary" onClick={handleSearch}>Perform Search</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="table-responsive text-nowrap" style={{padding: '20px'}}>
                    <Table
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
            <hr className="my-5"/>
        </div>
    );
};

export default Stocks;
