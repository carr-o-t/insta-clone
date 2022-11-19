import { Dialog, Transition } from '@headlessui/react'
import React, { useState, Fragment } from 'react'
import { fireStore, store } from '../firebase'
import { Insta } from '../types'
import { XIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import Follow from './buttons/Follow'
import { useAuth } from '../context/AuthProvider'
import { addUserToFolloweeAndFollower, getUserByID, removeUserFromFolloweeAndFollower } from '../functions/services'
import { ReactComponent as FollowingIcon } from '../assets/svgs/followed_icon.svg'

function UserModal({
    isUserModalActive,
    isClose,
    ID,
    header,
    collectionName
}: Insta.UserModalProp) {

    const { currentUser } = useAuth()

    const [usersList, setUsersList] = useState<fireStore.DocumentData | undefined>([])
    const [user, setUser] = useState<fireStore.DocumentData | undefined>()
    const closeModal = React.useRef() as React.MutableRefObject<HTMLButtonElement>;
    const [isFollow, setIsFollow] = React.useState<boolean | null>(null)
    const [followeeID, setFolloweeID] = React.useState<string | undefined>()
    const [followerData, setFollowerData] = React.useState<fireStore.DocumentData | undefined>()
    const [followeeData, setFolloweeData] = React.useState<fireStore.DocumentData | undefined>()
    const [loading, setLoading] = React.useState<boolean>(false)

    const handleFollow = (followee: string | undefined, idx: any) => {
        setIsFollow(typeof isFollow === null ? true : !isFollow);
        setFolloweeID(followee);
    }

    const getIsFollowedByUser = async () => {
        const userFolloweeDocSnap = await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}/followees/${followeeID}`));
        if (userFolloweeDocSnap.exists()) {
            setIsFollow(true);
        }
    }

    React.useEffect(() => {
        getUserByID(currentUser?.uid).then((result) => setFollowerData(result));
        getUserByID(followeeID).then((result) => setFolloweeData(result));
        getUserByID(ID).then((result) => setUser(result))
    }, [isFollow])

    React.useEffect(() => {
        if (isFollow == true) {
            // addUserToFolloweeAndFollower(currentUser?.uid, followeeID, { ...followerData, uid: currentUser?.uid }, { ...followeeData, uid: followeeID })
        }
        if (isFollow == false) {
            // removeUserFromFolloweeAndFollower(currentUser?.uid, followeeID)
        }
    }, [isFollow])

    const handleRef = () => {
        closeModal.current.click();
    }

    const getLikedUsers = async () => {
        if (collectionName === "posts") {
            const collRef = fireStore.collection(store, `posts/${ID}/likedBy`);
            await fireStore.onSnapshot(collRef, (querySnapshot) => {
                setUsersList(querySnapshot.docs.map(doc => ({ ...doc.data() })))
            })
        }
        else if (collectionName === "followers") {
            const collRef = fireStore.collection(store, `users/${ID}/followers`);
            await fireStore.onSnapshot(collRef, (querySnapshot) => {
                setUsersList(querySnapshot.docs.map(doc => ({ ...doc.data() })))
            })
        }
        else if (collectionName === "followees") {
            const collRef = fireStore.collection(store, `users/${ID}/followees`);
            await fireStore.onSnapshot(collRef, (querySnapshot) => {
                setUsersList(querySnapshot.docs.map(doc => ({ ...doc.data() })))
            })
        }
        else return
    }
    React.useEffect(() => {
        getLikedUsers();
        getIsFollowedByUser();
    }, [isUserModalActive])

    if (!isUserModalActive) return <></>
    return (
        <>
            <Transition appear show={isUserModalActive} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleRef}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="w-full max-w-md no-scrollbar overflow-scroll transform rounded-2xl bg-festa-one p-4 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="div"
                                        className="relative border-b border-festa-five"
                                    >
                                        <h4 className="text-md font-medium leading-6 text-gray-900 text-center tracking-wider mb-2">{header}</h4>
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 h-7 w-7 p-2 rounded-full border border-transparent bg-festa-three text-sm font-medium text-festa-two hover:bg-festa-six hover:text-festa-one focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={isClose}
                                            ref={closeModal}
                                        >
                                            <XIcon type="button" className="absolute h-auto w-auto top-0 right-0 cursor-pointer" />
                                        </button>
                                    </Dialog.Title>
                                    <div className="mt-2 max-h-56 overflow-y-scroll no-scrollbar">
                                        {usersList?.length > 0 ?
                                            usersList?.map((user: any, idx: any) => {
                                                return (
                                                    <div className="flex  flex-col gap-y-4">
                                                        {/* <div className="flex justify-between items-center  cursor-pointer hover:bg-festa-three p-2 rounded-md"> */}
                                                        <Link to={`/profile/${user.uid}`} className="flex gap-3 items-center cursor-pointer hover:bg-festa-six hover:text-festa-one transition-all duration-100 p-2 rounded-md">
                                                            <div className="h-10 w-10 rounded-full">
                                                                <img src={user.photoURL} loading="lazy" alt="" className="h-10 w-10 object-cover rounded-full" />
                                                            </div>
                                                            <span className="text-sm font-semibold">{user.username}</span>
                                                        </Link>
                                                        {/* <button
                                                                className={`text-white font-semibold px-4 py-1 rounded-lg cursor-pointer ${isFollow ? 'bg-festa-one border border-gray-300' : 'bg-blue-500'}`}
                                                                onClick={(e) => handleFollow(user.uid, idx)}
                                                            >
                                                                {
                                                                    isFollow ?
                                                                        <FollowingIcon className="h-6 w-6" />
                                                                        :
                                                                        <span className="">Follow</span>
                                                                }
                                                            </button> */}
                                                        {/* <Follow key={idx} isFollow={isFollow} onClick={(e) => handleFollow(user.uid, idx)} /> */}
                                                        {/* </div> */}
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className="text-center text-sm font-medium p-4">
                                                {
                                                    collectionName === "posts" ? <span className="">be the first to like this post!</span>
                                                        :
                                                        collectionName === "followers" ? <span className="">{user?.username} has no follwers yet!</span>
                                                            :
                                                            <span className="">{user?.username} is following no one!</span>
                                                }
                                            </div>
                                        }
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>

    )
}

export default UserModal