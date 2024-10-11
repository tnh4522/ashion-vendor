import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Switch} from 'antd';
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {UserContext} from "../../context/UserContext.jsx";
import API from "../../service/service.jsx";

const AddCategory = () => {
    const { userData } = useContext(UserContext);

    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const [formData, setFormData] = useState({
        name: '',
        parent: '',
        slug: '',
        description: '',
        image: null,
        is_active: true,
        meta_title: '',
        meta_description: '',
        sort_order: 0,
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setFormData({...formData, image: e.target.files[0]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== '') {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await API.post('categories/create/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            openSuccessNotification('Category added successfully');
            navigate('/categories');
        } catch (error) {
            console.error('There was an error adding the category:', error);
            openErrorNotification('There was an error adding the category');
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <h5 className="card-header">Add Category</h5>
                        <hr className="my-0"/>
                        <div className="card-body">
                            <form id="formAddCategory" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Category Name */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="name" className="form-label">Category Name</label>
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

                                    {/* Slug */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="slug" className="form-label">Slug</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="slug"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            required
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
                                        ></textarea>
                                    </div>

                                    {/* Image */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="image" className="form-label">Image</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="image"
                                            name="image"
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    {/* Is Active */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="is_active" className="form-label">Is Active</label>
                                        <Switch id="is_active"
                                                onChange={(checked) => setFormData({...formData, is_active: checked})}
                                                checked={formData.is_active} style={{margin: 16}}/>
                                    </div>


                                    <div className="mt-2">
                                        <button type="submit" className="btn btn-primary me-2">Add Category</button>
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

export default AddCategory;