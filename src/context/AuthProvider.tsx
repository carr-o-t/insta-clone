import React from 'react'
import { auth, firebaseAuth } from '../firebase';
import { Insta } from '../types';

interface CreateUserParams {
    email: string;
    password: string;
}

interface loginWithEmailAndPasswordParams {
    email: string;
    password: string;
}

const AuthContext = React.createContext<Insta.AuthContext>({
    currentUser: null,
    createUserWithEmail: () => new Promise((_resolve, reject) => reject({ success: false, message: "Initial Reject" })),
    signInWithGoogle: () => new Promise((_resolve, reject) => reject({ success: false, message: "Initial Reject" })),
    loginWithEmailAndPassword: () => new Promise((_resolve, reject) => reject({success: false, message: "Initial Reject"}))
})

export function useAuth() {
    return React.useContext<Insta.AuthContext>(AuthContext);
}

function AuthProvider({ children }: Insta.Children) {
    const [currentUser, setCurrentUser] = React.useState<null | Insta.CurrentUser>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    function createUserWithEmail({ email = "", password = "" }: CreateUserParams) {
        return firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
    }

    function signInWithGoogle(): Promise<firebaseAuth.UserCredential> {
        const provider = new firebaseAuth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');

        return firebaseAuth.signInWithPopup(auth, provider)
    }

     function loginWithEmailAndPassword({email, password }: loginWithEmailAndPasswordParams){
        return firebaseAuth.signInWithEmailAndPassword(auth, email, password)
    }

    React.useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setIsLoading(false)
        })

        return unsubscribe
    }, [])


    const values = {
        currentUser,
        createUserWithEmail,
        signInWithGoogle,
        loginWithEmailAndPassword
    }
    return (
        <AuthContext.Provider value={{
            ...values
        }}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider