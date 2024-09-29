import {useContext} from "react";
import {NotificationContext} from "../context/NotificationContext";

const useNotificationContext = () => {
    return useContext(NotificationContext);
}
export default useNotificationContext;