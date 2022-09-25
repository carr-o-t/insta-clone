import { initializeApp } from 'firebase/app'
import * as firebaseAuth from 'firebase/auth';
import * as fireStore from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

console.log(process.env.REACT_APP_API_KEY)
console.log(process.env.REACT_APP_PROJECT_ID)

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

const app = initializeApp(firebaseConfig);


export const auth = firebaseAuth.getAuth(app);

export const store = fireStore.getFirestore(app);

export const storage = getStorage(app);


export { fireStore, firebaseAuth }
