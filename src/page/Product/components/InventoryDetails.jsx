import React from 'react';
import { Input, Row, Col, Select, Typography, Table, InputNumber, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import API from "../../../service/service.jsx";
import useUserContext from "../../../hooks/useUserContext.jsx";

const { Text } = Typography;
const { Option } = Select;

/**
 * InventoryDetails Component
 * Manages the inventory details of the product, including variants and stock.
 *
 * @param {Object} props - Component props.
 */
const InventoryDetails = ({
                              formData,
                              handleInputChange,
                              variants,
                              setVariants,
                              originalSizes,
                              originalColors,
                              filterSizes,
                              setFilterSizes,
                              filterColors,
                              setFilterColors,
                              filteredGroupedVariants,
                              totalQuantity,
                              handleStockQuantityChange,
                              isDisabled
                          }) => {
    const { userData, logout } = useUserContext();

    const stockDetailColumns = [
        {
            title: 'Stock Name',
            dataIndex: 'stock_name',
            key: 'stock_name',
            sorter: (a, b) => a.stock_name.localeCompare(b.stock_name),
            sortDirections: ['ascend', 'descend'],
            render: text => <Text>{text}</Text>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
            sortDirections: ['ascend', 'descend'],
            render: (text, record) => (
                <InputNumber
                    min={0}
                    value={record.quantity}
                    onChange={(value) => handleStockQuantityChange(value, record, record.parentKey)}
                    disabled={isDisabled}
                />
            ),
        },
        {
            title: 'Variant Image',
            dataIndex: 'image',
            key: 'image',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {record.image ? (
                        <img
                            src={record.image}
                            alt="Variant"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                    ) : (
                        <Text>No Image</Text>
                    )}
                    {!isDisabled && (
                        <Upload
                            beforeUpload={(file) => {
                                setVariants(prevVariants =>
                                    prevVariants.map(v =>
                                        v.variant_id === record.variant_id
                                            ? { ...v, newImageFile: file, image: URL.createObjectURL(file) }
                                            : v
                                    )
                                );
                                message.success('Variant image selected. It will be uploaded when you update the product.');
                                return false;
                            }}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={12}>
                    <label htmlFor="weight" className="form-label">Weight</label>
                    <Input
                        type="number"
                        step="0.01"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Enter weight"
                        disabled={isDisabled}
                    />
                </Col>
                <Col xs={24} sm={12}>
                    <label htmlFor="dimensions" className="form-label">Dimensions</label>
                    <Input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        placeholder="Enter dimensions"
                        disabled={isDisabled}
                    />
                </Col>
            </Row>
            <div>
                <label className="form-label">Product Variants</label>
                <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Filter by Size"
                            style={{ width: '100%' }}
                            value={filterSizes}
                            onChange={(values) => setFilterSizes(values)}
                            disabled={isDisabled}
                        >
                            {originalSizes.map(size => (
                                <Option key={size} value={size}>
                                    {size}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Filter by Color"
                            style={{ width: '100%' }}
                            value={filterColors}
                            onChange={(values) => setFilterColors(values)}
                            disabled={isDisabled}
                        >
                            {originalColors.map(color => (
                                <Option key={color} value={color}>
                                    {color}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={12} style={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                        <Text strong>Total Quantity: {totalQuantity}</Text>
                    </Col>
                </Row>
                <Table
                    dataSource={filteredGroupedVariants}
                    columns={[
                        {
                            title: 'Size',
                            dataIndex: 'size',
                            key: 'size',
                            sorter: (a, b) => a.size.localeCompare(b.size),
                            sortDirections: ['ascend', 'descend'],
                            render: text => <Text>{text}</Text>,
                        },
                        {
                            title: 'Color',
                            dataIndex: 'color',
                            key: 'color',
                            sorter: (a, b) => a.color.localeCompare(b.color),
                            sortDirections: ['ascend', 'descend'],
                            render: text => <Text>{text}</Text>,
                        },
                        {
                            title: 'Total Quantity',
                            dataIndex: 'totalQuantity',
                            key: 'totalQuantity',
                            render: text => <Text strong>{text}</Text>,
                        },
                    ]}
                    expandable={{
                        expandedRowRender: record => {
                            const expandedData = record.stocks.map(stockItem => {
                                const foundVariant = variants.find(
                                    v => v.stock_id === stockItem.stock_id &&
                                        v.size === record.size &&
                                        v.color === record.color
                                );
                                return {
                                    ...stockItem,
                                    parentKey: record.key,
                                    variant_id: foundVariant ? foundVariant.variant_id : null,
                                    image: foundVariant ? foundVariant.image : null,
                                };
                            });

                            return (
                                <Table
                                    dataSource={expandedData}
                                    columns={stockDetailColumns}
                                    pagination={false}
                                    rowKey="stock_id"
                                />
                            );
                        },
                        rowExpandable: record => record.stocks.length > 0,
                    }}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20'],
                    }}
                    bordered
                    size="middle"
                    rowKey="key"
                />
            </div>
        </div>
    );
};

export default InventoryDetails;
