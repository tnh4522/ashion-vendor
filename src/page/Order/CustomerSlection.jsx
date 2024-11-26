import { Button, Modal, Input, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const CustomerSelection = ({ 
    selectedCustomer, 
    showModal, 
    isModalVisible, 
    setIsModalVisible, 
    searchTerm,
    setSearchTerm,
    customers,
    handleCustomerSelect 
}) => {
    return (
        <>
            <div className="mb-3 col-md-12">
                <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label">Customer</label>
                    <div className='d-flex justify-content-start'>
                        <Button type="button" onClick={showModal} icon={<SearchOutlined />}>
                            Select Customer
                        </Button>
                    </div>
                </div>
                {selectedCustomer && (
                    <div className="selected-customer-info mt-2 p-2 border rounded">
                        <p className="mb-1">Name: {selectedCustomer.username}</p>
                        <p className="mb-1">Email: {selectedCustomer.email}</p>
                        <p className="mb-0">Phone: {selectedCustomer.phone_number}</p>
                    </div>  
                )}
            </div>

            <Modal
                title="Select Customer"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined />}
                    className="mb-3"
                />
                <Table
                    columns={[
                        { title: 'Name', dataIndex: 'username' },
                        { title: 'Email', dataIndex: 'email' },
                        { title: 'Phone', dataIndex: 'phone_number' },
                        {
                            title: 'Action',
                            render: (_, record) => (
                                <Button 
                                    type="primary" 
                                    size="small"
                                    onClick={() => handleCustomerSelect(record)}
                                >
                                    Select
                                </Button>
                            )
                        }
                    ]}
                    dataSource={customers.filter(customer => {
                        const search = searchTerm.toLowerCase();
                        return (
                            customer.username?.toLowerCase().includes(search) ||
                            customer.email?.toLowerCase().includes(search) ||
                            customer.phone_number?.includes(searchTerm)
                        );
                    })}
                    rowKey="id"
                />
            </Modal>
        </>
    );
};

export default CustomerSelection;