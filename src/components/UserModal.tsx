import { Dialog, Transition } from '@headlessui/react'
import React, { useState, Fragment } from 'react'
import { fireStore, store } from '../firebase'
import { Insta } from '../types'
import { XIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'

function UserModal({ isLikeActive, isClose, postID }: Insta.UserModalProp) {

    const [usersList, setUsersList] = useState<fireStore.DocumentData | undefined>([])
    const closeModal = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

    const handleRef = () => {
        console.log("clicked outside")
        closeModal.current.click();
    }

    const getLikedUsers = async () => {
        const collRef = fireStore.collection(store, `posts/${postID}/likedBy`);
        await fireStore.onSnapshot(collRef, (querySnapshot) => {
            setUsersList(querySnapshot.docs.map(doc => ({ ...doc.data() })))
        })
    }
    React.useEffect(() => {
        console.log(postID)
        getLikedUsers();
    }, [isLikeActive])

    if (!isLikeActive) return <></>
    return (
        <>
            <Transition appear show={isLikeActive} as={Fragment}>
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
                                <Dialog.Panel as="div" className="w-full max-w-md  overflow-scroll transform rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="div"
                                        className="relative border-b border-b-gray-400"
                                    >
                                        <h4 className="text-md font-medium leading-6 text-gray-900 text-center tracking-wider mb-2">Likes</h4>
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 h-7 w-7 p-2 rounded-md border border-transparent bg-blue-100 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={isClose}
                                            ref={closeModal}
                                        >
                                            <XIcon type="button" className="absolute h-auto w-auto top-0 right-0 cursor-pointer" />
                                        </button>
                                    </Dialog.Title>
                                    <div className="mt-2 max-h-56 overflow-scroll">
                                        {
                                            usersList?.map((user: any) => {
                                                return (
                                                    <div className="flex  flex-col gap-y-4">
                                                        <Link to={`/profile/${user.uid}`} className="flex gap-3 items-center cursor-pointer hover:bg-blue-200 p-2 rounded-md">
                                                            <div className="h-10 w-10 rounded-full">
                                                                <img src={user.photoURL} alt="" className="h-10 w-10 object-cover rounded-full" />
                                                            </div>
                                                            <span className="text-sm font-semibold">{user.username}</span>
                                                        </Link>
                                                    </div>
                                                )
                                            })
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