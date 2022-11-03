import { async } from "@firebase/util";
import { DocumentData } from "firebase/firestore";
import { fireStore, store } from "../firebase"

export async function getDefaultAvatars() {
    const querySnapshot = await fireStore.getDocs(fireStore.collection(store, `avatars`))
    const result = querySnapshot.docs.map(doc => ({ ...doc.data() }));
    return result
}

export async function addUserToLiked(postID: string | undefined, user: DocumentData | undefined) {
    await fireStore.setDoc(fireStore.doc(store, `posts/${postID}/likedBy/${user?.uid}`), {
        photoURL: user?.photoURL,
        uid: user?.uid,
        username: user?.username,
        displayName: user?.displayName
    })
        .then(async () => {
            await fireStore.updateDoc(fireStore.doc(store, `posts/${postID}`), {
                likes: await fireStore.getDocs(fireStore.collection(store, `posts/${postID}/likedBy`)).then((querySnapShot) => {
                    return (querySnapShot.size)
                })
            })
        })
}

export async function removeUserFromLiked(postID: string | undefined, user: DocumentData | undefined) {
    const userHasLikedDocRef = fireStore.doc(store, `posts/${postID}/likedBy`, user?.uid)
    await fireStore.deleteDoc(userHasLikedDocRef)
        .then(async () => {
            await fireStore.updateDoc(fireStore.doc(store, `posts/${postID}`), {
                likes: await fireStore.getDocs(fireStore.collection(store, `posts/${postID}/likedBy`)).then((querySnapShot) => {
                    return (querySnapShot.size)
                })
            })
        })
}

export const getUserByID = async (userID: string | undefined) => {
    const querySnapshot = await fireStore.getDoc(fireStore.doc(store, `users/${userID}`))
    return querySnapshot.data()
}

export const getPostsByUserID = async (userID: string | undefined) => {
    const postRef = fireStore.query(fireStore.collection(store, `posts`), fireStore.where('byUser', "==", userID), fireStore.orderBy("timestamp", "desc"))
    const querySnapshot = await fireStore.getDocs(postRef)
    const result = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return result
}

export const deletePostByPostID = async (postID: string | undefined) => {
    const postByPostIDRef = fireStore.doc(store, `posts/${postID}`)
    await fireStore.deleteDoc(postByPostIDRef)
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

export const getUsersByUserName = async (username: string) => {
    const userRef = fireStore.query(fireStore.collection(store, `users`), fireStore.where('username', ">=", username), fireStore.where('username', "<=", username + '\uf8ff'))
    const querySnapshot = await fireStore.getDocs(userRef)
    const result = await querySnapshot.docs.map(doc => ({ ...doc.data() }));
    return result
}

export const addUserToRecentSearch = async (currUID: string | undefined, uid: string, username: string, displayName: string, photoURL: string) => {
    await fireStore.setDoc(fireStore.doc(store, `users/${currUID}/recentSearches/${uid}`), {
        photoURL: photoURL,
        uid: uid,
        username: username,
        displayName: displayName
    })
}

export const removeAllRecentSearch = async (currUID: string | undefined) => {
    const userRef = fireStore.collection(store, `users/${currUID}/recentSearches`)
    const querySnapshot = await fireStore.getDocs(userRef)
    const result = await querySnapshot.docs.map(doc => ({ ...doc.data, id: doc.id }));
    result.forEach(async (res) => {
        const postByPostIDRef = fireStore.doc(store, `users/${currUID}/recentSearches/${res.id}`)
        await fireStore.deleteDoc(postByPostIDRef).then(() => alert("removed"))
    });
}

export const getRecentSearches = async (currUID: string | undefined) => {
    const querySnapshot = await fireStore.getDocs(fireStore.collection(store, `users/${currUID}/recentSearches`))
    const result = await querySnapshot.docs.map(doc => ({ ...doc.data() }));
    return result
}

//followerID = current user uid
//followeeID = person current user wants to follow

export const addUserToFolloweeAndFollower = async (followerID: string | undefined, followeeID: string | undefined, follower: DocumentData | undefined, followee: DocumentData | undefined) => {
    await fireStore.setDoc(fireStore.doc(store, `users/${followerID}/followees/${followeeID}`), {
        photoURL: followee?.photoURL,
        uid: followee?.uid,
        username: followee?.username,
        displayName: followee?.displayName
    })
        .then(async () => {
            await fireStore.updateDoc(fireStore.doc(store, `users/${followerID}`), {
                followeeCount: await fireStore.getDocs(fireStore.collection(store, `users/${followerID}/followees`)).then((querySnapShot) => {
                    return (querySnapShot.size)
                })
            })
        })
        .finally(async () => {
            await fireStore.setDoc(fireStore.doc(store, `users/${followeeID}/followers/${followerID}`), {
                photoURL: follower?.photoURL,
                uid: follower?.uid,
                username: follower?.username,
                displayName: follower?.displayName
            })
                .then(async () => {
                    await fireStore.updateDoc(fireStore.doc(store, `users/${followeeID}`), {
                        followerCount: await fireStore.getDocs(fireStore.collection(store, `users/${followeeID}/followers`)).then((querySnapShot) => {
                            return (querySnapShot.size)
                        })
                    })
                })
        })

}

export const removeUserFromFolloweeAndFollower = async (followerID: string | undefined, followeeID: string | undefined) => {
    await fireStore.deleteDoc(fireStore.doc(store, `users/${followerID}/followees/${followeeID}`))
        .then(async () => {
            await fireStore.updateDoc(fireStore.doc(store, `users/${followerID}`), {
                followeeCount: await fireStore.getDocs(fireStore.collection(store, `users/${followerID}/followees`)).then((querySnapShot) => {
                    return (querySnapShot.size)
                })
            })
        })
        .finally(async () => {
            await fireStore.deleteDoc(fireStore.doc(store, `users/${followeeID}/followers/${followerID}`))
                .then(async () => {
                    await fireStore.updateDoc(fireStore.doc(store, `users/${followeeID}`), {
                        followerCount: await fireStore.getDocs(fireStore.collection(store, `users/${followeeID}/followers`)).then((querySnapShot) => {
                            return (querySnapShot.size)
                        })
                    })
                })
        })
}




