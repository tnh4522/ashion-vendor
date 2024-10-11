import {useEffect, useState} from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {useNavigate} from "react-router-dom";

const AddProduct = () => {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        barcode: '',
        brand: '',
        description: '',
        material: '',
        care_instructions: '',
        category: '',
        tags: [],
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
        main_image: null,
        video_url: '',
        meta_title: '',
        meta_description: '',
    });

    const [categories, setCategories] = useState([]); // Categories dropdown values
    const [tags, setTags] = useState([]); // Tags dropdown values

    const handleChange = (e) => {
        const {name, value, type, checked, multiple, options} = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if (multiple) {
            const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
            setFormData({
                ...formData,
                [name]: selectedOptions,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleImageChange = (e) => {
        setFormData({...formData, main_image: e.target.files[0]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== '') {
                if (key === 'tags') {
                    formData[key].forEach(tagId => {
                        formDataToSend.append('tags', tagId);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });

        try {
            const response = await API.post('products/create/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            if(response.status === 201) {
                openSuccessNotification('Product added successfully');
                navigate('/categories');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            ;
            console.error('There was an error adding the product:', error);
            openErrorNotification('There was an error adding the product');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('categories/');
                setCategories(response.data.results);
            } catch (error) {
                console.error('There was an error fetching the categories:', error);
            }
        };

        // const fetchTags = async () => {
        //     try {
        //         const response = await API.get('tags/');
        //         setTags(response.data);
        //     } catch (error) {
        //         console.error('There was an error fetching the tags:', error);
        //     }
        // };

        fetchCategories();
        // fetchTags();
    }, []);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <h5 className="card-header">Add Product</h5>
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

                                    {/* Tags */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="tags" className="form-label">Tags</label>
                                        <select
                                            id="tags"
                                            name="tags"
                                            className="form-select"
                                            multiple
                                            value={formData.tags}
                                            onChange={handleChange}
                                        >
                                            {tags.map((tag) => (
                                                <option key={tag.id} value={tag.id}>
                                                    {tag.name}
                                                </option>
                                            ))}
                                        </select>
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

                                    {/* Sale Price */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="sale_price" className="form-label">Sale Price</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            id="sale_price"
                                            name="sale_price"
                                            value={formData.sale_price}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Start Sale Date */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="start_sale_date" className="form-label">Start Sale Date</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            id="start_sale_date"
                                            name="start_sale_date"
                                            value={formData.start_sale_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* End Sale Date */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="end_sale_date" className="form-label">End Sale Date</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            id="end_sale_date"
                                            name="end_sale_date"
                                            value={formData.end_sale_date}
                                            onChange={handleChange}
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

                                    {/* Weight */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="weight" className="form-label">Weight (kg)</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            step="0.01"
                                            id="weight"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Dimensions */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="dimensions" className="form-label">Dimensions</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="dimensions"
                                            name="dimensions"
                                            value={formData.dimensions}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Sizes */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="sizes" className="form-label">Sizes (comma-separated)</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="sizes"
                                            name="sizes"
                                            value={formData.sizes}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Colors */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="colors" className="form-label">Colors (comma-separated)</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="colors"
                                            name="colors"
                                            value={formData.colors}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-select"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                            <option value="DRAFT">Draft</option>
                                        </select>
                                    </div>

                                    {/* Is Featured */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Is Featured</label>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="is_featured"
                                                name="is_featured"
                                                checked={formData.is_featured}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="is_featured">
                                                Featured Product
                                            </label>
                                        </div>
                                    </div>

                                    {/* Main Image */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="main_image" className="form-label">Main Image</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="main_image"
                                            name="main_image"
                                            accept="image/*"
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
