import {useEffect, useState} from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {Tabs} from 'antd';
import Permission from "../User/Permission.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import Addresses from '../Address/Addresses';

function UserDetail() {
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();

    const {userData, logout} = useUserContext();
    const navigator = useNavigate();

    const [user, setUser] = useState(null);
    const user_id = useParams().id;

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        bio: "",
        social_links: "",
        preferences: "",
        password: "",
    });

    const [socialLinks, setSocialLinks] = useState({
        twitter: "",
        facebook: "",
        instagram: "",
    });

    const handleSocialLinksChange = (e) => {
        const {name, value} = e.target;
        setSocialLinks({...socialLinks, [name]: value});
    };

    const [profilePictureFile, setProfilePictureFile] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get("/user/" + user_id + "/", {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.code == 'token_not_valid') {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }

                setUser(response.data);
                if (response.data.profile_picture) {
                    setProfilePictureFile(convertUrl(response.data.profile_picture));
                }
                setFormData({
                    username: response.data.username || "",
                    email: response.data.email || "",
                    phone_number: response.data.phone_number || "",
                    first_name: response.data.first_name || "",
                    last_name: response.data.last_name || "",
                    date_of_birth: response.data.date_of_birth || "",
                    gender: response.data.gender || "",
                    bio: response.data.bio || "",
                    social_links: response.data.social_links ? JSON.stringify(response.data.social_links) : "",
                    preferences: response.data.preferences ? JSON.stringify(response.data.preferences) : "",
                    password: response.data.password || "",
                });
                setSocialLinks({
                    twitter: response.data.social_links?.twitter || "",
                    facebook: response.data.social_links?.facebook || "",
                    instagram: response.data.social_links?.instagram || "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (error.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
            }
        };

        if (userData.access) {
            fetchUserData();
        }
    }, [userData.access]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleFileChange = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("profile_picture", e.target.files[0]);

            const response = await API.put("/user/" + user_id + "/", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setProfilePictureFile(convertUrl(response.data.profile_picture));
            openSuccessNotification("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error updating user data:", error);
            if (error.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            openErrorNotification("Failed to update profile picture.");
        }
    };

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone_number", formData.phone_number);
            formDataToSend.append("first_name", formData.first_name);
            formDataToSend.append("last_name", formData.last_name);
            formDataToSend.append("date_of_birth", formData.date_of_birth);
            formDataToSend.append("gender", formData.gender);
            formDataToSend.append("bio", formData.bio);

            if (socialLinks) {
                formDataToSend.append("social_links", JSON.stringify(socialLinks));
            }
            if (formData.preferences) {
                formDataToSend.append("preferences", JSON.stringify(formData.preferences));
            }

            if (profilePictureFile instanceof File) {
                formDataToSend.append("profile_picture", profilePictureFile);
            }

            const response = await API.put("/user/" + user_id + "/", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setUser(response.data);
            openSuccessNotification("Profile updated successfully!");
            navigator("/users");
        } catch (error) {
            console.error("Error updating user data:", error);
            openErrorNotification("Failed to update profile.");
        }
    };

    const handleAddPermission = async (permission) => {
        try {
            if (user.permissions.includes(permission)) {
                openErrorNotification("This permission is already installed. Please try again.");
                return;
            }

            const response = await API.post(`/user/${user_id}/add_permission/`, {permission}, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                },
            });

            setUser((prevUser) => ({
                ...prevUser,
                permissions: [...prevUser.permissions, permission],
            }));
            openSuccessNotification("Permission added successfully!");
        } catch (error) {
            console.error("Error adding permission:", error);
            openErrorNotification("Failed to add permission.");
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <Link to={"/users"} className="btn btn-primary mb-4">
                        <i className="bx bx-arrow-back me-2"></i>
                        Back to Users
                    </Link>
                    {/* Profile Details */}
                    <div className="card mb-4">
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            style={{margin: '1.5rem 1rem'}}
                        >
                            <Tabs.TabPane tab="Profile Details" key="1">
                                <div className="card-body">
                                    <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* First Name */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="first_name" className="form-label">First
                                                    Name</label>
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
                                                <label htmlFor="last_name" className="form-label">Last
                                                    Name</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="last_name"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {/* Date of Birth */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="date_of_birth" className="form-label">Date of
                                                    Birth</label>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    id="date_of_birth"
                                                    name="date_of_birth"
                                                    value={formData.date_of_birth}
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
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset"
                                                    className="btn btn-outline-secondary me-2">Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">Save changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Account Information" key="2">
                                <div className="card-body">
                                    <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Username */}
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="username"
                                                       className="form-label">Username</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    readOnly
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
                                                    readOnly
                                                />
                                            </div>
                                            {/* Phone Number */}
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor="phone_number">Phone
                                                    Number</label>
                                                <input
                                                    type="text"
                                                    id="phone_number"
                                                    name="phone_number"
                                                    className="form-control"
                                                    value={formData.phone_number}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset"
                                                    className="btn btn-outline-secondary me-2">Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">Save changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Address" key="3">
                                <Addresses userId={user_id} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Social Links" key="4">
                                <div className="card-body">
                                    <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Social Links */}
                                            <div className="mb-3 col-md-12">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <label htmlFor="twitter"
                                                               className="form-label">Twitter</label>
                                                        <input
                                                            type="text"
                                                            id="twitter"
                                                            name="twitter"
                                                            className="form-control"
                                                            value={socialLinks.twitter || ""}
                                                            onChange={handleSocialLinksChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="facebook"
                                                               className="form-label">Facebook</label>
                                                        <input
                                                            type="text"
                                                            id="facebook"
                                                            name="facebook"
                                                            className="form-control"
                                                            value={socialLinks.facebook || ""}
                                                            onChange={handleSocialLinksChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="instagram"
                                                               className="form-label">Instagram</label>
                                                        <input
                                                            type="text"
                                                            id="instagram"
                                                            name="instagram"
                                                            className="form-control"
                                                            value={socialLinks.instagram || ""}
                                                            onChange={handleSocialLinksChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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
                                        </div>
                                        <div className="mt-2 text-end">
                                            <button type="reset"
                                                    className="btn btn-outline-secondary me-2">Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">Save changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Preferences" key="5">
                                <div className="card-body">
                                    <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* Preferences */}
                                            <div className="mb-3 col-md-12">
                                                <label htmlFor="preferences" className="form-label">Preferences
                                                    (JSON
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
                                            <button type="reset" className="btn btn-outline-secondary me-2">Cancel</button>
                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Permissions" key="6">
                                <Permission user={user} onAddPermission={handleAddPermission}/>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetail;