import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { Insta } from '../types'
import Avatar from './Avatar'
import { XIcon, HeartIcon, ChatAlt2Icon, ShareIcon, BookmarkIcon } from '@heroicons/react/outline'
import ReactPlayer from 'react-player'
import { fireStore, store } from '../firebase'
import { useAuth } from '../context/AuthProvider'
import { addUserToLiked, removeUserFromLiked } from '../functions/services'
import UserModal from './UserModal'
import DeletePopUp from './DeletePopUp'

function ViewPostModal({ postID, userID, posts, viewPost, onClose }: Insta.ViewPostProps) {

    const { currentUser } = useAuth()
    const [isLiked, setIsLiked] = useState<boolean | null>(null)
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [user, setUser] = useState<fireStore.DocumentData | undefined>()
    const [isReadMore, setIsReadMore] = useState<boolean>(false)
    const [isUserModalActive, setIsUserModalActive] = useState<boolean>(false)
    const [likeCount, setLikeCount] = useState(0)
    const closeModal = React.useRef() as React.MutableRefObject<HTMLButtonElement>;
    const icons = React.useMemo(() => {
        return [
            { id: 'hearticon', icon: HeartIcon, onClick: () => { setIsLiked(typeof isLiked === null ? true : !isLiked) } },
            { id: 'chatalt2icon', icon: ChatAlt2Icon, onClick: () => { } },
            { id: 'shareicon', icon: ShareIcon, onClick: () => { } },
        ]
    }, [isLiked])

    const handleRef = () => {
        closeModal.current.click();
    }
    const getUserByID = async () => {
        const collRef = fireStore.doc(store, `users/${userID}`);
        await fireStore.onSnapshot(collRef, (querySnapshot) => {
            setUser(querySnapshot.data())
        })
    }
    const getIsLikedByUser = async () => {
        const postLikedDocSnap = await fireStore.getDoc(fireStore.doc(store, `posts/${postID}/likedBy/${currentUser?.uid}`));
        if (postLikedDocSnap.exists()) {
            setIsLiked(true)
        }
    }

    React.useEffect(() => {
        getUserByID();
        getIsLikedByUser();
    }, [viewPost])

    React.useEffect(() => {
        if (viewPost) {
            const postRef = fireStore.collection(store, `posts/${posts.id}/likedBy`)
            fireStore.onSnapshot(postRef, (querySnapShot) => {
                setLikeCount(querySnapShot.size)
            })
        }
    }, [viewPost])

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

    const handleisUserModalActive = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsUserModalActive(true);
    }

    function handleClose() {
        setIsUserModalActive(false)
    }

    return (
        <>
            <Transition appear show={viewPost} as={Fragment}>
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
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <button ref={closeModal} className="absolute right-5 top-5 cursor-pointer p-1 bg-festa-three text-festa-two hover:bg-festa-six hover:text-festa-one rounded-full" onClick={onClose}>
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


                                <Dialog.Panel className="w-[calc(100vw_-_2rem)] sm:w-full h-full max-w-[80%] aspect-[1/1.6] sm:aspect-video transform  rounded-2xl bg-festa-one text-left align-middle shadow-xl transition-all">



                                    <div className="flex flex-col sm:flex-row h-full">
                                        <div className="flex justify-between items-center p-3 sm:hidden">
                                            <div className="flex gap-4 items-center ">
                                                <Avatar link={posts.postDetail.byUser} image={user?.photoURL} className="h-8 w-8 object-cover" />
                                                <span className="text-sm font-semibold">{user?.username}</span>
                                            </div>
                                            {
                                                currentUser?.uid === user?.uid &&
                                                <button onClick={(e) => setIsDelete(true)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                                    </svg>

                                                </button>
                                            }
                                        </div>
                                        <div className="sm:basis-[50%] basis-[64%] shrink-0 bg-black sm:rounded-tl-2xl sm:rounded-bl-2xl overflow-hidden">
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
                                                        <img src={posts.postDetail.imgURL} loading="lazy" alt="" className="w-full smmd:w-auto h-auto object-cover smmd:h-auto" />
                                                }
                                            </div>
                                        </div>
                                        <div className="grow flex flex-col justify-between p-3">
                                            <div className="hidden sm:flex justify-between px-3 sm:p-3 items-center">
                                                <div className="gap-4 items-center  hidden sm:flex">
                                                    <Avatar link={posts.postDetail.byUser} image={user?.photoURL} className="h-8 w-8 object-cover" />
                                                    <span className="text-sm font-semibold">{user?.username}</span>
                                                </div>
                                                {
                                                    currentUser?.uid === user?.uid &&
                                                    <button onClick={(e) => setIsDelete(true)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                                        </svg>

                                                    </button>
                                                }
                                            </div>
                                            <div className="border-0 sm:border-t sm:border-t-festa-eight flex gap-2 items-baseline px-0 py-1 sm:p-3">
                                                <div className="">
                                                    <span className="text-sm font-semibold">{user?.username}</span>
                                                </div>
                                                <span className={`text-xs text-gray-900 flex flex-wrap items-center sm:text-sm`}>
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
                                            <div className="hidden sm:block grow text-sm p-3" >
                                                no comments!
                                            </div>
                                            <div className="hidden sm:block">
                                                <div className="p-4 flex justify-between items-center">
                                                    <div className="flex gap-4 ">
                                                        {
                                                            icons.map(({ id, icon: Component, onClick }) => {
                                                                return (
                                                                    <Component className={`h-7 w-auto cursor-pointer ${(id === "hearticon" && isLiked) ? 'fill-festa-two stroke-0' : ""}`} onClick={onClick} />
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <BookmarkIcon className="h-7 w-auto" />
                                                </div>
                                                <div className="p-4 text-sm flex gap-x-2">
                                                    <p className="">{likeCount}</p>
                                                    <a href='' className="no-underline text-black font-semibold " onClick={(e) => handleisUserModalActive(e)}>likes</a>
                                                </div>
                                            </div>
                                            <div className="block sm:hidden">
                                                <div className="px-0 py-1 flex justify-between items-center">
                                                    <div className="flex gap-4 ">
                                                        {
                                                            icons.map(({ id, icon: Component, onClick }) => {
                                                                return (
                                                                    <Component className={`h-6 w-auto cursor-pointer ${(id === "hearticon" && isLiked) ? 'fill-festa-two stroke-0' : ""}`} onClick={onClick} />
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <BookmarkIcon className="h-7 w-auto" />
                                                </div>
                                                <div className="px-0 text-sm flex gap-x-2">
                                                    <p className="">{likeCount}</p>
                                                    <a href='' className="no-underline text-black font-semibold " onClick={(e) => handleisUserModalActive(e)}>likes</a>
                                                </div>
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
                isUserModalActive={isUserModalActive}
                isClose={(e) => handleClose()}
                ID={postID}
                header="Likes"
                collectionName="posts"
            />
            <DeletePopUp
                isDelete={isDelete}
                isClose={(e) => setIsDelete(false)}
                postID={postID}
                handleModalRef={closeModal}
            />
        </>
    )
}

export default ViewPostModal

