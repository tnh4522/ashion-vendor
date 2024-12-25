import {useContext} from 'react';
import {Menu} from 'antd';
import {Link} from 'react-router-dom';
import LogoAdmin from "../component/LogoAdmin.jsx";
import {UserContext} from "../context/UserContext.jsx";
import {hasPermission} from '../constant/permissions.js';
import {SettingOutlined, AuditOutlined} from '@ant-design/icons';

const SideBar = () => {
    const {userData, logout} = useContext(UserContext);
    if(!userData) return null;
    const scope = userData.scope;

    const menuItems = [
        {
            key: 'dashboard',
            icon: <i className="menu-icon fa-solid fa-house"></i>,
            label: <Link to="/">Dashboard</Link>,
            permission: 'dashboard:read'
        },
        {
            key: 'my-store',
            icon: <i className="menu-icon tf-icons fa-solid fa-store"></i>,
            label: <Link to="/my-store">My Store</Link>,
            permission: 'store:read'
        },
        {
            key: 'activity',
            icon: <i className="menu-icon tf-icons fa-solid fa-font-awesome"></i>,
            label: <Link to="/activity">Activity Log</Link>,
            permission: 'activity:read'
        },
        {
            key: 'categories',
            icon: <i className="menu-icon tf-icons fa-solid fa-layer-group"></i>,
            label: <Link to="/categories">Categories</Link>,
            permission: 'category:read'
        },
        {
            key: 'products',
            icon: <i className="menu-icon tf-icons fa-solid fa-bag-shopping"></i>,
            label: <Link to="/products">Products</Link>,
            permission: 'product:read'
        },
        {
            key: 'stocks',
            icon: <i className="menu-icon tf-icons fa-solid fa-boxes-stacked"></i>,
            label: <Link to="/stocks">Stock</Link>,
            permission: 'stock:read'
        },
        {
            key: 'customers',
            icon: <i className="menu-icon tf-icons fa-solid fa-address-book"></i>,
            label: <Link to="/customers">Customer</Link>,
            permission: 'customer:read'
        },
        {
            key: 'orders',
            icon: <i className="menu-icon tf-icons fa-solid fa-cart-shopping"></i>,
            label: <Link to="/orders">Order</Link>,
            permission: 'order:read'
        },
        {
            key: 'delivery',
            icon: <i className="menu-icon tf-icons fa-solid fa-truck"></i>,
            label: <Link to="/delivery">Delivery</Link>,
            permission: 'delivery:read'
        },
        {
            key: 'payment',
            icon: <i className="menu-icon tf-icons fa-solid fa-credit-card"></i>,
            label: <Link to="/payment">Payment</Link>,
            permission: 'payment:read'
        },
        {
            key: 'users',
            icon: <i className="menu-icon tf-icons fa-solid fa-users"></i>,
            label: <Link to="/users">User</Link>,
            permission: 'user:read'
        },
        {
            key: 'authorization',
            icon: <i className="menu-icon fa-solid fa-lock"></i>,
            label: 'Authorization',
            permission: 'authorization:read',
            children: [
                {
                    key: 'roleManagement',
                    icon: <AuditOutlined/>,
                    label: <Link to="/roles">Role Management</Link>,
                    permission: 'role_permission:assign'
                },
                {
                    key: 'roleDefault',
                    icon: <SettingOutlined/>,
                    label: <Link to="/role-default">Role Default</Link>,
                    permission: 'role:read'
                },
                {
                    key: 'permissionManagement',
                    icon: <AuditOutlined/>,
                    label: <Link to="/permissions">Permission Management</Link>,
                    permission: 'permissions:read'
                }
            ]
        },
        {
            key: 'account',
            icon: <i className="menu-icon tf-icons fa-solid fa-address-card"></i>,
            label: <Link to="/account">Account Settings</Link>,
            permission: null
        },
        {
            key: 'support',
            icon: <i className="menu-icon tf-icons fa-solid fa-headset"></i>,
            label: <a href="https://github.com/themeselection/sneat-html-admin-template-free/issues" target="_blank"
                      rel="noopener noreferrer">Support</a>,
            permission: null
        },
        {
            key: 'documentation',
            icon: <i className="menu-icon tf-icons fa-solid fa-file-invoice"></i>,
            label: <a href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
                      target="_blank" rel="noopener noreferrer">Documentation</a>,
            permission: null
        },
        {
            key: 'logout',
            icon: <i className="menu-icon fa-solid fa-power-off"></i>,
            label: <span onClick={logout} style={{cursor: 'pointer'}}>Log Out</span>,
            permission: null
        }
    ];

    const filterMenuItems = (items) => {
        if (userData.role === 'ADMIN') {
            return items;
        } else {
            return items.reduce((acc, item) => {
                if (!item.permission) {
                    acc.push(item);
                    return acc;
                }

                if (hasPermission(scope, item.permission) || item.children) {
                    if (item.children && item.children.length > 0) {
                        const filteredChildren = filterMenuItems(item.children);
                        if (filteredChildren.length > 0) {
                            acc.push({...item, children: filteredChildren});
                        }
                    } else {
                        acc.push(item);
                    }
                }

                return acc;
            }, []);
        }
    };

    const filteredMenuItems = filterMenuItems(menuItems);

    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <LogoAdmin/>

            <div className="menu-inner-shadow"></div>

            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                defaultOpenKeys={['authorization']}
                items={filteredMenuItems}
            />
        </aside>
    );
}

export default SideBar;
