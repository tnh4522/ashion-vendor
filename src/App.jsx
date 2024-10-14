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
import Categories from "./page/Category/Categories.jsx";
import AddCategory from "./page/Category/AddCategory.jsx";
import Customers from "./page/Customer/Customers.jsx";
import Users from "./page/User/Users.jsx";
import AddUser from "./page/User/AddUser.jsx";
import UserDetail from "./page/User/UserDetail.jsx";


function App() {
    const location = useLocation();

    const isAuthRoute = location.pathname.includes('login') || location.pathname.includes('register');

    return (
        <UserContextProvider>
            {isAuthRoute ? (
                <div className="container-xxl">
                    <div className="authentication-wrapper authentication-basic container-p-y">
                        <div className="authentication-inner">
                            <Routes>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/register" element={<Register/>}/>
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
                                    <Route path="/account" element={<ProtectedRoute><Account/></ProtectedRoute>}/>
                                    <Route path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>}/>
                                    <Route path="/customers" element={<ProtectedRoute><Customers/></ProtectedRoute>}/>
                                    <Route path="/add-product" element={<ProtectedRoute><AddProduct/></ProtectedRoute>}/>
                                    <Route path="/categories" element={<ProtectedRoute><Categories/></ProtectedRoute>}/>
                                    <Route path="/add-category" element={<ProtectedRoute><AddCategory/></ProtectedRoute>}/>
                                    <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>}/>
                                    <Route path="/add-user" element={<ProtectedRoute><AddUser/></ProtectedRoute>}/>
                                    <Route path="/user-detail/:id" element={<ProtectedRoute><UserDetail/></ProtectedRoute>}/>
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
