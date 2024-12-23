import React from 'react';
import { Input, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const BasicInformation = ({ formData, handleInputChange, handleSizesChange, handleColorsChange, isDisabled }) => {
    return (
        <div className="row">
            <div className="mb-3 col-md-12">
                <label htmlFor="care_instructions" className="form-label">Care Instructions</label>
                <TextArea
                    className="form-control"
                    id="care_instructions"
                    name="care_instructions"
                    rows={3}
                    value={formData.care_instructions}
                    onChange={handleInputChange}
                    placeholder="Enter care instructions"
                    disabled={isDisabled}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="sizes" className="form-label">Sizes</label>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Add sizes (e.g., S, M, L, XL)"
                    value={formData.sizes}
                    onChange={handleSizesChange}
                    disabled={isDisabled}
                >
                    {formData.sizes.map(size => (
                        <Option key={size} value={size}>
                            {size}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="colors" className="form-label">Colors</label>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Add colors (e.g., Red, Blue, Green)"
                    value={formData.colors}
                    onChange={handleColorsChange}
                    disabled={isDisabled}
                >
                    {formData.colors.map(color => (
                        <Option key={color} value={color}>
                            {color}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="mb-3 col-md-12">
                <label htmlFor="description" className="form-label">Description</label>
                <TextArea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    disabled={isDisabled}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="brand" className="form-label">Brand</label>
                <Input
                    className="form-control"
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                    disabled={isDisabled}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="material" className="form-label">Material</label>
                <Input
                    className="form-control"
                    type="text"
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="Enter material"
                    disabled={isDisabled}
                />
            </div>
        </div>
    );
};

export default BasicInformation;
