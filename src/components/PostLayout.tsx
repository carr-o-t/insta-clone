import React, { useCallback, useRef, Fragment, useState } from 'react'
import { HeartIcon, ChatAlt2Icon, ShareIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import { Insta } from '../types'
import { fireStore, store } from '../firebase'
import { DocumentData } from 'firebase/firestore'
import { useAuth } from '../context/AuthProvider'
import { addUserToLiked, deletePostByPostID, removeUserFromLiked } from '../functions/services'
import { Dialog, Transition } from '@headlessui/react'
import UserModal from './UserModal'

/*TODO: generate sharable URLs for each post
*/

function PostLayout({ caption, media, mediaType, byUser, postID, createdAt }: Insta.PostProp) {

    // function to calculate time ago the post was made
    async function timeSince(postID: string | undefined) {

        let seconds: number = 0;
        const postDocSnap = await fireStore.getDoc(fireStore.doc(store, `posts/${postID}`));
        if (postDocSnap.exists()) {
            seconds = postDocSnap?.data()?.timestamp.seconds;
        }

        var secs = Math.floor((new Date().getTime() / 1000 - seconds));

        var interval = secs / 31536000;
        if (interval > 1) {
            return setTimeAgo(Math.ceil(interval) + " years");
        }
        interval = secs / 2592000;
        if (interval > 1) {
            return setTimeAgo(Math.ceil(interval) + " months");
        }
        interval = secs / 86400;
        if (interval > 1) {
            return setTimeAgo(Math.ceil(interval) + " days");
        }
        interval = secs / 3600;
        if (interval > 1) {
            return setTimeAgo(Math.ceil(interval) + " hours");
        }
        interval = secs / 60;
        if (interval > 1) {
            return setTimeAgo(Math.ceil(interval) + " minutes");
        }
        return setTimeAgo(Math.ceil(secs) + " secs");
    }

    const { currentUser } = useAuth()

    const likeRef = useRef() as React.MutableRefObject<HTMLButtonElement>
    const [isLiked, setIsLiked] = useState<boolean | null>(null)
    const [userRef, setUserRef] = useState<DocumentData | undefined>()
    const [userDoc, setUserDoc] = useState<DocumentData | undefined>()
    const [likeCount, setLikeCount] = useState(0)
    const [timeAgo, setTimeAgo] = useState<string | undefined>()
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [isReadMore, setIsReadMore] = useState<boolean>(false)
    const [isLikeActive,setIsLikeActive] = useState<boolean>(false)

    const icons = React.useMemo(() => {
        return [
            { id: 'hearticon', icon: HeartIcon, className: isLiked ? 'fill-red-600 stroke-0' : '', onClick: () => { setIsLiked(typeof isLiked === null ? true : !isLiked) } },
            { id: 'chatalt2icon', icon: ChatAlt2Icon, className: '', onClick: () => { } },
            { id: 'shareicon', icon: ShareIcon, className: '', onClick: () => { } },
        ]
    }, [isLiked])

    const [isPlaying, setIsPlaying] = useState(false)
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;

    const playOrPause = useCallback(() => {
        if (videoRef.current.paused || videoRef.current.ended) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, []);

    const getUserByID = useCallback(async () => {
        await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`)).then((querySnapShot) => {
            if (querySnapShot.exists())
                setUserRef(querySnapShot.data())
        })
    }, [])

    const getAuthor = useCallback(async () => {
        await fireStore.getDoc(fireStore.doc(store, `users/${byUser}`)).then((querySnapShot) => {
            if (querySnapShot.exists())
                setUserDoc(querySnapShot.data())
        })
    }, [])

    function delayedFunc() {
        const timer: NodeJS.Timeout = setTimeout(() => {
            getUserByID();
            timeSince(postID);
        }, 500)
        return () => clearTimeout(timer)
    }

    React.useEffect(() => {
        getUserByID();
        getAuthor();
        getIsLikedByUser();
        delayedFunc();
    }, [])


    const getIsLikedByUser = async () => {
        const postLikedDocSnap = await fireStore.getDoc(fireStore.doc(store, `posts/${postID}/likedBy/${currentUser?.uid}`));
        if (postLikedDocSnap.exists()) {
            console.log(postLikedDocSnap)
            setIsLiked(true)
        }
    }

    React.useEffect(() => {
        if (isLiked == true) {
            addUserToLiked(postID, { ...userRef, uid: currentUser?.uid })
        }
        if (isLiked == false) {
            removeUserFromLiked(postID, { ...userRef, uid: currentUser?.uid })
        }
    }, [isLiked])

    // like count
    React.useEffect(() => {
        const postRef = fireStore.collection(store, `posts/${postID}/likedBy`)
        fireStore.onSnapshot(postRef, (querySnapShot) => {
            setLikeCount(querySnapShot.size)
        })
    }, [])

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore)
    }

    const handleIsLikeActive = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsLikeActive(true);
    }

    function handleClose(){
        setIsLikeActive(false)
    }

    return (
        <div className='border-gray-500/60 border rounded-lg max-w-[440px] w-full m-auto bg-white transition-all ease duration-500'>
            <div className="flex justify-between p-3 items-center">
                <div className="flex gap-3 items-center">
                    <Link to={`/profile/${userDoc?.uid}`} className="h-8 w-8 rounded-full">
                        <img src={userDoc?.photoURL} alt="" className='w-full h-full object-cover rounded-full' />
                    </Link>
                    <Link to={`/profile/${userDoc?.uid}`} className="text-sm bold">{userDoc?.username}</Link>
                </div>
                {
                    currentUser?.uid === userDoc?.uid &&
                    <button onClick={(e) => setIsDelete(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                    </button>
                }

            </div>
            <div className="w-full aspect-square flex justify-center items-center bg-black overflow-hidden" onClick={playOrPause}>

                {
                    mediaType === 'image' ? <img src={media} alt="" className='w-auto h-auto object-cover' />
                        :
                        <video src={media} className='w-auto h-full' loop onPlay={onPlay} onPause={onPause} ref={videoRef}></video>
                }
            </div>
            <div className="flex flex-col p-3 space-y-2">
                <div className="flex gap-4">
                    {
                        icons.map(({ id, icon: Component, onClick }) => {
                            return (
                                <button className="" >
                                    <Component key={id} className={`h-7 w-auto cursor-pointer ${(id === "hearticon" && isLiked) ? 'fill-red-600 stroke-0' : ""}`} onClick={onClick} />
                                </button>
                            )
                        })
                    }
                </div>
                <div className="text-sm flex gap-x-2">
                    <p className="">{likeCount}</p>
                    <a href="" className="no-underline text-black font-semibold " onClick={(e) => handleIsLikeActive(e)}>likes</a>
                </div>
                <div className="flex gap-x-4 items-baseline">
                    <Link to={`/profile/${userDoc?.uid}`}>
                        <span className="text-sm font-semibold">{userDoc?.username}</span>
                    </Link>
                    <span className={`text-xs    text-gray-900 flex items-center flex-wrap sm:text-sm`}>
                        {
                            (caption || '').length > 35 ?
                                <>
                                    {
                                        isReadMore ?
                                            <p className="transition-all ease duration-10000 h-[55px]">{caption} <a className="decoration-none cursor-pointer text-red-500 font-semibold transition-all ease duration-500" onClick={() => toggleReadMore()}>read less</a></p>
                                            :
                                            <p className="transition-all ease duration-10000 h-[18px]">{caption?.slice(0, 35)}. . . <a className="decoration-none cursor-pointer text-blue-500 font-semibold transition-all ease duration-500" onClick={() => toggleReadMore()}>read more</a></p>
                                    }
                                </>
                                :
                                caption
                        }
                    </span>
                </div>
                <div className="text-xs text-gray-500">{timeAgo} ago</div>
            </div>
            <DeletePopUp
                isDelete={isDelete}
                isClose={(e) => setIsDelete(false)}
                postID={postID}
            />
            <UserModal
                isLikeActive={isLikeActive}
                isClose={(e) => handleClose()}
                postID={postID}
            />
        </div>
    )
}

function DeletePopUp({ isDelete, isClose, postID }: Insta.deleteProp) {

    const closeModal = useRef() as React.MutableRefObject<HTMLButtonElement>;

    const handleDelete = () => {
        deletePostByPostID(postID);
        closeModal.current.click();
    }

    return (
        <>
            <Transition appear show={isDelete} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={(e) => isClose}>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h5"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Are you sure you want to delete this post?
                                    </Dialog.Title>

                                    <div className="mt-4 flex justify-between">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={isClose}
                                            ref={closeModal}
                                        >
                                            cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() => handleDelete()}
                                        >
                                            delete
                                        </button>
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



export default PostLayout

