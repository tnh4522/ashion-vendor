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
            icon: <i className="menu-icon fa-solid fa-house"></i>
        },
        {
            key: 'store',
            label: <Link to="/my-store">My Store</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-store"></i>,
            // children: [
            //     {
            //         key: 'stores',
            //         label: <Link to="/stores">List Store</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
            //     },
            //     {
            //         key: 'add-store',
            //         label: <Link to="/add-store">Add Store</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
            //     }
            // ]
        },
        {
            key: 'acitvity',
            label: <Link to="/activity">Activity Log</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-font-awesome"></i>,
        },
        {
            key: 'category',
            label: <Link to="/categories">Categories</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-layer-group"></i>,
        },
        {
            key: 'sub2',
            label: <Link to="/products">Products</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-bag-shopping"></i>,
        },
        {
            key: 'stock',
            label: <Link to="/stocks">Stock</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-boxes-stacked"></i>,
            // children: [
            //     {
            //         key: 'stocks',
            //         label: <Link to="/stocks">List Stock</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
            //     },
            //     {
            //         key: 'add-stock',
            //         label: <Link to="/add-stock">Add Stock</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
            //     }
            // ],
        },
        // {
        //     key: 'brand',
        //     label: 'Brand Management',
        //     icon: <i className="menu-icon tf-icons fa-solid fa-tags"></i>,
        //     children: [
        //         {
        //             key: 'listBrand',
        //             label: <Link to="/brands">List Brand</Link>,
        //             icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
        //         },
        //         {
        //             key: 'addBrand',
        //             label: <Link to="/add-brand">Add Brand</Link>,
        //             icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
        //         }
        //     ],
        // },
        {
            key: 'customers',
            label: <Link to="/customers">Customer</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-address-book"></i>,
            // children: [
            //     {
            //         key: 'list-customer',
            //         label: <Link to="/customers">List Customer</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
            //     },
            //     {
            //         key: 'add-customer',
            //         label: <Link to="/add-customer">Add Customer</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
            //     }
            // ],
        },
        {
            key: 'orders',
            label: <Link to="/orders">Order</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-cart-shopping"></i>,
            // children: [
            //     {
            //         key: 'orders',
            //         label: <Link to="/orders">List Orders</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>
            //     },
            //     {
            //         key: 'add-order',
            //         label: <Link to="/add-order">Add Order</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
            //     }
            // ],
        },
        {
            key: 'delivery',
            label: <Link to="/delivey">Delivery</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-truck"></i>,
        },
        {
            key: 'payment',
            label: <Link to="/payment">Payment</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-credit-card"></i>,
        },
        {
            key: 'users',
            label: <Link to="/users">User</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-users"></i>,
            // children: [
            //     {
            //         key: 'list-user',
            //         label: <Link to="/users">List User</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-list"></i>,
            //     },
            //     {
            //         key: 'add-user',
            //         label: <Link to="/add-user">Add User</Link>,
            //         icon: <i className="menu-icon tf-icons fa-solid fa-plus"></i>
            //     }
            // ],
        },
        {
            key: 'sub4',
            label: 'Authorization',
            icon: <i className="menu-icon fa-solid fa-lock"></i>,
            children: [
                {
                    key: 'roleManagement',
                    label: <Link to="/roles">Role Management</Link>,
                    icon: <i className="menu-icon fa-solid fa-user-tie"></i>
                },
                {
                    key: 'roleDefault',
                    label: <Link to="/role-default">Role Default</Link>,
                    icon: <i className="menu-icon fa-solid fa-shield-halved"></i>
                },
                {
                    key: 'permissionManagement',
                    label: <Link to="/permissions">Permission Management</Link>,
                    icon: <i className="menu-icon fa-solid fa-briefcase"></i>
                }
            ]
        },
        {
            key: 'sub3',
            label: <Link to="/account">Account Settings</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-address-card"></i>,
        },
        {
            key: 'support',
            label: <Link to="https://github.com/themeselection/sneat-html-admin-template-free/issues"
                         target="_blank">Support</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-headset"></i>,
        },
        {
            key: 'documentation',
            label: <Link to="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
                         target="_blank">Documentation</Link>,
            icon: <i className="menu-icon tf-icons fa-solid fa-file-invoice"></i>,
        },
        {
            key: 'logout',
            label: <Link to="#" onClick={logout}>Log Out</Link>,
            icon: <i className="menu-icon fa-solid fa-power-off"></i>,
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