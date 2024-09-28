import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {HashRouter, Route, Routes} from "react-router-dom";
import App from './App.jsx'
import Dashboard from "./page/Dashboard/Dashboard.jsx";
import Login from "./page/Authentication/Login.jsx";
import Register from "./page/Authentication/Register.jsx";
import Account from "./page/Account/Account.jsx";
import Products from "./page/Product/Products.jsx";
import Users from "./page/User/Users.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter future={{v7_startTransition: true}}>
            <App>
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/products" element={<Products />}/>
                    <Route path="/users" element={<Users />}/>
                </Routes>
            </App>
        </HashRouter>
    </StrictMode>
)
