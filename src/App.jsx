import SideBar from "./layout/SideBar.jsx";
import UserContextProvider from "./context/UserContext.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import ProtectedRoute from "./page/Authentication/ProtectedRoute.jsx";
import Dashboard from "./page/Dashboard/Dashboard.jsx";
import Account from "./page/Account/Account.jsx";
import Login from "./page/Authentication/Login.jsx";
import Register from "./page/Authentication/Register.jsx";
import Products from "./page/Product/Products.jsx";
import AddProduct from "./page/Product/AddProduct.jsx";
import EditProduct from "./page/Product/EditProduct.jsx";
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
import CustomerDetail from "./page/Customer/CustomerDetail.jsx";
import Addresses from "./page/Address/Addresses.jsx";
import CreateAddress from "./page/Address/CreateAddress.jsx";
import OrderDetail from "./page/Order/OrderDetail.jsx";
import VerifyEmail from "./page/Authentication/VerifyEmail.jsx";
import MyStore from "./page/Store/MyStore.jsx";
import RoleDefault from "./page/Authorization/RoleDefault.jsx";
import CategoryDetail from "./page/Category/CategoryDetail.jsx";
import ActivityLog from "./page/Activity/ActivityLog.jsx";
import ActivityDetail from "./page/Activity/ActivityDetail.jsx";


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
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/register" element={<Register/>}/>
                                <Route path="/create-password/:username/:token" element={<CreatePassword/>}/>
                                <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="layout-wrapper layout-content-navbar">
                    <div className="layout-container">
                        <SideBar/>
                        <div className="layout-page">
                            <div className="content-wrapper">
                                <Routes>
                                    <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
                                    <Route path="/activity" element={<ProtectedRoute><ActivityLog/></ProtectedRoute>}/>
                                    <Route path="/activity/:id" element={<ProtectedRoute><ActivityDetail/></ProtectedRoute>}/>
                                    <Route path="/my-store" element={<ProtectedRoute><MyStore/></ProtectedRoute>}/>
                                    <Route path="/account" element={<ProtectedRoute><Account/></ProtectedRoute>}/>
                                    <Route path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>}/>
                                    <Route path="/customers" element={<ProtectedRoute><Customers/></ProtectedRoute>}/>
                                    <Route path="/add-customer" element={<ProtectedRoute><AddCustomer/></ProtectedRoute>}/>
                                    <Route path="/customer/:id" element={<ProtectedRoute><CustomerDetail/></ProtectedRoute>}/>
                                    <Route path="/add-product" element={<ProtectedRoute><AddProduct/></ProtectedRoute>}/>
                                    <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct/></ProtectedRoute>}/>
                                    <Route path="/categories" element={<ProtectedRoute><Categories/></ProtectedRoute>}/>
                                    <Route path="/edit-category/:id" element={<ProtectedRoute><EditCategory/></ProtectedRoute>}/>
                                    <Route path="/categories/:id/products/:name" element={<ProtectedRoute><CategoryDetail/></ProtectedRoute>}/>
                                    <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>}/>
                                    <Route path="/add-user" element={<ProtectedRoute><AddUser/></ProtectedRoute>}/>
                                    <Route path="/user-detail/:id" element={<ProtectedRoute><UserDetail/></ProtectedRoute>}/>
                                    <Route path="/roles" element={<ProtectedRoute><RoleManagement/></ProtectedRoute>}/>
                                    <Route path="/role-default" element={<ProtectedRoute><RoleDefault/></ProtectedRoute>}/>
                                    <Route path="/create-role" element={<ProtectedRoute><CreateRole/></ProtectedRoute>}/>
                                    <Route path="/edit-role/:id" element={<ProtectedRoute><RoleDetail/></ProtectedRoute>}/>
                                    <Route path='/permissions' element={<ProtectedRoute><PermissionsManagement/></ProtectedRoute>}/>
                                    <Route path="/stocks" element={<ProtectedRoute><Stocks/></ProtectedRoute>}/>
                                    <Route path="/add-stock" element={<ProtectedRoute><CreateStock/></ProtectedRoute>}/>
                                    <Route path="/edit-stock/:id" element={<ProtectedRoute><EditStock/></ProtectedRoute>}/>
                                    <Route path="/orders" element={<ProtectedRoute><OrderManagement/></ProtectedRoute>}/>
                                    <Route path="/add-order" element={<ProtectedRoute><CreateOrder/></ProtectedRoute>}/>
                                    <Route path='/order-detail/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute>}/>
                                    <Route path='/stores' element={<ProtectedRoute><Stores/></ProtectedRoute>}/>
                                    <Route path='/add-store' element={<ProtectedRoute><AddStore/></ProtectedRoute>}/>
                                    <Route path='/store-detail/:id' element={<ProtectedRoute><StoreDetail/></ProtectedRoute>}/>
                                    <Route path='/brands' element={<ProtectedRoute><Brands/></ProtectedRoute>}/>
                                    <Route path='/add-brand' element={<ProtectedRoute><AddBrand/></ProtectedRoute>}/>
                                    <Route path='/brand-detail/:id' element={<ProtectedRoute><BrandDetail/></ProtectedRoute>}/>
                                    <Route path="/address" element={<ProtectedRoute><Addresses /></ProtectedRoute>}/>
                                    <Route path="/create-address" element={<ProtectedRoute><CreateAddress/></ProtectedRoute>} />
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

export default App
