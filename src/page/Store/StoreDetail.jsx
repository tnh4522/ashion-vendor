import {useEffect, useState} from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {Tabs} from 'antd';
import {Link, useNavigate, useParams} from "react-router-dom";

function StoreDetail() {
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const {userData, logout} = useUserContext();
    const navigator = useNavigate();
    const store_id = useParams().id;

    const [store, setStore] = useState(null);
    const [formData, setFormData] = useState({
        store_name: "",
        store_description: "",
        address: "",
        policies: "",
        return_policy: "",
        shipping_policy: "",
        rating: "",
        total_sales: "",
        joined_date: "",
        is_verified: false,
        seller_rating: "",
    });

    const [storeLogoFile, setStoreLogoFile] = useState(null);
    const [storeLogoPreview, setStoreLogoPreview] = useState(null);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await API.get("/stores/" + store_id + "/", {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.code === 'token_not_valid') {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                setStore(response.data);
                setFormData({
                    store_name: response.data.store_name || "",
                    store_description: response.data.store_description || "",
                    address: response.data.address || "",
                    policies: response.data.policies || "",
                    return_policy: response.data.return_policy || "",
                    shipping_policy: response.data.shipping_policy || "",
                    rating: response.data.rating || "",
                    total_sales: response.data.total_sales || "",
                    joined_date: response.data.joined_date || "",
                    is_verified: response.data.is_verified || false,
                    seller_rating: response.data.seller_rating || "",
                });
                if (response.data.store_logo) {
                    setStoreLogoPreview(convertUrl(response.data.store_logo));
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
                if (error.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
            }
        };

        if (userData.access) {
            fetchStoreData();
        }
    }, [userData.access]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleFileChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            setStoreLogoFile(file);
            setStoreLogoPreview(URL.createObjectURL(file));
        }
    };

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("store_name", formData.store_name);
            formDataToSend.append("store_description", formData.store_description);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("policies", formData.policies);
            formDataToSend.append("return_policy", formData.return_policy);
            formDataToSend.append("shipping_policy", formData.shipping_policy);

            if (storeLogoFile instanceof File) {
                formDataToSend.append("store_logo", storeLogoFile);
            }

            const response = await API.put(`/stores/${store_id}/`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setStore(response.data);
            openSuccessNotification("Store updated successfully!");
            navigator("/stores");
        } catch (error) {
            console.error("Error updating store data:", error);
            openErrorNotification("Failed to update store.");
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <Link to={"/stores"} className="btn btn-primary mb-4">
                        <i className="bx bx-arrow-back me-2"></i>
                        Back to Stores
                    </Link>
                    {/* Store Details */}
                    <div className="card mb-4">
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            style={{margin: '1.5rem 1rem'}}
                        >
                            <Tabs.TabPane tab="Details" key="1">
                                <div className="card-body">
                                    <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Store Name */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="store_name" className="form-label">Store Name</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="store_name"
                                                    name="store_name"
                                                    value={formData.store_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            {/* Store Logo */}
                                            <div className="mb-3 col-md-6 text-center">
                                                {storeLogoPreview && (
                                                    <div className="mt-3">
                                                        <img src={storeLogoPreview} alt="Store Logo"
                                                             style={{maxWidth: "200px", maxHeight: "200px"}}/>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="store_logo" className="form-label">Store Logo</label>
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    id="store_logo"
                                                    name="store_logo"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            {/* Store Description */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="store_description" className="form-label">Store
                                                    Description</label>
                                                <textarea
                                                    className="form-control"
                                                    id="store_description"
                                                    name="store_description"
                                                    rows="3"
                                                    value={formData.store_description}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                            {/* Rating */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="rating" className="form-label">Rating</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="rating"
                                                    name="rating"
                                                    value={formData.rating}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Address" key="2">
                                <div className="card-body">
                                    <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Address */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="city" className="form-label">City</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="state" className="form-label">State</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="country" className="form-label">Country</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="country"
                                                    name="country"
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="zip_code" className="form-label">Zip Code</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="zip_code"
                                                    name="zip_code"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Policies" key="3">
                                <div className="card-body">
                                    <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Policies */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="policies" className="form-label">Policies</label>
                                                <textarea
                                                    className="form-control"
                                                    id="policies"
                                                    name="policies"
                                                    rows="3"
                                                    value={formData.policies}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                            {/* Return Policy */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="return_policy" className="form-label">Return
                                                    Policy</label>
                                                <textarea
                                                    className="form-control"
                                                    id="return_policy"
                                                    name="return_policy"
                                                    rows="3"
                                                    value={formData.return_policy}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                            {/* Shipping Policy */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="shipping_policy" className="form-label">Shipping
                                                    Policy</label>
                                                <textarea
                                                    className="form-control"
                                                    id="shipping_policy"
                                                    name="shipping_policy"
                                                    rows="3"
                                                    value={formData.shipping_policy}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Sales" key="4">
                                <div className="card-body">
                                    <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Total Sales */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="total_sales" className="form-label">Total Sales</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="total_sales"
                                                    name="total_sales"
                                                    value={formData.total_sales}
                                                    readOnly
                                                />
                                            </div>
                                            {/* Joined Date */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="joined_date" className="form-label">Joined Date</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="joined_date"
                                                    name="joined_date"
                                                    value={formData.joined_date}
                                                    readOnly
                                                />
                                            </div>
                                            {/* Is Verified */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="is_verified" className="form-label">Is Verified</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="is_verified"
                                                    name="is_verified"
                                                    value={formData.is_verified ? "Yes" : "No"}
                                                    readOnly
                                                />
                                            </div>
                                            {/* Seller Rating */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="seller_rating" className="form-label">Seller
                                                    Rating</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="seller_rating"
                                                    name="seller_rating"
                                                    value={formData.seller_rating}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset" className="btn btn-outline-secondary me-2">Cancel
                                            </button>
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

export default StoreDetail;
