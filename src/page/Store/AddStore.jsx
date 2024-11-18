import {useState} from 'react';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import {useNavigate} from "react-router-dom";
import {Tabs} from 'antd';

function AddStore() {
    const {userData} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const [formData, setFormData] = useState({
        store_name: '',
        store_description: '',
        address: '',
        policies: '',
        return_policy: '',
        shipping_policy: '',
    });
    const [storeLogoFile, setStoreLogoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setStoreLogoFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.store_name === '') {
            openErrorNotification('Store name is required.');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('store_name', formData.store_name);
            formDataToSend.append('store_description', formData.store_description);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('policies', formData.policies);
            formDataToSend.append('return_policy', formData.return_policy);
            formDataToSend.append('shipping_policy', formData.shipping_policy);

            if (storeLogoFile) {
                formDataToSend.append('store_logo', storeLogoFile);
            }

            const response = await API.post('stores/create/', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            openSuccessNotification('Store created successfully');
            setFormData({
                store_name: '',
                store_description: '',
                address: '',
                policies: '',
                return_policy: '',
                shipping_policy: '',
            });
            setStoreLogoFile(null);
            navigator('/stores');
        } catch (error) {
            console.error('Error creating store:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
                    .join(' ');
                openErrorNotification(errorMessages);
            } else {
                openErrorNotification('Error creating store.');
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
                            <form id="formStoreSettings" method="POST" onSubmit={handleSubmit}>
                                <Tabs
                                    defaultActiveKey="1"
                                    type="card"
                                    size="large"
                                    style={{marginBottom: '1.5rem'}}
                                >
                                    <Tabs.TabPane tab="Store Information" key="1">
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
                                            {/* Address */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="address" className="form-label">Address</label>
                                                <textarea
                                                    className="form-control"
                                                    id="address"
                                                    name="address"
                                                    rows="3"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                            {/* Store Logo */}
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
                                        </div>
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="Policies" key="2">
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
                                    </Tabs.TabPane>
                                </Tabs>

                                <div className="mt-2 text-end">
                                    <button
                                        type="reset"
                                        className="btn btn-outline-secondary me-2"
                                        onClick={() => {
                                            setFormData({
                                                store_name: '',
                                                store_description: '',
                                                address: '',
                                                policies: '',
                                                return_policy: '',
                                                shipping_policy: '',
                                            });
                                            setStoreLogoFile(null);
                                            navigator('/stores');
                                        }}
                                    >
                                        Turn Back
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Loading...' : 'Create Store'}
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

export default AddStore;
