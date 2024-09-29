// context/UserContext.jsx
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
function UserContextProvider({ children }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('data');
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('data');
        setUserData(null);
    };

    return (
        <UserContext.Provider value={{ userData, setUserData, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
