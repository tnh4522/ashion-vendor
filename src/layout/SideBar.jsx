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
                    label: <Link to="/products">Search Product</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
                },
                {
                    key: 'layout2',
                    label: <Link to="/products-add">Add Product</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
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
                    label: <Link to="" onClick={() => window.location.href = 'login'}>Login</Link>,
                },
                {
                    key: 'register',
                    label: <Link to="" onClick={() => window.location.href = 'register'}>Register</Link>,
                },
                {
                    key: 'forgot-password',
                    label: <Link to="/auth-forgot-password-basic" target="_blank">Forgot Password</Link>,
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
            key: 'customers',
            label: 'Customers',
            icon: <i className="menu-icon tf-icons far fa-user-circle"></i>,
            children: [
                {
                    key: 'listCustomers',
                    label: <Link to="/customers">List Customers</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
                }
            ],
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