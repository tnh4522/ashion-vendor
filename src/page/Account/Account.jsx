import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";


function Account() {
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();

    const {userData, logout} = useUserContext();

    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        gender: "",
        bio: "",
        social_links: "",
        preferences: "",
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
                const response = await API.get("/me/", {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if(response.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                };

                setUser(response.data);
                setProfilePictureFile(convertUrl(response.data.profile_picture));
                setFormData({
                    username: response.data.username || "",
                    email: response.data.email || "",
                    phone_number: response.data.phone_number || "",
                    date_of_birth: response.data.date_of_birth || "",
                    gender: response.data.gender || "",
                    bio: response.data.bio || "",
                    social_links: response.data.social_links ? JSON.stringify(response.data.social_links) : "",
                    preferences: response.data.preferences ? JSON.stringify(response.data.preferences) : "",
                });
                setSocialLinks({
                    twitter: response.data.social_links?.twitter || "",
                    facebook: response.data.social_links?.facebook || "",
                    instagram: response.data.social_links?.instagram || "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
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

            const response = await API.put("/me/", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setProfilePictureFile(convertUrl(response.data.profile_picture));
            openSuccessNotification("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error updating user data:", error);
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
            formDataToSend.append("date_of_birth", formData.date_of_birth);
            formDataToSend.append("gender", formData.gender);
            formDataToSend.append("bio", formData.bio);

            if (socialLinks) {
                formDataToSend.append("social_links", JSON.stringify(socialLinks));
            }
            if (formData.preferences) {
                formDataToSend.append("preferences", JSON.stringify(formData.preferences));
            }

            if (profilePictureFile) {
                formDataToSend.append("profile_picture", profilePictureFile);
            }

            const response = await API.put("/me/", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setUser(response.data);
            openSuccessNotification("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating user data:", error);
            openErrorNotification("Failed to update profile.");
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    {/* Navigation Tabs */}
                    <ul className="nav nav-pills flex-column flex-md-row mb-3">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/account">
                                <i className="bx bx-user me-1"></i> Account
                            </Link>
                        </li>
                        {/* Other tabs */}
                    </ul>
                    {/* Profile Details */}
                    <div className="card mb-4">
                        <h5 className="card-header">Profile Details</h5>
                        <div className="card-body">
                            {/* Profile Picture */}
                            <div className="d-flex align-items-start align-items-sm-center gap-4">
                                <img
                                    src={profilePictureFile}
                                    alt="user-avatar"
                                    className="d-block rounded"
                                    height="100"
                                    width="100"
                                    id="uploadedAvatar"
                                />
                                <div className="button-wrapper">
                                    <label htmlFor="upload" className="btn btn-primary me-2 mb-4" tabIndex="0">
                                        <span className="d-none d-sm-block">Upload new photo</span>
                                        <i className="bx bx-upload d-block d-sm-none"></i>
                                        <input
                                            type="file"
                                            id="upload"
                                            className="account-file-input"
                                            hidden
                                            accept="image/png, image/jpeg"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>
                        </div>
                        <hr className="my-0"/>
                        {/* Form */}
                        <div className="card-body">
                            <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
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
                                                    value={socialLinks.twitter || ""}
                                                    onChange={handleSocialLinksChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="facebook" className="form-label">Facebook</label>
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
                                                <label htmlFor="instagram" className="form-label">Instagram</label>
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
                                <div className="mt-2">
                                    <button type="submit" className="btn btn-primary me-2">Save changes</button>
                                    <button type="reset" className="btn btn-outline-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
