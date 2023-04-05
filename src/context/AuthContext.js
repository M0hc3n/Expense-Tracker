import { onAuthStateChanged } from "firebase/auth";
import { createContext , useState, useEffect } from "react";
import { auth } from "../database/firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log('user has changed ' , user);
        })

        // clean-up function to avoid memory leakage
        return () => {
            unsub();
        }
    }, []);

    return(
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )
}