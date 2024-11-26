import { Select, Button } from 'antd';
const { Option } = Select;

const OrderItems = ({ 
    orderData, 
    products, 
    handleProductSelect, 
    handleItemChange, 
    removeItem,
    addItem 
}) => {
    return (
        <div className="mb-3 col-md-12">
            <label className="form-label">Order Items</label>
            {orderData.items.map((item, index) => (
                <div key={index} className="row mb-3 align-items-end">
                    {/* Product Selection */}
                    <div className="col-md-3 ">
                        <label className="form-label">Product</label>
                        <Select
                            className="w-100"
                            placeholder="Select product"
                            value={item.product || undefined}
                            onChange={(value) => handleProductSelect(index, value)}
                            required
                        >
                            {products.map(product => (
                                <Option key={product.id} value={product.id}>
                                    {product.name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Size, Color, Quantity, Price fields */}
                    <div className="col-md-2">
                        <label className="form-label">Size</label>
                        <select
                            className="form-select"
                            name="size"
                            value={item.size}
                            onChange={(e) => handleItemChange(index, e)}
                        >
                            <option value="">Select size</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">Color</label>
                        <input
                            className="form-control"
                            type="text"
                            name="color"
                            value={item.color}
                            onChange={(e) => handleItemChange(index, e)}
                        />
                    </div>
                    <div className="col-md-1">
                        <label className="form-label">Qty</label>
                        <input
                            className="form-control"
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            min="1"
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Price</label>
                        <input
                            className="form-control"
                            type="number"
                            name="price"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                            readOnly
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Total</label>
                        <input
                            className="form-control"
                            type="number"
                            value={item.total_price}
                            readOnly
                        />
                    </div>

                    <div className=" d-flex justify-content-end mt-2">
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeItem(index)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <div className="d-flex justify-content-end mt-2">
                <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={addItem}
                >
                   + Add Item
                </button>
            </div>

        </div>
    );
};

export default OrderItems;
