import {Menu} from 'antd';
import {Link} from 'react-router-dom';
import LogoAdmin from "../component/LogoAdmin.jsx";
import useUserContext from "../hooks/useUserContext.jsx";

function SideBar() {
    const {logout} = useUserContext();
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
                    label: <Link to="/add-product">Add Product</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
                }
            ],
        },
        {
            key: 'customers',
            label: 'Customers',
            icon: <i className="menu-icon tf-icons fa-regular fa-user"></i>,
            children: [
                {
                    key: 'list-customer',
                    label: <Link to="/users">List Customer</Link>,
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
        {
            key: 'logout',
            label: <Link to="#" onClick={logout}>Log Out</Link>,
            icon: <i className="bx bx-power-off me-2"></i>,
        }
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