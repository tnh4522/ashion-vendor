import {useState} from 'react';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import {useNavigate} from "react-router-dom";

function AddUser() {
    const {userData} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        role: '',
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        bio: '',
        twitter: '',
        facebook: '',
        instagram: '',
        preferences: '',
    });
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.role === '') {
            openErrorNotification('Role is required.');
            setLoading(false);
            return;
        }

        if (formData.username === '') {
            openErrorNotification('Username is required.');
            setLoading(false);
            return;
        }

        try {
            let data = {};

            const fields = [
                'username',
                'email',
                'phone_number',
                'role',
                'first_name',
                'last_name',
                'gender',
                'date_of_birth',
                'bio',
            ];

            fields.forEach(field => {
                if (formData[field]) {
                    data[field] = formData[field];
                }
            });


            const social_links = {};
            if (formData.twitter) social_links.twitter = formData.twitter;
            if (formData.facebook) social_links.facebook = formData.facebook;
            if (formData.instagram) social_links.instagram = formData.instagram;

            if (Object.keys(social_links).length > 0) {
                data.social_links = social_links;
            }

            if (formData.preferences) {
                let preferences = {};
                try {
                    preferences = JSON.parse(formData.preferences);
                    data.preferences = preferences;
                } catch (parseError) {
                    openErrorNotification('Preferences must be valid JSON.');
                    setLoading(false);
                    return;
                }
            }

            const response = await API.post('create-user/', data, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'application/json',
                }
            });

            openSuccessNotification('User created successfully. Password: ' + response.data.generated_password);
            setFormData({
                username: '',
                email: '',
                phone_number: '',
                role: '',
                first_name: '',
                last_name: '',
                gender: '',
                date_of_birth: '',
                bio: '',
                twitter: '',
                facebook: '',
                instagram: '',
                preferences: '',
            });
            navigator('/users');
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .map(([field, messages]) => `${field}: ${messages.join(' ')}`)
                    .join(' ');
                openErrorNotification(errorMessages);
            } else {
                openErrorNotification('Error creating user.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    {/* Profile Details */}
                    <div className="card mb-4">
                        {/* Form */}
                        <div className="card-body">
                            <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                                <h3 className="text-center" style={{color: '#696cff'}}>CREATE NEW USER</h3>
                                <hr className="my-2"></hr>
                                <div className="row">
                                    {/* Username */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Email */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="email" className="form-label">E-mail</label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Phone Number */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="phone_number">Phone Number</label>
                                        <input
                                            type="text"
                                            id="phone_number"
                                            name="phone_number"
                                            className="form-control"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Role */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select
                                            id="role"
                                            name="role"
                                            className="form-select"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="STAFF">Staff</option>
                                            <option value="SELLER">Seller</option>
                                            <option value="BUYER">Buyer</option>
                                        </select>
                                    </div>
                                </div>
                                <hr className="my-3"></hr>
                                <h5>Profile Details</h5>
                                <hr className="my-2"></hr>
                                <div className="row">
                                    {/* First Name */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="first_name" className="form-label">First Name</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Last Name */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="last_name" className="form-label">Last Name</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Gender */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="gender" className="form-label">Gender</label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            className="form-select"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    {/* Date of Birth */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            id="date_of_birth"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <hr className="my-3"></hr>
                                <h5>Social Links</h5>
                                <hr className="my-2"></hr>
                                <div className="row">
                                    {/* Bio */}
                                    <div className="mb-3 col-md-12">
                                        <label htmlFor="bio" className="form-label">Bio</label>
                                        <textarea
                                            className="form-control"
                                            id="bio"
                                            name="bio"
                                            rows="3"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                    {/* Social Links */}
                                    <div className="mb-3 col-md-12">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <label htmlFor="twitter" className="form-label">Twitter</label>
                                                <input
                                                    type="text"
                                                    id="twitter"
                                                    name="twitter"
                                                    className="form-control"
                                                    value={formData.twitter}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="facebook" className="form-label">Facebook</label>
                                                <input
                                                    type="text"
                                                    id="facebook"
                                                    name="facebook"
                                                    className="form-control"
                                                    value={formData.facebook}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="instagram" className="form-label">Instagram</label>
                                                <input
                                                    type="text"
                                                    id="instagram"
                                                    name="instagram"
                                                    className="form-control"
                                                    value={formData.instagram}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Preferences */}
                                    <div className="mb-3 col-md-12">
                                        <label htmlFor="preferences" className="form-label">Preferences (JSON
                                            format)</label>
                                        <textarea
                                            className="form-control"
                                            id="preferences"
                                            name="preferences"
                                            rows="3"
                                            value={formData.preferences}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="mt-2 text-end">
                                    <button
                                        type="reset"
                                        className="btn btn-outline-secondary me-2"
                                        onClick={() =>
                                            setFormData({
                                                username: '',
                                                email: '',
                                                phone_number: '',
                                                role: '',
                                                first_name: '',
                                                last_name: '',
                                                gender: '',
                                                date_of_birth: '',
                                                bio: '',
                                                twitter: '',
                                                facebook: '',
                                                instagram: '',
                                                preferences: '',
                                            })
                                        }
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Loading...' : 'Create User'}
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

export default AddUser;
