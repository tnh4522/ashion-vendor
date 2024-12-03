import { useEffect, useState, useRef } from 'react';
import API from "../../service/service";
import useUserContext from "../../hooks/useUserContext";
import useNotificationContext from "../../hooks/useNotificationContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from 'antd';

const EditProduct = () => {
    const { id } = useParams();
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const mainImageRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        user: userData.id,
        sku: '',
        barcode: '',
        brand: '',
        description: '',
        material: '',
        care_instructions: '',
        category: '',
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

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const handleInputChange = (e) => {
        const { name, value, type, checked, multiple, options } = e.target;
        if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        } else if (multiple) {
            const selectedOptions = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData(prevState => ({
                ...prevState,
                [name]: selectedOptions,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (e) => {
        mainImageRef.current = e.target.files[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Kiểm tra các trường bắt buộc
        const requiredFields = ['name', 'category', 'description', 'sku', 'weight', 'price', 'status'];
        for (let field of requiredFields) {
            if (!formData[field] || formData[field] === '') {
                openErrorNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
                setLoading(false);
                return;
            }
        }

        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== '') {
                formDataToSend.append(key, formData[key]);
            }
        });

        if (mainImageRef.current) {
            if (mainImageRef.current instanceof File) {
                formDataToSend.append('main_image', mainImageRef.current);
            }
        }

        try {
            const response = await API.put(`products/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            if (response.status === 200) {
                openSuccessNotification('Product updated successfully');
                navigate('/products');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('There was an error updating the product:', error);
            openErrorNotification('There was an error updating the product.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await API.get(`products/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                });
                const productData = response.data;
                setFormData({
                    ...formData,
                    ...productData,
                    category: productData.category || '',
                    status: productData.status || 'ACTIVE',
                    is_featured: productData.is_featured || false,
                });
                // Lưu hình ảnh vào ref
                if (productData.main_image) {
                    mainImageRef.current = productData.main_image;
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    logout();
                    return;
                }
                console.error('There was an error fetching the product:', error);
                openErrorNotification('There was an error fetching the product.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await API.get('categories/');
                setCategories(response.data.results);
            } catch (error) {
                console.error('There was an error fetching the categories:', error);
                openErrorNotification('There was an error fetching the categories.');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchProduct();
        fetchCategories();
    }, [id, userData.access, logout, openErrorNotification]);

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    };

    if (loading || loadingCategories) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <h4>Edit Product</h4>
                    <form onSubmit={handleSubmit}>
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
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
                                    onChange={handleInputChange}
                                ></textarea>
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
                                {mainImageRef.current && !(mainImageRef.current instanceof File) && (
                                    <img
                                        src={convertUrl(mainImageRef.current)}
                                        alt="Product"
                                        style={{ marginTop: '10px', maxWidth: '200px' }}
                                    />
                                )}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Material */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="material" className="form-label">Material</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="material"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Care Instructions */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="care_instructions" className="form-label">Care Instructions</label>
                                <textarea
                                    className="form-control"
                                    id="care_instructions"
                                    name="care_instructions"
                                    rows="3"
                                    value={formData.care_instructions}
                                    onChange={handleInputChange}
                                ></textarea>
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Sizes */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="sizes" className="form-label">Sizes</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="sizes"
                                    name="sizes"
                                    value={formData.sizes}
                                    onChange={handleInputChange}
                                    placeholder="e.g., S,M,L,XL"
                                />
                            </div>
                            {/* Colors */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="colors" className="form-label">Colors</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="colors"
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Red,Blue,Green"
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="is_featured">
                                        Featured Product
                                    </label>
                                </div>
                            </div>
                            {/* Video URL */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="video_url" className="form-label">Video URL</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    id="video_url"
                                    name="video_url"
                                    value={formData.video_url}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Meta Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="meta_title" className="form-label">Meta Title</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="meta_title"
                                    name="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Meta Description */}
                            <div className="mb-3 col-md-12">
                                <label htmlFor="meta_description" className="form-label">Meta Description</label>
                                <textarea
                                    className="form-control"
                                    id="meta_description"
                                    name="meta_description"
                                    rows="3"
                                    value={formData.meta_description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-2 text-end">
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update Product
                            </Button>
                            <Button
                                type="default"
                                style={{ marginLeft: '10px' }}
                                onClick={() => navigate('/products')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
