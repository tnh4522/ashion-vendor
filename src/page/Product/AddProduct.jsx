import {useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        barcode: '',
        brand: '',
        description: '',
        material: '',
        care_instructions: '',
        category: '',
        tags: '',
        price: '',
        sale_price: '',
        start_sale_date: '',
        end_sale_date: '',
        stock: 0,
        weight: '',
        dimensions: '',
        sizes: '',
        colors: '',
        status: 'ACTIVE',
        is_featured: false,
        is_new_arrival: false,
        is_on_sale: false,
        rating: 0,
        num_reviews: 0,
        quantity_sold: 0,
        main_image: null,
        video_url: '',
        meta_title: '',
        meta_description: '',
    });

    const [categories, setCategories] = useState([]); // Categories dropdown values
    const [tags, setTags] = useState([]); // Tags dropdown values

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        setFormData({...formData, main_image: e.target.files[0]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await axios.post('/api/products/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Product added successfully:', response.data);
        } catch (error) {
            console.error('There was an error adding the product:', error);
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <h5 className="card-header">Profile Details</h5>
                        <hr className="my-0"/>
                        <div className="card-body">
                            <form id="formAddProduct" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Product Name */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="name" className="form-label">Product Name</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* SKU */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="sku" className="form-label">SKU</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="sku"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Barcode */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="barcode" className="form-label">Barcode</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="barcode"
                                            name="barcode"
                                            value={formData.barcode}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Brand */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="brand" className="form-label">Brand</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="brand"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="mb-3 col-md-12">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="category" className="form-label">Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            className="form-select"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="price" className="form-label">Price</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Stock */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="stock" className="form-label">Stock</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            id="stock"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Main Image */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="main_image" className="form-label">Main Image</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="main_image"
                                            name="main_image"
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    {/* Additional Fields as needed... */}

                                    <div className="mt-2">
                                        <button type="submit" className="btn btn-primary me-2">Add Product</button>
                                        <button type="reset" className="btn btn-outline-secondary">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
