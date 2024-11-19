import { useState } from 'react';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import { useNavigate } from "react-router-dom";
import { Tabs } from 'antd';

function AddBrand() {
    const { userData } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const [formData, setFormData] = useState({
        brand_name: '',
        brand_description: '',
        website: '',
    });
    const [brandLogoFile, setBrandLogoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBrandLogoFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.brand_name === '') {
            openErrorNotification('Brand name is required.');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('brand_name', formData.brand_name);
            formDataToSend.append('brand_description', formData.brand_description);
            formDataToSend.append('website', formData.website);

            if (brandLogoFile) {
                formDataToSend.append('brand_logo', brandLogoFile);
            }

            const response = await API.post('brands/create/', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            openSuccessNotification('Brand created successfully');
            setFormData({
                brand_name: '',
                brand_description: '',
                website: '',
            });
            setBrandLogoFile(null);
            navigator('/brands');
        } catch (error) {
            console.error('Error creating brand:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
                    .join(' ');
                openErrorNotification(errorMessages);
            } else {
                openErrorNotification('Error creating brand.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form id="formBrandSettings" method="POST" onSubmit={handleSubmit}>
                                <Tabs
                                    defaultActiveKey="1"
                                    type="card"
                                    size="large"
                                    style={{ marginBottom: '1.5rem' }}
                                >
                                    <Tabs.TabPane tab="Brand Information" key="1">
                                        <div className="row">
                                            {/* Brand Name */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="brand_name" className="form-label">Brand Name</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="brand_name"
                                                    name="brand_name"
                                                    value={formData.brand_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Brand Description */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="brand_description" className="form-label">Brand Description</label>
                                                <textarea
                                                    className="form-control"
                                                    id="brand_description"
                                                    name="brand_description"
                                                    rows="3"
                                                    value={formData.brand_description}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                            {/* Website */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="website" className="form-label">Website</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="website"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {/* Brand Logo */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="brand_logo" className="form-label">Brand Logo</label>
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    id="brand_logo"
                                                    name="brand_logo"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </div>
                                    </Tabs.TabPane>
                                </Tabs>

                                <div className="mt-2 text-end">
                                    <button
                                        type="reset"
                                        className="btn btn-outline-secondary me-2"
                                        onClick={() => {
                                            setFormData({
                                                brand_name: '',
                                                brand_description: '',
                                                website: '',
                                            });
                                            setBrandLogoFile(null);
                                            navigator('/brands');
                                        }}
                                    >
                                        Turn Back
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Loading...' : 'Create Brand'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBrand;