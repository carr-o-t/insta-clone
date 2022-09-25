import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CogIcon } from '@heroicons/react/outline'
import { Insta } from '../types'
import { dummyData } from '../data/Data'
import { fireStore, store } from '../firebase'
import { useAuth } from '../context/AuthProvider'


function ProfileHeader({ userID }: Insta.ProfileHeaderProps) {

    const [windowSize, setWindowSize] = useState(getWindowSize());

    const { currentUser } = useAuth()

    const [userDoc, setUserDoc] = useState<fireStore.DocumentData | undefined>();
    const [userPostDoc, setUserPostDoc] = useState<fireStore.DocumentData | undefined>();
    const [postCount, setPostCount] = useState(0)


    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const getUserByID = React.useCallback(async () => {
        const userDocSnap = await fireStore.getDoc(fireStore.doc(store, `users/${userID}`))
        if (userDocSnap.exists())
            setUserDoc(userDocSnap?.data())
    }, [])

    useEffect(() => {
        getUserByID();
        console.log(userDoc)
    }, [])

    React.useEffect(() => {
        const postRef = fireStore.collection(store, `users/${userID}/posts`)
        fireStore.onSnapshot(postRef, (querySnapShot) => {
            setPostCount(querySnapShot.size)
        })
    }, [])

    return (
        <div className="p-4 smmd:p-8 gap-4 mb-4">
            <div className="flex gap-8 smmd:gap-12 md:gap-24">
                <div className="md:h-40 aspect-square rounded-full h-20 smmd:h-40">
                    <img src={userDoc?.photoURL} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className=" flex flex-col gap-2 justify-between ">
                    <div className="flex gap-4 items-center flex-wrap md:flex-nowrap">
                        <div className="">
                            <div className="text-lg font-medium truncate md:max-w-[31ch] w-full max-w-[15ch] smmd:text-xl smmd:text-2xl">{userDoc?.username} </div>
                        </div>
                        {
                            currentUser?.uid === userID &&
                            <>
                                <Link to="/profile/edit" className="p-1 border border-gray-200 rounded-md text-sm font-semibold order-3 justify-center w-[23ch] smmd:order-none smmd:w-[fit-content] text-center">Edit profile</Link>
                                <CogIcon className="h-8 w-8" />
                            </>
                        }
                    </div>
                    <div className="items-center gap-8 hidden smmd:flex">
                        <div className="text-sm flex items-baseline gap-1">
                            <span className="font-semibold">{postCount}</span>
                            <span className="">posts</span>
                        </div>
                        <div className="text-sm flex items-baseline gap-1">
                            <span className="font-semibold">10</span>
                            <span className="">followers</span>
                        </div>
                        <div className="text-sm flex items-baseline gap-1">
                            <span className="font-semibold">10</span>
                            <span className="">following</span>
                        </div>
                    </div>
                    <div className="smmd:flex smmd:flex-col hidden">
                        <span className="text-sm font-semibold">{userDoc?.displayName}</span>
                        <div className="">
                            <p className="m-0 p-0 text-sm">
                                {userDoc?.bio}
                            </p>
                        </div>
                    </div>
                    <span>{windowSize.innerWidth}</span>
                </div>
            </div>
            <div className="flex flex-col smmd:hidden">
                <span className="text-sm font-medium">{userDoc?.displayName}</span>
                <div className="">
                    <p className="m-0 p-0 text-xs">{userDoc?.bio}<br />
                        bio
                    </p>
                </div>
            </div>
        </div>
    )
}

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}

export default ProfileHeader