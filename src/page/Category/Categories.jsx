import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, message, Radio, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PictureOutlined, CheckCircleOutlined, CloseCircleOutlined, AppstoreOutlined} from '@ant-design/icons';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import ExportModal from './ExportModal.jsx';
import AddCategoryModal from './AddCategoryModal.jsx'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { convertToSlug} from '../../utils/Function.jsx';
const { confirm } = Modal;

const Categories = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryCount, setCategoryCount] = useState(0); 
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
    const [newCategoryName, setNewCategoryName] = useState(''); 
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const { logout } = useUserContext();
    const navigate = useNavigate();

    const [isImportModalVisible, setIsImportModalVisible] = useState(false); 
    const [importFileType, setImportFileType] = useState('csv'); 
    const [importFile, setImportFile] = useState(null); 
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);
    
    const [isAddPlusModalVisible, setIsAddPlusModalVisible] = useState(false);

    const showAddPlusModal = () => {
        setIsAddPlusModalVisible(true);
    };

    const hideAddPlusModal = () => {
        setIsAddPlusModalVisible(false);
    };

    const showExportModal = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select at least one category to export.');
            return;
        }
        setIsExportModalVisible(true);
    };

    const hideExportModal = () => {
        setIsExportModalVisible(false);
    };

    const handleExport = (fileType) => {
        hideExportModal(); 
        handleExportSelected(fileType); 
    };

    const prepareExportData = (data) => {
        return data.map((item) => ({
            id: 0,
            name: item.name,
            slug: item.slug,
            description: item.description || '',
            meta_title: item.meta_title || '',
            meta_description: item.meta_description || '',
            image: null,
        }));
    };

    const handleExportSelected = async (fileType) => {
        if (selectedRowKeys.length === 0) {
            message.warning('No categories selected to export.');
            return;
        }

        setLoading(true);
        try {
            const response = await API.post('categories/export-selected/', {
                ids: selectedRowKeys,
            });

            const selectedCategories = response.data;
            if (!selectedCategories || selectedCategories.length === 0) {
                message.warning('No categories to export.');
                return;
            }

            const processedData = prepareExportData(selectedCategories);

            if (fileType === 'csv') {
                exportToCSV(processedData);
            } else if (fileType === 'excel') {
                exportToExcel(processedData);
            } else if (fileType === 'json') {
                exportToJSON(processedData);
            } else if (fileType === 'pdf') {
                exportToPDF(selectedCategories);
            } else {
                message.error('Unsupported file type.');
            }
        } catch (error) {
            console.error('Error exporting categories:', error);
            message.error('Failed to export selected categories.');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (data) => {
        const ws = XLSX.utils.json_to_sheet(data);
    
        const csv = XLSX.utils.sheet_to_csv(ws);
    
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'categories.csv';
        link.click();
    };

    const exportToPDF = (data) => {
        const doc = new jsPDF();
    
        data.forEach((item, index) => {
            const yPosition = index * 50 + 10;
    
            doc.setFontSize(12);
            doc.text(`Category: ${item.name}`, 10, yPosition);
            doc.text(`Slug: ${item.slug}`, 10, yPosition + 10);
            doc.text(`Description: ${item.description || ''}`, 10, yPosition + 20);
    
            if (item.image) {
                doc.addImage(
                    item.image,
                    'JPEG', 
                    10, 
                    yPosition + 25,
                    50, 
                    30 
                );
            } else {
                doc.text("No Image Available", 10, yPosition + 25);
            }
            if (index < data.length - 1) {
                doc.addPage();
            }
        });
    
        doc.save('categories_with_images.pdf');
    };

    const exportToJSON = (categories) => {
        const jsonData = JSON.stringify(categories, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "categories.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
        XLSX.writeFile(workbook, "categories.xlsx");
    };

    const showImportModal = () => {
        setIsImportModalVisible(true);
    };
    
    const hideImportModal = () => {
        setIsImportModalVisible(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImportFile(file);
        }
    };

    const handleAdd = async () => {
        if (!newCategoryName) {
            message.error('Category name is required');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', newCategoryName);
        formDataToSend.append('is_active', false);
        formDataToSend.append('slug', convertToSlug(newCategoryName));

        try {
            const response = await API.post('categories/create/', formDataToSend, {
                headers: {
                    // 'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Category added successfully');
            setNewCategoryName('');
            fetchCategories(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('Failed to add category');
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    const handleAddPlus = () => {
        navigate('/');
    }

    const handleActive = async () => {
        try {
            await API.post('categories/update-active/', {
                ids: selectedRowKeys,
                is_active: true
            });
            message.success('Categories activated successfully');
            fetchCategories(true);
        } catch (error) {
            console.error('There was an error activating the categories:', error);
            message.error('Failed to activate categories');
        }
    };

    const handleUnactive = async () => {
        try {
            await API.post('categories/update-active/', {
                ids: selectedRowKeys,
                is_active: false
            });
            message.success('Categories deactivated successfully');
            fetchCategories(true);
        } catch (error) {
            console.error('There was an error deactivating the categories:', error);
            message.error('Failed to deactivate categories');
        }
    };

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure you want to delete these categories ?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeleteSelected();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleDeleteSelected = async () => {
        try {
            await API.post('categories/delete/', {
                ids: selectedRowKeys
            });
            message.success('Categories deleted successfully');
            fetchCategories(true);
            setSelectedRowKeys([]);
        } catch (error) {
            console.error('There was an error deleting the categories:', error);
            message.error('Failed to delete categories');
        }
    };

    const handleImport = (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension === 'csv') {
            handleCSVImport(file);
        } else if (fileExtension === 'json') {
            handleJSONImport(file);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            handleExcelImport(file);
        } else {
            message.error('Unsupported file type');
        }
    };

    const handleCSVImport = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = Papa.parse(reader.result, {
                header: true,
                skipEmptyLines: true,
            });
    
            const data = result.data.map(row => {
                if (row.hasOwnProperty('is_active')) {
                    row.is_active = row.is_active.toLowerCase() === 'true';
                }
    
                if (!row.slug || row.slug.trim() === '') {
                    row.slug = convertToSlug(row.name);
                } else {
                    row.slug = convertToSlug(row.slug);
                }

                return Object.fromEntries(
                    Object.entries(row).filter(([key, value]) => value !== "" && value !== null)
                );
            });
    
            importData(data);
        };
        reader.readAsText(file);
    };
    
    const handleJSONImport = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result);

            const processedData = data.map(row => {

                if (row.hasOwnProperty('is_active')) {
                    row.is_active = row.is_active.toString().toLowerCase() === 'true';
                }

                if (!row.slug || row.slug.trim() === '') {
                    row.slug = convertToSlug(row.name);
                } else {
                    row.slug = convertToSlug(row.slug);
                }
                return Object.fromEntries(
                    Object.entries(row).filter(([key, value]) => value !== "" && value !== null)
                );
            });

            importData(processedData);
        };
        reader.readAsText(file);
    };

    const handleExcelImport = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            
            const arrayBuffer = reader.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
    
            const result = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    
            const processedData = result.slice(1).map(row => {
                let rowData = {};
                rowData.name = row[0];
                rowData.slug = row[1];
                rowData.is_active = row[2];
    
                rowData.meta_title = row[3] || '';
                rowData.meta_description = row[4] || '';
                rowData.sort_order = row[5] || 0;
                rowData.parent = row[6] || null;
    
                if (rowData.hasOwnProperty('is_active')) {
                    rowData.is_active = rowData.is_active.toString().toLowerCase() === 'true';
                }
    
                if (!rowData.slug || rowData.slug.trim() === '') {
                    rowData.slug = convertToSlug(rowData.name);
                } else {
                    rowData.slug = convertToSlug(rowData.slug);
                }
    
                return Object.fromEntries(
                    Object.entries(rowData).filter(([key, value]) => value !== "" && value !== null)
                );
            });
    
            importData(processedData);
        };
        reader.readAsArrayBuffer(file); 
    };
    
    const importData = async (data) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data)); 
    
        try {
            const response = await API.post('categories/import/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Import data successfully!');
            fetchCategories(true);
        } catch (error) {
            console.error('Error importing data:', error);
            message.error('Failed to import data');
        }
    };

    const handleAddCategory = () => {
        fetchCategories(true);
    };

    const columns = [
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            width: '80%',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {record.image ? (
                        <img
                            src={record.image}
                            alt={record.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '20px' }}
                        />
                    ) : (
                        <PictureOutlined style={{ fontSize: '50px', marginRight: '10px' }} /> 
                    )}
                    <Link to={`/categories/${record.id}/products/${record.name}`} >{record.name} </Link>
                </div>
            ),
        },
        {
            title: 'Is Active',
            dataIndex: 'is_active',
            key: 'is_active',
            align: 'center',
            width: '10%',
            render: (isActive) => (
                isActive ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />
            ),
        },
        {
            title: 'Sub-Category',
            dataIndex: 'subcategory_count',
            key: 'subcategory_count',
            align: 'center',
            width: '10%',
        }
    ];

    const fetchCategories = async (withoutParent = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('sort_by', sortBy);
            params.append('order', order);
            if (withoutParent) {
                params.append('without_parent', 'true');
            }
    
            const response = await API.get(`categories/?${params.toString()}`);
            setData(response.data.results);
            setCategoryCount(response.data.results.length); 
        } catch (error) {
            if (error.status === 401) {
                logout();
                return;
            }
            console.error('There was an error fetching the categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(true);
    }, [sortBy, order]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const onRowClick = (record) => {
        const selectedKeys = [...selectedRowKeys];
        const index = selectedKeys.indexOf(record.id);
        if (index === -1) {
            selectedKeys.push(record.id);
        } else {
            selectedKeys.splice(index, 1);
        }
        setSelectedRowKeys(selectedKeys);
    };


    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
            <h3 className="card-header">List Categories ({categoryCount})</h3>
                <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={data}
                        rowKey={(record) => record.id}
                        loading={loading}
                        locale={{
                            emptyText: (
                              <div style={{ textAlign: 'center' }}>
                                <AppstoreOutlined style={{ fontSize: '48px', marginTop:'10px', marginBottom: '8px', color: '#7d818a' }} />
                                <h5>No categories available</h5>
                              </div>
                            ),
                          }}
                        onRow={(record) => ({
                            onClick: () => onRowClick(record),
                        })}
                    />
                </div>
                <div style={{backgroundColor: '#eeeeee'}} className='mx-3 mb-3' >
                    <div className="d-flex justify-content-between align-items-center" style={{ padding: '20px' }}>
                        <div>
                            {selectedRowKeys.length > 0 && (
                                <Space>
                                    <Button onClick={handleActive}>Active</Button>
                                    <Button onClick={handleUnactive}>Unactive</Button>
                                    <Button onClick={showDeleteConfirm} >Delete</Button>
                                    <Button onClick={showExportModal} style={{ marginRight: '10px' }}>Export</Button>
                                </Space>
                            )}
                            <Button onClick={showImportModal} style={{ marginRight: '10px' }}>Import</Button>
                            <Modal
                                title="Import Categories"
                                open={isImportModalVisible}
                                onCancel={hideImportModal}
                                footer={null}
                                width={600}
                            >
                                <div style={{ padding: '20px' }}>
                                    <Radio.Group
                                        value={importFileType}
                                        onChange={(e) => setImportFileType(e.target.value)}
                                        style={{ marginBottom: '20px' }}
                                    >
                                        <Radio value="csv">CSV</Radio>
                                        <Radio value="json">JSON</Radio>
                                        <Radio value="excel">Excel</Radio>
                                    </Radio.Group>

                                    <div>
                                        <input
                                            type="file"
                                            accept=".csv,.json,.xlsx,.xls"
                                            onChange={handleFileChange}
                                            style={{ marginBottom: '20px', display: 'block' }}
                                        />
                                    </div>

                                    {importFile && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <strong>Selected file:</strong> {importFile.name}
                                        </div>
                                    )}

                                    <Space>
                                        <Button onClick={hideImportModal}>Cancel</Button>
                                        <Button
                                            type="primary"
                                            onClick={() => handleImport(importFile)}
                                            disabled={!importFile}
                                        >
                                            Import
                                        </Button>
                                    </Space>
                                </div>
                            </Modal>
                            <ExportModal
                                open={isExportModalVisible}
                                onClose={hideExportModal}
                                onExport={handleExport}
                            />
                        </div>
                        <div className="d-flex align-items-center ">
                            <Input 
                                placeholder="New Category" 
                                value={newCategoryName}
                                required
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                style={{ marginRight: '10px' }}
                                onKeyDown={handleKeyDown}
                            />
                            <Button type="primary" className='mx-2' onClick={handleAdd}>Add</Button>
                            <Button type="primary" onClick={showAddPlusModal}>Add +</Button>
                            <AddCategoryModal
                                isVisible={isAddPlusModalVisible}
                                onClose={hideAddPlusModal}
                                onAddCategory={handleAddCategory}
                                categories={data}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end" style={{ padding: '20px' }}>
                        <Radio.Group onChange={(e) => setSortBy(e.target.value)} value={sortBy} style={{ marginRight: '10px' }}>
                            <Radio value="name">Sort by Name</Radio>
                            <Radio value="sort_order">Sort by Order</Radio>
                        </Radio.Group>
                    </div>
                </div>
            </div>
            <hr className="my-5" />
        </div>
    );
};

export default Categories;
