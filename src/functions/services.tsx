import { DocumentData } from "firebase/firestore";
import { fireStore, store } from "../firebase"


export async function addUserToLiked(postID: string | undefined, user: DocumentData | undefined) {
    await fireStore.setDoc(fireStore.doc(store, `posts/${postID}/likedBy/${user?.uid}`), {
        photoURL: user?.photoURL,
        uid: user?.uid,
        username: user?.username,
    }).then((res) => console.log('added')).catch((error) => console.log(error))
}

export async function removeUserFromLiked(postID: string | undefined, user: DocumentData | undefined) {
    const userHasLikedDocRef = fireStore.doc(store, `posts/${postID}/likedBy`, user?.uid)
    await fireStore.deleteDoc(userHasLikedDocRef).then(() => console.log("removed")).catch((error) => console.log(error))
}

export const getUserByID = async (userID: string | undefined) => {
    const collRef = fireStore.collection(store, `users`);
    const collQuery = fireStore.query(collRef, fireStore.where('uid', '==', userID))
    const querySnapshot = await fireStore.getDocs(collQuery)
    const result = await querySnapshot.docs.map(doc => ({ ...doc.data() }));
    return result
}

export const deletePostByPostID = async (postID: string | undefined) => {
    const postByPostIDRef = fireStore.doc(store, `posts/${postID}`)
    await fireStore.deleteDoc(postByPostIDRef).then(() => alert("removed")).catch((error) => console.log(error))
}

export const getUserAvatarByUserID = async (UID: string | undefined) => {
    const docSnap = await fireStore.getDoc(fireStore.doc(store, `users/${UID}`));
    if (docSnap.exists()) {
        return (docSnap?.data())
    }
}

export const getLikedByUsers = async (postID: string | undefined) => {
    const collRef = fireStore.collection(store, `posts/${postID}/likedBy`);
    const querySnapshot = await fireStore.getDocs(collRef)
    const result = await querySnapshot.docs.map(doc => ({ ...doc.data() }));
    return result
}



