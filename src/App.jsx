// src/App.jsx

import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SideBar from "./layout/SideBar.jsx";
import UserContextProvider from "./context/UserContext.jsx";
import ProtectedRoute from "./page/Authentication/ProtectedRoute.jsx";
import Dashboard from "./page/Dashboard/Dashboard.jsx";
import Account from "./page/Account/Account.jsx";
import Login from "./page/Authentication/Login.jsx";
import Register from "./page/Authentication/Register.jsx";
import Products from "./page/Product/Products.jsx";
import AddProduct from "./page/Product/AddProduct.jsx";
import EditProduct from "./page/Product/EditProduct.jsx";
import ImageSearch from "./page/Product/ImageSearch.jsx";
import Categories from "./page/Category/Categories.jsx";
import Customers from "./page/Customer/Customers.jsx";
import Users from "./page/User/Users.jsx";
import AddUser from "./page/User/AddUser.jsx";
import UserDetail from "./page/User/UserDetail.jsx";
import RoleManagement from "./page/Authorization/RoleManagement.jsx";
import CreateRole from "./page/Authorization/CreateRole.jsx";
import PermissionsManagement from "./page/Authorization/PermissionsManagement.jsx";
import Stocks from "./page/Stock/Stocks.jsx";
import CreateStock from "./page/Stock/CreateStock.jsx";
import EditStock from "./page/Stock/EditStock.jsx";
import CreatePassword from "./page/Authentication/CreatePassword.jsx";
import OrderManagement from './page/Order/OrderManagement';
import CreateOrder from "./page/Order/CreateOrder.jsx";
import EditCategory from "./page/Category/EditCategory.jsx";
import AddStore from "./page/Store/AddStore.jsx";
import Stores from "./page/Store/StoreManagement.jsx";
import StoreDetail from "./page/Store/StoreDetail.jsx";
import AddBrand from "./page/Brand/AddBrand.jsx";
import Brands from "./page/Brand/BrandManagement.jsx";
import BrandDetail from "./page/Brand/BrandDetail.jsx";
import RoleDetail from "./page/Authorization/RoleDetail.jsx";
import AddCustomer from "./page/Customer/AddCustomer.jsx";
import EditCustomer from "./page/Customer/EditCustomer.jsx";
import Addresses from "./page/Address/Addresses.jsx";
import CreateAddress from "./page/Address/CreateAddress.jsx";
import OrderDetail from "./page/Order/OrderDetail.jsx";
import VerifyEmail from "./page/Authentication/VerifyEmail.jsx";
import MyStore from "./page/Store/MyStore.jsx";
import RoleDefault from "./page/Authorization/RoleDefault.jsx";
import CategoryDetail from "./page/Category/CategoryDetail.jsx";
import ActivityLog from "./page/Activity/ActivityLog.jsx";
import ActivityDetail from "./page/Activity/ActivityDetail.jsx";
import DeliveryManager from "./page/Delivery/DeliveryManager.jsx";
import PaymentManagement from "./page/Payment/PaymentManagement.jsx";
import EditPaymentMethod from "./page/Payment/EditPaymentMethod.jsx";
import StockDetail from "./page/Stock/StockDetail.jsx";
import CustomerDetail from "./page/Customer/CustomerDetail.jsx";
import Unauthorized from "./page/Unauthorized.jsx";

function App() {
    const location = useLocation();

    const isAuthRoute = location.pathname.includes('login')
        || location.pathname.includes('register')
        || location.pathname.includes('create-password')
        || location.pathname.includes('verify-email');

    return (
        <UserContextProvider>
            {isAuthRoute ? (
                <div className="container-xxl">
                    <div className="authentication-wrapper authentication-basic container-p-y">
                        <div className="authentication-inner">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/create-password/:username/:token" element={<CreatePassword />} />
                                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="layout-wrapper layout-content-navbar">
                    <div className="layout-container">
                        <SideBar />
                        <div className="layout-page">
                            <div className="content-wrapper">
                                <Routes>
                                    {/* Dashboard */}
                                    <Route
                                        path="/"
                                        element={
                                            <ProtectedRoute requiredPermissions={['dashboard:read']}>
                                                <Dashboard />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Activity */}
                                    <Route
                                        path="/activity"
                                        element={
                                            <ProtectedRoute requiredPermissions={['activity:read']}>
                                                <ActivityLog />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/activity/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['activity:read']}>
                                                <ActivityDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* My Store */}
                                    <Route
                                        path="/my-store"
                                        element={
                                            <ProtectedRoute requiredPermissions={['store:read']}>
                                                <MyStore />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Account */}
                                    <Route
                                        path="/account"
                                        element={
                                            <ProtectedRoute requiredPermissions={['account:read']}>
                                                <Account />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Products */}
                                    <Route
                                        path="/products"
                                        element={
                                            <ProtectedRoute requiredPermissions={['product:read']}>
                                                <Products />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/add-product"
                                        element={
                                            <ProtectedRoute requiredPermissions={['product:create']}>
                                                <AddProduct />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/edit-product/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['product:update']}>
                                                <EditProduct />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/products/image-search"
                                        element={
                                            <ProtectedRoute requiredPermissions={['product_image:read']}>
                                                <ImageSearch />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Categories */}
                                    <Route
                                        path="/categories"
                                        element={
                                            <ProtectedRoute requiredPermissions={['category:read']}>
                                                <Categories />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/edit-category/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['category:update']}>
                                                <EditCategory />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/categories/:id/products/:name"
                                        element={
                                            <ProtectedRoute requiredPermissions={['category:read']}>
                                                <CategoryDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Customers */}
                                    <Route
                                        path="/customers"
                                        element={
                                            <ProtectedRoute requiredPermissions={['customer:read']}>
                                                <Customers />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/add-customer"
                                        element={
                                            <ProtectedRoute requiredPermissions={['customer:create']}>
                                                <AddCustomer />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/edit-customer/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['customer:update']}>
                                                <EditCustomer />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/customer/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['customer:read']}>
                                                <CustomerDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Users */}
                                    <Route
                                        path="/users"
                                        element={
                                            <ProtectedRoute requiredPermissions={['user:read']}>
                                                <Users />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/add-user"
                                        element={
                                            <ProtectedRoute requiredPermissions={['user:create']}>
                                                <AddUser />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/user-detail/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['user:read']}>
                                                <UserDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Roles */}
                                    <Route
                                        path="/roles"
                                        element={
                                            <ProtectedRoute requiredPermissions={['role_permission:assign']}>
                                                <RoleManagement />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/role-default"
                                        element={
                                            <ProtectedRoute requiredPermissions={['role:read']}>
                                                <RoleDefault />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/create-role"
                                        element={
                                            <ProtectedRoute requiredPermissions={['role:create']}>
                                                <CreateRole />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/edit-role/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['role:update']}>
                                                <RoleDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Permissions */}
                                    <Route
                                        path="/permissions"
                                        element={
                                            <ProtectedRoute requiredPermissions={['permissions:read']}>
                                                <PermissionsManagement />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Stocks */}
                                    <Route
                                        path="/stocks"
                                        element={
                                            <ProtectedRoute requiredPermissions={['stock:read']}>
                                                <Stocks />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/add-stock"
                                        element={
                                            <ProtectedRoute requiredPermissions={['stock:create']}>
                                                <CreateStock />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/edit-stock/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['stock:update']}>
                                                <EditStock />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/stock/detail/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['stock:read']}>
                                                <StockDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Orders */}
                                    <Route
                                        path="/orders"
                                        element={
                                            <ProtectedRoute requiredPermissions={['order:read']}>
                                                <OrderManagement />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/add-order"
                                        element={
                                            <ProtectedRoute requiredPermissions={['order:create']}>
                                                <CreateOrder />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/order-detail/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['order:read']}>
                                                <OrderDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Stores */}
                                    <Route
                                        path="/stores"
                                        element={
                                            <ProtectedRoute requiredPermissions={['store:read']}>
                                                <Stores />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/add-store"
                                        element={
                                            <ProtectedRoute requiredPermissions={['store:create']}>
                                                <AddStore />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/store-detail/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['store:read']}>
                                                <StoreDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Brands */}
                                    <Route
                                        path="/brands"
                                        element={
                                            <ProtectedRoute requiredPermissions={['brand:read']}>
                                                <Brands />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/add-brand"
                                        element={
                                            <ProtectedRoute requiredPermissions={['brand:create']}>
                                                <AddBrand />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/brand-detail/:id"
                                        element={
                                            <ProtectedRoute requiredPermissions={['brand:read']}>
                                                <BrandDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Addresses */}
                                    <Route
                                        path="/address"
                                        element={
                                            <ProtectedRoute requiredPermissions={['address:read']}>
                                                <Addresses />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/create-address"
                                        element={
                                            <ProtectedRoute requiredPermissions={['address:create']}>
                                                <CreateAddress />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Delivery */}
                                    <Route
                                        path="/delivery"
                                        element={
                                            <ProtectedRoute requiredPermissions={['delivery:read']}>
                                                <DeliveryManager />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Payment */}
                                    <Route
                                        path="/payment"
                                        element={
                                            <ProtectedRoute requiredPermissions={['payment:read']}>
                                                <PaymentManagement />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/edit-payment-method"
                                        element={
                                            <ProtectedRoute requiredPermissions={['payment:update']}>
                                                <EditPaymentMethod />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Unauthorized */}
                                    <Route path="/unauthorized" element={<Unauthorized />} />
                                </Routes>
                            </div>
                        </div>
                        <div className="layout-overlay layout-menu-toggle"></div>
                    </div>
                </div>
            )}
        </UserContextProvider>
    )
}

export default App;
