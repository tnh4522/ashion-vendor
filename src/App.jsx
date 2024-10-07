import SideBar from "./layout/SideBar.jsx";
import SearchBar from "./component/SearchBar.jsx";
import Footer from "./layout/Footer.jsx";
import UserContextProvider from "./context/UserContext.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import ProtectedRoute from "./page/Authentication/ProtectedRoute.jsx";
import Dashboard from "./page/Dashboard/Dashboard.jsx";
import Account from "./page/Account/Account.jsx";
import Login from "./page/Authentication/Login.jsx";
import Register from "./page/Authentication/Register.jsx";
import Products from "./page/Product/Products.jsx";
import Users from "./page/User/Users.jsx";
import AddProduct from "./page/Product/AddProduct.jsx";


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
                            <SearchBar/>
                            <div className="content-wrapper">
                                <Routes>
                                    <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
                                    <Route path="/account" element={<ProtectedRoute><Account/></ProtectedRoute>}/>
                                    <Route path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>}/>
                                    <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>}/>
                                    <Route path="/add-product" element={<ProtectedRoute><AddProduct/></ProtectedRoute>}/>
                                </Routes>
                            </div>
                            <Footer/>
                        </div>
                        <div className="layout-overlay layout-menu-toggle"></div>
                    </div>
                </div>
            )}
        </UserContextProvider>
    )
}

export default App
