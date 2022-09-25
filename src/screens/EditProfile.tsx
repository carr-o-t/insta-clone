import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useRef, useState } from 'react'
import { isJSDocAugmentsTag } from 'typescript';
import { useAuth } from '../context/AuthProvider';
import { dummyData } from '../data/Data'
import { fireStore, storage, store } from '../firebase';
import { getUserAvatarByUserID } from '../functions/services';
import { Insta } from '../types';

//FIXME: userDocRef is undefined

//FIXME: profile image preview not visible

function EditProfile() {

    const { currentUser } = useAuth()
    const [userDocRef, setUserDocRef] = useState<fireStore.DocumentData | undefined>()
    const [img, setImg] = useState<File | null>(null)
    const [preview, setPreview] = useState("")
    const [wordCount, setWordCount] = useState(0)
    const [bio, setBio] = useState("")
    const [userUpdateData, setUserUpdateData] = useState({
        name: "",
        username: "",
        email: "",
        bio: ""
        // gender: currentUser?.gender
    })

    const onImageChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            setImg(e.target.files[0])
            console.log(img)
        }
    }, [])

    const handleEditSave = async () => {
console.log(img)
        const storageRef = ref(storage, `images/${img?.name}`);
        if (!img) {
            fireStore.setDoc(fireStore.doc(store, `users/${currentUser?.uid}`), {
                photoURL: preview,
                displayName: userUpdateData.name,
                email: userUpdateData.email,
                // gender: userUpdateData.gender,
                username: userUpdateData.username,
                uid: currentUser?.uid,
                bio: userUpdateData.bio
            })
            alert("Profile updated!")
        return
        }

        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
            "state_changed",
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url)
                    fireStore.setDoc(fireStore.doc(store, `users/${currentUser?.uid}`), {
                        photoURL: url,
                        displayName: userUpdateData.name,
                        email: userUpdateData.email,
                        // gender: userUpdateData.gender,
                        username: userUpdateData.username,
                        uid: currentUser?.uid,
                        bio: userUpdateData.bio
                    })
                    alert("Profile updated!")
                })
                    .catch((err) => {
                        alert(err)
                    })
            }
        )

    }

    const fileInput = useRef() as React.MutableRefObject<HTMLInputElement>;
    const selectFile = () => {
        fileInput.current.click();
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, type: string) {
        console.log("onchange triggered");
    }

    const getUserByID = async () => {
        const userDocSnap = await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`))
        setUserDocRef(userDocSnap?.data())
        console.log(userDocRef, userUpdateData);
    }

    const getUser = React.useCallback(async () => {
        await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`)).then((querySnapShot) => {
            if (querySnapShot.exists())
                setUserDocRef(querySnapShot.data())
            setUserUpdateData({
                name: querySnapShot.data()?.displayName,
                username: querySnapShot.data()?.username,
                email: querySnapShot.data()?.email,
                bio: querySnapShot.data()?.bio,
            })
            console.log(userDocRef, userUpdateData)
        })
    }, [])

    const getUserAvatarByUserID = async () => {
        const docSnap = await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`));
        if (docSnap.exists()) {
            setPreview(docSnap?.data()?.photoURL)
        }
    }

    const get = React.useCallback(async () => {
        await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`)).then((querySnapShot) => {
            if (querySnapShot.exists())
                console.log("")
            // setUserRef(querySnapShot.data())
        })
        // console.log(userRef)
    }, [])

    React.useEffect(() => {
        getUserAvatarByUserID()
        console.log(img)
        // console.log(image.photoURL)
        getUser()
    }, [])

    React.useEffect(() => {
        if (!img) {
            setPreview("")
            return
        }
        try {
            const objectUrl = URL.createObjectURL(img)
            setPreview(objectUrl)
        } catch(err){console.log(err)}
        // return () => URL.revokeObjectURL(objectUrl)
    }, [img])

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWordCount(e.target.value.length)
        setUserUpdateData({ ...userUpdateData, bio: e.target.value })
    }

    return (
        <div className="w-full h-full max-w-4xl m-auto p-8">
            <div className="border border-gray-300 rounded-lg p-8" >
                <div className="w-[max-content] mx-auto flex flex-col gap-8">
                    <div className="flex gap-8 items-center">
                        <input ref={fileInput} type="file" className="hidden" onChange={(e) => onImageChange(e)} name="avatar" accept="image/png, image/gif, image/jpeg" id="" />
                        {/* <button onClick={selectFile} className="w-16 h-16 rounded-full"> */}
                        <img onClick={() => fileInput.current.click()} src={preview} className="w-16 h-16 object-cover rounded-full" alt="" />
                        {/* </button> */}
                        <div className="">
                            <h3 className="text-lg font-medium">{userDocRef?.username}</h3>
                            <button onClick={selectFile} className="text-blue-500 font-semibold text-sm">Change profile pic</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <EditInput value={userUpdateData.name} onChange={(e) => setUserUpdateData({ ...userUpdateData, name: e.target.value })} type="name" placeholder="Name" label="Name" />
                        <EditInput value={userUpdateData.username} onChange={(e) => setUserUpdateData({ ...userUpdateData, username: e.target.value })} type="name" placeholder="username" label="Username" />
                        <EditInput value={userUpdateData.email} onChange={(e) => setUserUpdateData({ ...userUpdateData, email: e.target.value })} type="email" placeholder="Email" label="Email" />
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-16">
                            <label htmlFor="" className="grow font-semibold">Bio</label>
                            
                            <div className="flex flex-col justify-between  h-full">
                                <textarea className="resize-none outline-none border border-gray-300 rounded-lg p-2 text-sm h-full w-full" name="" id="" placeholder='Write bio here...' maxLength={20} value={userUpdateData.bio}
                                    onChange={(e) => {
                                        handleTextAreaChange(e)
                                    }}
                                ></textarea>
                                <div className="p-3 text-end">
                                    <p className="text-sm text-gray-400">{wordCount}/20</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <button className="bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-500/80 rounded-lg w-[fit-content] mx-auto" onClick={(e) => handleEditSave()}>Update Profile</button>
                </div>
            </div>
        </div>
    )
}

function EditInput({
    label,
    value,
    placeholder,
    type,
    onChange,
}: Insta.InputProps) {

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-16">
            <label htmlFor="" className="grow font-semibold">{label}</label>
            <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="border border-gray-300 rounded-lg p-2 text-sm" />
        </div>
    )

}

export default EditProfile