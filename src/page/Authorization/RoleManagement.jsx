import { useEffect, useState } from 'react';
import { Table, Input, Button } from 'antd';
import qs from 'qs';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import { useNavigate } from "react-router-dom";

const RolesManagement = () => {
    const navigate = useNavigate();
    const { userData } = useUserContext();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        searchText: '',
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

    const fetchData = () => {
        setLoading(true);
        const params = qs.stringify(getRoleParams(tableParams));
        API.get(`roles/?${params}`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                const { results, count } = response.data;
                setData(results);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: count,
                    },
                });
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const getRoleParams = (params) => ({
        page_size: params.pagination?.pageSize,
        page: params.pagination?.current,
        ordering: params.sortField
            ? `${params.sortOrder === 'descend' ? '-' : ''}${params.sortField}`
            : undefined,
        search: searchParams.searchText, // Thêm tham số tìm kiếm
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: 1,
            },
        });
        fetchData();
    };

    const handleResetFilters = () => {
        setSearchParams({
            searchText: '',
        });
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: 1,
            },
        });
        fetchData();
    };

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

    const handleEdit = (role) => {
        navigate(`/edit-role/${role.id}`);
    };

    const handleDelete = (role) => {
        API.delete(`roles/${role.id}/`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error('Error deleting role:', error);
            });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            width: '10%',
        },
        {
            title: 'Role Name',
            dataIndex: 'name',
            sorter: true,
            width: '40%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '40%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <span>
                    <i
                        className="fa-solid fa-pen-to-square"
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                        onClick={() => handleEdit(record)}
                    ></i>
                    <i
                        className="fa-solid fa-trash"
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleDelete(record)}
                    ></i>
                </span>
            ),
        },
    ];

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div
                    className="card-header"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <h5 className="card-title">Roles Management</h5>
                    <button className="btn btn-primary" onClick={() => navigate('/create-role')}>
                        Create Role
                    </button>
                </div>
                {/* Search Section */}
                <div className="card-body">
                    <div className="row mb-4">
                        {/* Search Input */}
                        <div className="col-md-4">
                            <label htmlFor="searchText" className="form-label">
                                Search by Role Name or Description
                            </label>
                            <Input
                                id="searchText"
                                name="searchText"
                                value={searchParams.searchText}
                                onChange={handleInputChange}
                                placeholder="Search by role name or description"
                            />
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="row mb-4">
                        <div className="col-md-6 d-flex">
                            <Button
                                type="default"
                                onClick={handleResetFilters}
                                style={{ marginRight: '10px' }}
                            >
                                Reset Filters
                            </Button>
                            <Button type="primary" onClick={handleSearch}>
                                Perform Search
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Table */}
                <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
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
            <hr className="my-5" />
        </div>
    );
};

export default RolesManagement;
