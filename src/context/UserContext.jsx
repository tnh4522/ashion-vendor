import {createContext, useState} from 'react';

export const UserContext = createContext();

const UserContextProvider = ({children}) => {

        const [user, setUser] = useState(null);

        const login = (user) => {
            setUser(user);
        };

        const logout = () => {
            setUser(null);
        };

        return <UserContext.Provider value={{user, login, logout}}>{children}</UserContext.Provider>
}

export default UserContextProvider;