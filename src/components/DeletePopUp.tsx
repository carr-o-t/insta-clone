import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { deletePostByPostID } from "../functions/services";
import { Insta } from "../types";

export default function DeletePopUp({ isDelete, isClose, postID, handleModalRef }: Insta.deleteProp) {

    const closeModal = useRef() as React.MutableRefObject<HTMLButtonElement>;

    const handleDelete = () => {
        deletePostByPostID(postID).then(() => toast.success("Post deleted!")).catch(() => toast.error("couldn't delete the post. Please try again!"));
        handleModalRef?.current.click();
        closeModal.current.click();
        return true
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-festa-one p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h5"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Are you sure you want to delete this post?
                                    </Dialog.Title>

                                    <div className="mt-4 flex justify-between">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-festa-three px-4 py-2 text-sm font-medium text-festa-two hover:bg-festa-six hover:text-festa-one transition-allduration-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
            <ToastContainer />
        </>
    )
}