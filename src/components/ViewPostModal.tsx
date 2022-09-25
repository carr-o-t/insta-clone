import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { Insta } from '../types'
import Avatar from './Avatar'
import { XIcon, HeartIcon, ChatAlt2Icon, ShareIcon, BookmarkIcon } from '@heroicons/react/outline'
import ReactPlayer from 'react-player'
import { fireStore, store } from '../firebase'
import { useAuth } from '../context/AuthProvider'
import { addUserToLiked, removeUserFromLiked } from '../functions/services'
import UserModal from './UserModal'
import { Link } from 'react-router-dom'
// import { getUserByID } from '../functions/services'

/* TODO: post data display
        like count
        slider for posts
*/

function ViewPostModal({ postID, userID, posts, viewPost, onClose }: Insta.ViewPostProps) {

    const { currentUser } = useAuth()
    const [isLiked, setIsLiked] = useState<boolean | null>(null)
    const [user, setUser] = useState<fireStore.DocumentData | undefined>()
    const [isReadMore, setIsReadMore] = useState<boolean>(false)
    const [userRef, setUserRef] = useState<fireStore.DocumentData | undefined>()
    const [isLikeActive, setIsLikeActive] = useState<boolean>(false)
    const [postid, setPostId] = useState<string | undefined>("")
    const icons = React.useMemo(() => {
        return [
            { id: 'hearticon', icon: HeartIcon, onClick: () => { setIsLiked(typeof isLiked === null ? true : !isLiked) } },
            { id: 'chatalt2icon', icon: ChatAlt2Icon, onClick: () => { } },
            { id: 'shareicon', icon: ShareIcon, onClick: () => { } },
        ]
    }, [isLiked])


    const getUserByID = async () => {
        const collRef = fireStore.doc(store, `users/${userID}`);
        await fireStore.onSnapshot(collRef, (querySnapshot) => {
            setUser(querySnapshot.data())
        })
    }
    const getIsLikedByUser = async () => {
        setPostId(postID)
        const postLikedDocSnap = await fireStore.getDoc(fireStore.doc(store, `posts/${postID}/likedBy/${currentUser?.uid}`));
        if (postLikedDocSnap.exists()) {
            setIsLiked(true)
        }
    }

    React.useEffect(() => {
        console.log(postID)
        getUserByID();
        getIsLikedByUser();
        console.log(isLiked)
        console.log(user)
        console.log(posts.postDetail.likes)
    }, [])

    React.useEffect(() => {
        if (isLiked == true) {
            addUserToLiked(postID, { ...user, uid: currentUser?.uid })
        }
        if (isLiked == false) {
            removeUserFromLiked(postID, { ...user, uid: currentUser?.uid })
        }
    }, [isLiked])

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore)
    }

    const handleIsLikeActive = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsLikeActive(true);
    }

    function handleClose() {
        setIsLikeActive(false)
    }

    return (
        <>
            <Transition appear show={viewPost} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={(e) => onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <button className="absolute right-5 top-5 cursor-pointer p-1 bg-white/50 hover:bg-white/30 rounded-full" onClick={onClose}>
                            <XIcon className="h-5 w-auto" />
                        </button>
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


                                <Dialog.Panel className="w-full h-full max-w-[80%] sm:aspect-video transform  rounded-2xl bg-white text-left align-middle shadow-xl transition-all">



                                    <div className="flex flex-col sm:flex-row h-full">
                                        <div className="flex gap-4 items-center p-3 sm:hidden">
                                            <Avatar link={posts.postDetail.byUser} image={user?.photoURL} className="h-8 w-8 object-cover" />
                                            <span className="text-sm font-semibold">{user?.username}</span>
                                        </div>
                                        <div className="basis-[50%] shrink-0 bg-black sm:rounded-tl-2xl sm:rounded-bl-2xl overflow-hidden">
                                            <div className="group w-full h-full flex justify-center items-center bg-black relative overflow-hidden">
                                                {
                                                    posts.postDetail.mediaType === 'video' ?
                                                        <ReactPlayer
                                                            url={posts.postDetail.imgURL}
                                                            controls
                                                            className='aspect-video width-[100px] sm:absolute top-0 right-0 left-0 bottom-0 sm:w-full sm:h-full'
                                                            width=""
                                                            height=""
                                                            style={{ width: '100%', aspectRatio: '16/9' }}
                                                        />
                                                        :
                                                        <img src={posts.postDetail.imgURL} alt="" className="w-auto h-auto object-cover smmd:h-auto" />
                                                }
                                            </div>
                                        </div>
                                        <div className="grow flex flex-col justify-between">
                                            <div className="gap-4 items-center p-3 hidden sm:flex">
                                                <Avatar link={posts.postDetail.byUser} image={user?.photoURL} className="h-8 w-8 object-cover" />
                                                <span className="text-sm font-semibold">{user?.username}</span>
                                            </div>
                                            <div className="border-t border-t-gray-200 flex gap-2 items-baseline p-3">
                                                <div className="">
                                                    <span className="text-sm font-semibold">{user?.username}</span>
                                                </div>
                                                <span className={`text-xs    text-gray-900 flex flex-wrap items-center sm:text-sm`}>
                                                    {
                                                        (posts.postDetail.caption || '').length > 35 ?
                                                            <>
                                                                {
                                                                    isReadMore ?
                                                                        <p className="transition-all ease duration-10000 h-[max-content] ">{posts.postDetail.caption} <a className="decoration-none cursor-pointer text-red-500 font-semibold transition-all ease duration-500" onClick={() => toggleReadMore()}>read less</a></p>
                                                                        :
                                                                        <p className="transition-all ease duration-10000">{posts.postDetail.caption?.slice(0, 35)}. . . <a className="decoration-none cursor-pointer text-blue-500 font-semibold transition-all ease duration-500" onClick={() => toggleReadMore()}>read more</a></p>
                                                                }
                                                            </>
                                                            :
                                                            posts.postDetail.caption
                                                    }
                                                </span>
                                            </div>
                                            <div className="grow text-sm p-3" >
                                                no comments!
                                            </div>
                                            <div className="p-4 flex justify-between items-center">
                                                <div className="flex gap-4 ">
                                                    {
                                                        icons.map(({ id, icon: Component, onClick }) => {
                                                            return (
                                                                <Component className={`h-7 w-auto cursor-pointer ${(id === "hearticon" && isLiked) ? 'fill-red-600 stroke-0' : ""}`} onClick={onClick} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <BookmarkIcon className="h-7 w-auto" />
                                            </div>
                                            <div className="p-4 text-sm flex gap-x-2">
                                                <p className="">{posts.postDetail.likes}</p>
                                                <a href='' className="no-underline text-black font-semibold " onClick={(e) => handleIsLikeActive(e)}>likes</a>
                                            </div>
                                        </div>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <UserModal
                isLikeActive={isLikeActive}
                isClose={(e) => handleClose()}
                postID={postID}
            />
        </>
    )
}

export default ViewPostModal

