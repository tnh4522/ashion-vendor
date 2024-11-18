import { useEffect, useState } from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { Tabs } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";

function BrandDetail() {
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const { userData, logout } = useUserContext();
    const navigator = useNavigate();
    const brand_id = useParams().id;

    const [brand, setBrand] = useState(null);
    const [formData, setFormData] = useState({
        brand_name: "",
        brand_description: "",
        website: "",
    });
    const [brandLogoFile, setBrandLogoFile] = useState(null);

    useEffect(() => {
        const fetchBrandData = async () => {
            try {
                const response = await API.get(`/brands/${brand_id}/`, {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.code === 'token_not_valid') {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                setBrand(response.data);
                setFormData({
                    brand_name: response.data.brand_name || "",
                    brand_description: response.data.brand_description || "",
                    website: response.data.website || "",
                });
                if (response.data.brand_logo) {
                    setBrandLogoFile(convertUrl(response.data.brand_logo));
                }
            } catch (error) {
                console.error("Error fetching brand data:", error);
                if (error.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
            }
        };

        if (userData.access) {
            fetchBrandData();
        }
    }, [userData.access]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBrandLogoFile(file);
        }
    };

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("brand_name", formData.brand_name);
            formDataToSend.append("brand_description", formData.brand_description);
            formDataToSend.append("website", formData.website);

            if (brandLogoFile instanceof File) {
                formDataToSend.append("brand_logo", brandLogoFile);
            }

            const response = await API.put(`/brands/${brand_id}/`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setBrand(response.data);
            openSuccessNotification("Brand updated successfully!");
            navigator("/brands");
        } catch (error) {
            console.error("Error updating brand data:", error);
            openErrorNotification("Failed to update brand.");
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <Link to={"/brands"} className="btn btn-primary mb-4">
                        <i className="bx bx-arrow-back me-2"></i>
                        Back to Brands
                    </Link>
                    {/* Brand Details */}
                    <div className="card mb-4">
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            style={{ margin: '1.5rem 1rem' }}
                        >
                            <Tabs.TabPane tab="Brand Details" key="1">
                                <div className="card-body">
                                    <form id="formBrandSettings" method="POST" onSubmit={handleSubmit}>
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
                                                {brandLogoFile && !(brandLogoFile instanceof File) && (
                                                    <div className="mt-3">
                                                        <img src={brandLogoFile} alt="Brand Logo" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">Cancel</button>
                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BrandDetail;
