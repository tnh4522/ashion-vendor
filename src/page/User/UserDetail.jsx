import { useEffect, useState } from "react";
import useUserContext from "../../hooks/useUserContext.jsx";
import API from "../../service/service.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import { Tabs, Table, Button, Modal, Form, TimePicker, Select } from 'antd';
import Permission from "../User/Permission.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import Addresses from '../Address/Addresses';
import moment from 'moment';

const { Option } = Select;

function UserDetail() {
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();

    const { userData, logout } = useUserContext();
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

    const [profilePictureFile, setProfilePictureFile] = useState(null);

    // State cho Lịch làm việc
    const [schedule, setSchedule] = useState([
        // Dữ liệu mẫu
        {
            id: 1,
            day: 'MONDAY',
            start_time: '09:00',
            end_time: '17:00',
        },
        {
            id: 2,
            day: 'TUESDAY',
            start_time: '09:00',
            end_time: '17:00',
        },
    ]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get("/user/" + user_id + "/", {
                    headers: {
                        Authorization: `Bearer ${userData.access}`,
                    },
                });

                if (response.status === 401 || response.code === 'token_not_valid') {
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

                // Nếu có API, bạn có thể gọi fetchScheduleData ở đây
                // Tuy nhiên, vì chưa có API, sử dụng dữ liệu mẫu
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

    const handleSocialLinksChange = (e) => {
        const { name, value } = e.target;
        setSocialLinks({ ...socialLinks, [name]: value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

            const response = await API.post(`/user/${user_id}/add_permission/`, { permission }, {
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

    // Hàm để mở modal thêm/sửa lịch làm việc
    const showModal = (record = null) => {
        setEditingSchedule(record);
        if (record) {
            form.setFieldsValue({
                day: record.day,
                start_time: moment(record.start_time, 'HH:mm'),
                end_time: moment(record.end_time, 'HH:mm'),
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    // Hàm để xử lý khi submit form thêm/sửa lịch làm việc
    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const newSchedule = {
                    id: editingSchedule ? editingSchedule.id : schedule.length ? schedule[schedule.length - 1].id + 1 : 1,
                    day: values.day,
                    start_time: values.start_time.format('HH:mm'),
                    end_time: values.end_time.format('HH:mm'),
                };

                if (editingSchedule) {
                    // Cập nhật lịch làm việc
                    setSchedule(prev =>
                        prev.map(item => item.id === editingSchedule.id ? newSchedule : item)
                    );
                    openSuccessNotification("Cập nhật lịch làm việc thành công!");
                } else {
                    // Thêm mới lịch làm việc
                    setSchedule(prev => [...prev, newSchedule]);
                    openSuccessNotification("Thêm lịch làm việc thành công!");
                }
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    // Hàm để xử lý khi hủy modal
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // Hàm để xóa lịch làm việc
    const handleDeleteSchedule = (id) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa lịch làm việc này?',
            onOk: () => {
                setSchedule(prev => prev.filter(item => item.id !== id));
                openSuccessNotification("Xóa lịch làm việc thành công!");
            },
        });
    };

    // Cột cho bảng lịch làm việc
    const columns = [
        {
            title: 'Day',
            dataIndex: 'day',
            key: 'day',
            render: (text) => {
                const days = {
                    MONDAY: 'Thứ Hai',
                    TUESDAY: 'Thứ Ba',
                    WEDNESDAY: 'Thứ Tư',
                    THURSDAY: 'Thứ Năm',
                    FRIDAY: 'Thứ Sáu',
                    SATURDAY: 'Thứ Bảy',
                    SUNDAY: 'Chủ Nhật',
                };
                return days[text] || text;
            },
        },
        {
            title: 'Time Start',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: 'Time End',
            dataIndex: 'end_time',
            key: 'end_time',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => showModal(record)}>Sửa</Button>
                    <Button type="link" danger onClick={() => handleDeleteSchedule(record.id)}>Xóa</Button>
                </>
            ),
        },
    ];

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
                            size="small"
                            style={{ margin: '1.5rem 1rem' }}
                        >
                            <Tabs.TabPane tab="Profile Details" key="1">
                                {/* Nội dung tab Profile Details */}
                                <div className="card-body">
                                    <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
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
                                {/* Nội dung tab Account Information */}
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
                                {/* Nội dung tab Social Links */}
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
                            <Tabs.TabPane tab="Permissions" key="5">
                                <Permission user={user} onAddPermission={handleAddPermission} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Work Schedule" key="6">
                                <div className="card-body">
                                    <Button type="primary" onClick={() => showModal()} className="mb-3">
                                        Add Schedule
                                    </Button>
                                    <Table
                                        dataSource={schedule}
                                        columns={columns}
                                        rowKey="id"
                                        pagination={false}
                                    />
                                    {/* Modal để thêm/sửa lịch làm việc */}
                                    <Modal
                                        title={editingSchedule ? "Sửa Lịch Làm Việc" : "Thêm Lịch Làm Việc"}
                                        visible={isModalVisible}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                        okText="Lưu"
                                        cancelText="Hủy"
                                    >
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            name="scheduleForm"
                                        >
                                            <Form.Item
                                                name="day"
                                                label="Ngày"
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                                            >
                                                <Select placeholder="Chọn ngày">
                                                    <Option value="MONDAY">Thứ Hai</Option>
                                                    <Option value="TUESDAY">Thứ Ba</Option>
                                                    <Option value="WEDNESDAY">Thứ Tư</Option>
                                                    <Option value="THURSDAY">Thứ Năm</Option>
                                                    <Option value="FRIDAY">Thứ Sáu</Option>
                                                    <Option value="SATURDAY">Thứ Bảy</Option>
                                                    <Option value="SUNDAY">Chủ Nhật</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name="start_time"
                                                label="Giờ Bắt Đầu"
                                                rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu!' }]}
                                            >
                                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name="end_time"
                                                label="Giờ Kết Thúc"
                                                rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc!' }]}
                                            >
                                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Form>
                                    </Modal>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetail;
