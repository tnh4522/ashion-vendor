import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {HashRouter} from "react-router-dom";
import App from './App.jsx'
import NotificationContextProvider from "./context/NotificationContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter future={{v7_startTransition: true}}>
            <NotificationContextProvider>
                <App/>
            </NotificationContextProvider>
        </HashRouter>
    </StrictMode>
)
