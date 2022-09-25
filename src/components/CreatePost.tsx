import React, { Fragment, ReactEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Insta } from '../types';
import { XIcon } from '@heroicons/react/outline'
import { dummyData } from '../data/Data'
import { ReactComponent as UploadPostIcon } from '../assets/svgs/upload_post.svg'
import { useNavigate } from 'react-router-dom';
import { collection, serverTimestamp } from 'firebase/firestore';
import { fireStore, storage, store } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable, UploadTask } from 'firebase/storage'
import { useAuth } from '../context/AuthProvider';


function CreatePost({ isCreate, onClose }: Insta.CreatePostProp) {

    const filepickerRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const closeModal = useRef() as React.MutableRefObject<HTMLButtonElement>;
    const uploadTaskRef = useRef() as React.MutableRefObject<UploadTask>;

    const [postImage, setPostImage] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [wordCount, setWordCount] = useState(0)
    const [caption, setCaption] = useState("")
    const [mediaType, setMediaType] = useState("")
    const [isUploaded, setIsUploaded] = useState(false)
    const [postRefID, setPostRefID] = useState("")
    const [url, setURL] = useState("")
    const [isCancelled, setIsCancelled] = useState(false)


    const { currentUser } = useAuth()


    let navigate = useNavigate()

    useEffect(() => {
        setPostImage(null)
    }, [isCreate])


    const postCollectionRef = collection(store, "posts")


    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            setPostImage(e.target.files[0])
            setMediaType(e.target.files[0].type.split("/")[0])
            console.log(postImage)
        }
    }, [])
    console.log("re-render")

    const onCancelTask = () => {
        if (uploadTaskRef.current.cancel()) {
            setProgress(0);
            setIsUploaded(false)
            console.log("post cancelled")
        }
    }

    const handleUploadPost = async () => {
        const storageRef = ref(storage, `images/${postImage?.name}`);
        if (!postImage) return
        uploadTaskRef.current = uploadBytesResumable(storageRef, postImage);

        uploadTaskRef.current.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                console.log(error);
                alert(error.message)
            },
            () => {
                getDownloadURL(uploadTaskRef.current.snapshot.ref).then((url) => {
                    setURL(url)
                    let id = ""
                    fireStore.addDoc(postCollectionRef, {
                        caption,
                        imgURL: url,
                        mediaType: mediaType,
                        likes: 0,
                        byUser: currentUser?.uid,
                        timestamp: serverTimestamp()
                    }).then(function (docRef) {
                        fireStore.setDoc(fireStore.doc(store, `users/${currentUser?.uid}/posts/${docRef.id}`), {
                            caption,
                            imgURL: url,
                            mediaType: mediaType,
                            likes: 0,
                            byUser: currentUser?.uid,
                            timestamp: serverTimestamp()
                        })
                    })
                    console.log(postRefID)
                    setProgress(0)
                    closeModal.current.click();
                    alert("Post uploaded!")
                    navigate('/')
                    console.log(url);
                })
                    .catch(() => {
                        setIsUploaded(false)
                        alert("oops! Your post couldn't be uploaded. Please try again.")
                    })
                setIsUploaded(false)
            }
        )
    }

    const handleTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWordCount(e.target.value.length)
        setCaption(e.target.value)
    }, [])

    if (!isCreate) return <></>
    return (
        <Transition appear show={isCreate} as={Fragment}>
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
                </Transition.Child>CreatePost

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


                            <Dialog.Panel className="w-full h-full max-w-[70%] sm:aspect-video transform  rounded-2xl bg-white text-left align-middle shadow-xl transition-all">



                                <div className="flex flex-col h-full bg-white rounded-2xl">
                                    {
                                        (progress !== 0) && <div className="w-full bg-gray-200 rounded-full">
                                            <div className="bg-blue-600 text-xs font-medium h-2 text-blue-100 text-center p-0.1 leading-none rounded-full transition-all ease" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    }
                                    <div className="flex justify-between p-4 items-center">
                                        {
                                            (progress === 0 || progress === 100) ? <button className="font-semibold text-blue-500 cursor-pointer text-xs xsm:text-sm" ref={closeModal} onClick={onClose}>discard</button>
                                                :
                                                <button className="font-semibold text-blue-500 cursor-pointer text-xs xsm:text-sm" onClick={onCancelTask}>cancel</button>
                                        }
                                        <div className="font-semibold text-xs xsm:text-sm">Create new post</div>
                                        <button className={`font-semibold text-blue-500 text-xs xsm:text-sm cursor-pointer ${progress > 0 ? 'cursor-not-allowed' : ''}`}
                                            disabled={progress > 0}
                                            onClick={() => {
                                                setIsUploaded(true)
                                                handleUploadPost();
                                            }}
                                        >share</button>
                                    </div>
                                    <div className="flex grow flex-col sm:flex-row overflow-hidden transition-all duration-1000 ease">
                                        <div className="basis-[50%] shrink-0 min-h-[200px] bg-black sm:rounded-bl-2xl overflow-hidden">
                                            <div onClick={() => filepickerRef.current.click()} className="group min-h-[200px] w-full sm:h-full flex justify-center items-center bg-black relative overflow-hidden">
                                                {!postImage ?
                                                    <div className="flex flex-col justify-center items-center w-auto h-auto smmd:h-auto">
                                                        <UploadPostIcon className="h-14 w-14" />
                                                        <p className="text-white/20">Upload photos and videos here</p>
                                                    </div>
                                                    :
                                                    mediaType === 'image' ?
                                                        <img onClick={() => filepickerRef.current.click()} src={URL.createObjectURL(postImage)} alt="" className='w-auto h-auto smmd:h-auto ' />
                                                        :
                                                        <video src={URL.createObjectURL(postImage)} className='w-auto h-auto smmd:h-auto' ></video>
                                                }
                                            </div>
                                            <input
                                                onChange={(e) => {
                                                    handleImageChange(e)
                                                }}
                                                ref={filepickerRef}
                                                type="file"
                                                // accept='image/*,video/*'
                                                hidden
                                                disabled={progress > 0}
                                            />
                                        </div>
                                        <div className="grow relative">
                                            <div className="flex flex-col justify-between  h-full">
                                                <textarea className="resize-none outline-none p-3 border-none h-full w-full" name="" id="" placeholder='Write caption here...' maxLength={20}
                                                    onChange={(e) => {
                                                        handleTextAreaChange(e)
                                                    }}
                                                    disabled={progress > 0}
                                                ></textarea>
                                                <div className="p-3 text-end">
                                                    <p className="text-sm text-gray-400">{wordCount}/20</p>
                                                </div>
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
    )
}

export default CreatePost
