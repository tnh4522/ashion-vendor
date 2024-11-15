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
            key: 'category',
            label: 'Category',
            icon: <i className="menu-icon tf-icons fa-solid fa-layer-group"></i>,
            children: [
                {
                    key: 'listCategory',
                    label: <Link to="/categories">List Category</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
                },
                {
                    key: 'addCategory',
                    label: <Link to="/add-category">Add Category</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
                }
            ]
        },
        {
            key: 'sub2',
            label: 'Products',
            icon: <i className="menu-icon tf-icons fa-solid fa-bag-shopping"></i>,
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
            key: 'stocks',
            label: 'Stock Management',
            icon: <i className="menu-icon tf-icons fa-solid fa-boxes-stacked"></i>,
            children: [
                {
                    key: 'stocks',
                    label: <Link to="/stocks">List Stock</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
                },
                {
                    key: 'add-stock',
                    label: <Link to="/add-stock">Add Stock</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
                }
            ],
        },
        {
            key: 'users',
            label: 'Users',
            icon: <i className="menu-icon tf-icons fa-solid fa-users"></i>,
            children: [
                {
                    key: 'list-user',
                    label: <Link to="/users">List User</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>,
                },
                {
                    key: 'add-user',
                    label: <Link to="/add-user">Add User</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
                }
            ],
        },
        {
            key: 'customers',
            label: 'Customers',
            icon: <i className="menu-icon tf-icons fa-solid fa-address-book"></i>,
            children: [
                {
                    key: 'list-customer',
                    label: <Link to="/customers">List Customer</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
                },
                {
                    key: 'add-customer',
                    label: <Link to="/add-customer">Add Customer</Link>,
                    icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
                }
            ],
        },
        {
            key: 'sub3',
            label: <Link to="/account">Account Settings</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-address-card"></i>,
        },
        {
            key: 'sub4',
            label: 'Authorization',
            icon: <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>,
            children: [
                {
                    key: 'roleManagement',
                    label: <Link to="/role">Role Management</Link>,
                    icon: <i className="menu-icon fa-solid fa-user-tie"></i>
                },
                {
                    key: 'permissionManagement',
                    label: <Link to="/permissions">Permission Management</Link>,
                    icon: <i className="menu-icon fa-solid fa-briefcase"></i>
                }
            ]
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
            icon: <i className="menu-icon bx bx-power-off me-2"></i>,
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