import {Menu} from 'antd';
import {Link} from 'react-router-dom';
import LogoAdmin from "../component/LogoAdmin.jsx";

function SideBar() {
    const items = [
        {
            key: 'sub1',
            label: <Link to="/">Dashboard</Link>,
            icon: <i className="menu-icon tf-icons bx bx-home-circle"></i>
        },
        {
            key: 'sub2',
            label: 'Products',
            icon: <i className="menu-icon tf-icons bx bx-layout"></i>,
            children: [
                {
                    key: 'layout1',
                    label: <Link to="/products">List Product</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
                }
            ],
        },
        {
            key: 'sub3',
            label: 'Account Settings',
            icon: <i className="menu-icon tf-icons bx bx-dock-top"></i>,
            children: [
                {
                    key: 'account',
                    label: <Link to="/account">Account</Link>,
                },
                {
                    key: 'notifications',
                    label: <Link to="/pages-account-settings-notifications">Notifications</Link>,
                },
                {
                    key: 'connections',
                    label: <Link to="/pages-account-settings-connections">Connections</Link>,
                },
            ],
        },
        {
            key: 'sub4',
            label: 'Authentications',
            icon: <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>,
            children: [
                {
                    key: 'login',
                    label: <Link to="/login" target="_blank">Login</Link>,
                },
                {
                    key: 'register',
                    label: <Link to="/register" target="_blank">Register</Link>,
                },
                {
                    key: 'forgot-password',
                    label: <Link to="/auth-forgot-password-basic" target="_blank">Forgot Password</Link>,
                },
            ],
        },
        {
            key: 'sub5',
            label: 'Misc',
            icon: <i className="menu-icon tf-icons bx bx-cube-alt"></i>,
            children: [
                {
                    key: 'error',
                    label: <Link to="/pages-misc-error">Error</Link>,
                },
                {
                    key: 'under-maintenance',
                    label: <Link to="/pages-misc-under-maintenance">Under Maintenance</Link>,
                },
            ],
        },
        {
            key: 'users',
            label: 'Users',
            icon: <i className="menu-icon tf-icons fa-regular fa-user"></i>,
            children: [
                {
                    key: 'listUser',
                    label: <Link to="/users">List User</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
                }
            ],
        },
        {
            key: 'extended-ui',
            label: 'Extended UI',
            icon: <i className="menu-icon tf-icons bx bx-copy"></i>,
            children: [
                {
                    key: 'perfect-scrollbar',
                    label: <Link to="/extended-ui-perfect-scrollbar">Perfect Scrollbar</Link>,
                },
                {
                    key: 'text-divider',
                    label: <Link to="/extended-ui-text-divider">Text Divider</Link>,
                },
            ],
        },
        {
            key: 'icons',
            label: 'Icons',
            icon: <i className="menu-icon tf-icons bx bx-crown"></i>,
            children: [
                {
                    key: 'boxicons',
                    label: <Link to="/icons-boxicons">Boxicons</Link>,
                },
            ],
        },
        {
            key: 'forms-tables',
            label: 'Forms & Tables',
            icon: <i className="menu-icon tf-icons bx bx-detail"></i>,
            children: [
                {
                    key: 'form-elements',
                    label: 'Form Elements',
                    children: [
                        {
                            key: 'basic-inputs',
                            label: <Link to="/forms-basic-inputs">Basic Inputs</Link>,
                        },
                        {
                            key: 'input-groups',
                            label: <Link to="/forms-input-groups">Input Groups</Link>,
                        },
                    ],
                },
                {
                    key: 'form-layouts',
                    label: 'Form Layouts',
                    children: [
                        {
                            key: 'vertical-form',
                            label: <Link to="/form-layouts-vertical">Vertical Form</Link>,
                        },
                        {
                            key: 'horizontal-form',
                            label: <Link to="/form-layouts-horizontal">Horizontal Form</Link>,
                        },
                    ],
                },
            ],
        },
        {
            key: 'tables',
            label: <Link to="/tables-basic">Tables</Link>,
            icon: <i className="menu-icon tf-icons bx bx-table"></i>,
        },
        {
            key: 'support',
            label: <Link to="https://github.com/themeselection/sneat-html-admin-template-free/issues"
                         target="_blank">Support</Link>,
            icon: <i className="menu-icon tf-icons bx bx-support"></i>,
        },
        {
            key: 'documentation',
            label: <Link to="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
                         target="_blank">Documentation</Link>,
            icon: <i className="menu-icon tf-icons bx bx-file"></i>,
        },
    ];
    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <LogoAdmin/>

            <div className="menu-inner-shadow"></div>

            <Menu
                style={{
                    width: "100%",
                    marginTop: 16,
                }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />
        </aside>
    )
}

export default SideBar;