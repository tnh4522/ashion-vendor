import SideBar from "./layout/SideBar.jsx";
import SearchBar from "./component/SearchBar.jsx";
import Footer from "./layout/Footer.jsx";
import UserContextProvider from "./context/UserContext.jsx";

function App({children}) {
    const href = window.location.href;
    if (href.includes("login") || href.includes("register")) {
        return (
            <UserContextProvider>
                <div className="container-xxl">
                    <div className="authentication-wrapper authentication-basic container-p-y">
                        <div className="authentication-inner">
                            {children}
                        </div>
                    </div>
                </div>
            </UserContextProvider>
        )
    }
    return (
        <UserContextProvider>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <SideBar/>
                    <div className="layout-page">
                        <SearchBar/>
                        <div className="content-wrapper">
                            {children}
                        </div>
                        <Footer/>
                    </div>
                    <div className="layout-overlay layout-menu-toggle"></div>
                </div>
            </div>
        </UserContextProvider>
    )
}

export default App
