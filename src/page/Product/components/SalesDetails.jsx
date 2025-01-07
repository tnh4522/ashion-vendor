// src/components/SalesDetails.jsx
import React, { useEffect, useRef } from 'react';
import { Input, Select, message } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const SalesDetails = ({ formData, handleInputChange, setFormData, isDisabled }) => {
    const salePriceRef = useRef(null); // Ref cho trường sale_price

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('recommend') === 'true' && salePriceRef.current) {
            salePriceRef.current.focus(); // Tập trung vào trường sale_price
            salePriceRef.current.scrollIntoView({ behavior: 'smooth' }); // Cuộn đến trường
            message.info('Please consider setting a sale price for this product to boost sales.');
        }
    }, []);

    // Ta custom logic cho sale_price: phải < price
    const onSalePriceChange = (e) => {
        const value = e.target.value;
        // parse price và sale_price
        const saleVal = parseFloat(value);
        const priceVal = parseFloat(formData.price);

        if (priceVal > 0 && saleVal >= priceVal) {
            message.error("Sale price must be less than price");
            return;
        }
        // sale_price hợp lệ, cập nhật
        handleInputChange(e);
    };

    const onPriceChange = (e) => {
        handleInputChange(e);
        // Khi giá thay đổi, kiểm tra sale_price
        const newPrice = parseFloat(e.target.value);
        const saleVal = parseFloat(formData.sale_price || 0);
        if (newPrice > 0 && saleVal >= newPrice) {
            // reset sale_price hoặc báo lỗi
            message.warn("Sale price no longer valid, adjusting sale price.");
            // reset sale_price về rỗng hoặc giá trị thấp hơn
            setFormData(prev => ({ ...prev, sale_price: '' }));
        }
    };

    return (
        <div className="row">
            <div className="mb-3 col-md-6">
                <label htmlFor="price" className="form-label">Price<span style={{color: 'red'}}>*</span></label>
                <Input
                    className="form-control"
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={onPriceChange}
                    placeholder="Enter price"
                    disabled={isDisabled}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="sale_price" className="form-label">Sale Price</label>
                <Input
                    className="form-control"
                    type="number"
                    id="sale_price"
                    name="sale_price"
                    value={formData.sale_price}
                    onChange={onSalePriceChange}
                    placeholder="Enter sale price"
                    disabled={isDisabled}
                    ref={salePriceRef} // Gán ref
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="start_sale_date" className="form-label">Start Sale Date</label>
                <Input
                    className="form-control"
                    type="date"
                    id="start_sale_date"
                    name="start_sale_date"
                    value={formData.start_sale_date}
                    onChange={handleInputChange}
                    disabled={isDisabled}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="end_sale_date" className="form-label">End Sale Date</label>
                <Input
                    className="form-control"
                    type="date"
                    id="end_sale_date"
                    name="end_sale_date"
                    value={formData.end_sale_date}
                    onChange={handleInputChange}
                    disabled={isDisabled}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="status" className="form-label">Status<span style={{color: 'red'}}>*</span></label>
                <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                    placeholder="Select Status"
                    style={{ width: '100%' }}
                    size="middle"
                    disabled={isDisabled}
                >
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                    <Option value="DRAFT">Draft</Option>
                </Select>
            </div>
            <div className="mb-3 col-md-6">
                <label className="form-label">Is Featured</label>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        disabled={isDisabled}
                    />
                    <label className="form-check-label" htmlFor="is_featured">
                        Featured Product
                    </label>
                </div>
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="video_url" className="form-label">Video URL</label>
                <Input
                    className="form-control"
                    type="url"
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="Enter video URL"
                    disabled={isDisabled}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="meta_title" className="form-label">Meta Title</label>
                <Input
                    className="form-control"
                    type="text"
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="Enter meta title"
                    disabled={isDisabled}
                />
            </div>
            <div className="mb-3 col-md-12">
                <label htmlFor="meta_description" className="form-label">Meta Description</label>
                <TextArea
                    className="form-control"
                    id="meta_description"
                    name="meta_description"
                    rows={3}
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    placeholder="Enter meta description"
                    disabled={isDisabled}
                />
            </div>
        </div>
    );

};

export default SalesDetails;
