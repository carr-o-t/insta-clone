import React, { useCallback, useRef, useState } from 'react'
import { HeartIcon, ChatAlt2Icon, ShareIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import { Insta } from '../types'
import { fireStore, store } from '../firebase'
import { DocumentData } from 'firebase/firestore'
import { useAuth } from '../context/AuthProvider'
import { addUserToLiked, removeUserFromLiked } from '../functions/services'
import UserModal from './UserModal'
import DeletePopUp from './DeletePopUp'

/*TODO: generate sharable URLs for each post
*/

function PostLayout({ caption, media, mediaType, byUser, postID, likes }: Insta.PostProp) {

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
    const [isUserModalActive, setIsUserModalActive] = useState<boolean>(false)

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

    const handleIsUserModalActive = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsUserModalActive(true);
    }

    function handleClose() {
        setIsUserModalActive(false)
    }

    return (
        <div className='border-[#8581a0] border rounded-lg max-w-[440px] w-full m-auto bg-festa-one transition-all ease duration-500'>
            <div className="flex justify-between p-3 items-center">
                <div className="flex gap-3 items-center">
                    <Link to={`/profile/${userDoc?.uid}`} className="h-10 w-10 rounded-full">
                        <img src={userDoc?.photoURL} loading="lazy" alt="" className='w-full h-full object-cover rounded-full' />
                    </Link>
                    <Link to={`/profile/${userDoc?.uid}`} className=" text-black font-bold">{userDoc?.username}</Link>
                </div>
                {
                    currentUser?.uid === userDoc?.uid &&
                    <button onClick={(e) => setIsDelete(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>

                    </button>
                }
            </div>
            <div className="w-full aspect-square flex justify-center items-center text-festa-two bg-black overflow-hidden" onClick={playOrPause}>

                {
                    mediaType === 'image' ? <img src={media} loading="lazy" alt="" className='w-auto h-auto object-cover' />
                        :
                        <video src={media} className='w-auto h-full' controls loop onPlay={onPlay} onPause={onPause} ref={videoRef}></video>
                }
            </div>
            <div className="flex flex-col p-3 space-y-2">
                <div className="flex gap-4">

                    {
                        icons.map(({ id, icon: Component, onClick }) => {
                            return (
                                <button className="" >
                                    {
                                        <Component className={`h-7 w-auto cursor-pointer ${(id === "hearticon" && isLiked) ? 'fill-festa-two stroke-0' : ""}`} onClick={onClick} />
                                    }
                                </button>
                            )
                        })
                    }

                </div>
                <div className="text-sm flex gap-x-2">
                    <p className="">{likeCount}</p>
                    <a href="" className="no-underline  font-semibold " onClick={(e) => handleIsUserModalActive(e)}>likes</a>
                </div>
                <div className="flex gap-x-4 items-baseline">
                    <Link to={`/profile/${userDoc?.uid}`}>
                        <span className="text-sm text-black font-bold">{userDoc?.username}</span>
                    </Link>
                    <span className={`text-xs    text-gray-900 flex items-center flex-wrap sm:text-sm`}>
                        {
                            (caption || '').length > 35 ?
                                <>
                                    {
                                        isReadMore ?
                                            <p className="transition-all ease duration-10000 h-[55px]">{caption} <a className="decoration-none cursor-pointer text-red-500 font-semibold transition-all ease duration-500" onClick={() => toggleReadMore()}>read less</a></p>
                                            :
                                            <p className="transition-all ease duration-10000 h-[18px]">{caption?.slice(0, 35)}. . . <a className="decoration-none cursor-pointer text-festa-two font-semibold transition-all ease duration-500" onClick={() => toggleReadMore()}>read more</a></p>
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
                isUserModalActive={isUserModalActive}
                isClose={(e) => handleClose()}
                ID={postID}
                currentUserID={currentUser?.uid}
                header="Likes"
                collectionName="posts"
            />
        </div>
    )
}


export default PostLayout

