import {createContext} from "react";
import {notification} from "antd";

export const NotificationContext = createContext({
    name: 'Default',
});

// eslint-disable-next-line react/prop-types
function NotificationContextProvider({children}) {
    const [api, contextHolder] = notification.useNotification();

    const openSuccessNotification = (message) => {
        api.success({
            message: 'Successfully',
            description: `${message}`,
            placement: 'bottomLeft'
        });
    };

    const openErrorNotification = (message) => {
        api.error({
            message: 'Error',
            description: `${message}`,
            placement: 'bottomLeft'
        });
    };

    return (
        <NotificationContext.Provider value={{openSuccessNotification, openErrorNotification}}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
}
export default NotificationContextProvider;