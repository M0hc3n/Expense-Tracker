import { onAuthStateChanged } from "firebase/auth";
import { createContext , useState, useEffect } from "react";
import { auth } from "../database/firebase";

import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "database/firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});
    const [userInfo , setUserInfo] = useState({});


    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            console.log('user has changed ' , user);

            let q = query(collection(db, "users"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);

            // render info of the user            
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());

                const document_data = doc.data();
                setUserInfo({...document_data, document_id: doc.id});

            });
            
        })

        // clean-up function to avoid memory leakage
        return () => {
            unsub();
        }
    }, []);

    console.log('here');

    return(
        <AuthContext.Provider value={{currentUser, userInfo}}>
            {children}
        </AuthContext.Provider>
    )
}