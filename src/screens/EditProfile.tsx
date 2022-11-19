import React, { Fragment, useCallback, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../components/Crop/CropIMage';
import { useAuth } from '../context/AuthProvider';
import { fireStore, storage, store } from '../firebase';
import { Insta } from '../types';
import { v4 as uuid } from 'uuid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function EditProfile() {

    const { currentUser } = useAuth()
    const [userDocRef, setUserDocRef] = useState<fireStore.DocumentData | undefined>()
    const [img, setImg] = useState<any>(null)
    const [banner, setBanner] = useState<any>(null)
    const [bannerImg, setBannerImg] = useState<any>(null)
    const [isCrop, setIsCrop] = useState<boolean>(false)
    const [preview, setPreview] = useState("")
    const [bannerPreview, setBannerPreview] = useState("")
    const [wordCount, setWordCount] = useState(0)

    const [userUpdateData, setUserUpdateData] = useState({
        name: "",
        username: "",
        bio: "",
        link: ""
    })

    const onImageChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            setImg(e.target.files[0])
        }
    }, [])

    const handleCrop = (croppedImage: string) => {
        setBannerPreview(croppedImage)
    }

    const onBannerChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            setBannerImg(e.target.files[0])
            setBanner(URL.createObjectURL(e.target.files[0]));
            setIsCrop(true)
        }
    }, [])

    React.useEffect(() => {
    }, [banner, bannerPreview])

    const uploadBanner = async () => {
        const storageRef = ref(storage, `images/${userUpdateData.username + bannerImg?.name}`);
        if (!bannerImg) {
            fireStore.updateDoc(fireStore.doc(store, `users/${currentUser?.uid}`), {
                banner: bannerPreview,
                photoURL: preview,
                displayName: userUpdateData.name,
                uid: currentUser?.uid,
                bio: userUpdateData.bio,
                link: userUpdateData.link
            }).then(() => {
                toast.success(
                    'Profile Updated !'
                );
            }).catch((err) => {
                toast.error('Operation Failed! Please try again.')
            })
            return
        }

        const uploadImg = uploadBytesResumable(storageRef, bannerImg);
        uploadImg.on(
            "state_changed",
            () => {
                getDownloadURL(uploadImg.snapshot.ref).then((url) => {
                    fireStore.updateDoc(fireStore.doc(store, `users/${currentUser?.uid}`), {
                        banner: url,
                        displayName: userUpdateData.name,
                        username: userUpdateData.username,
                        uid: currentUser?.uid,
                        bio: userUpdateData.bio,
                        link: userUpdateData.link
                    })
                })
                    .then(() => {
                        toast.success(
                            'Profile Updated !'
                        );
                    })
                    .catch((err) => {
                        toast.error('Operation Failed! Please try again.')
                    })
            }
        )
    }
    const handleEditSave = async () => {

        const storageRef = ref(storage, `images/${userDocRef?.uid + uuid() + img?.name}`);

        if (!img) {
            if (banner) {
                uploadBanner();
                return
            }
            fireStore.updateDoc(fireStore.doc(store, `users/${currentUser?.uid}`), {
                photoURL: preview,
                displayName: userUpdateData.name,
                username: userUpdateData.username,
                uid: currentUser?.uid,
                bio: userUpdateData.bio,
                link: userUpdateData.link
            }).then(() => {
                toast.success(
                    'Profile Updated !'
                );
            })
                .catch((err) => {
                    toast.error('Operation Failed! Please try again.')
            })
            return
        }
        if (banner) {
            uploadBanner();
        }
        const uploadImg = uploadBytesResumable(storageRef, img);
        uploadImg.on(
            "state_changed",
            () => {
                getDownloadURL(uploadImg.snapshot.ref).then((url) => {
                    fireStore.updateDoc(fireStore.doc(store, `users/${currentUser?.uid}`), {
                        photoURL: url,
                        // banner
                        displayName: userUpdateData.name,
                        username: userUpdateData.username,
                        uid: currentUser?.uid,
                        bio: userUpdateData.bio,
                        link: userUpdateData.link
                    })
                })
                    .then(() => {
                        toast.success('Profile Updated !');
                    })
                    .catch((err) => {
                        toast.error('Operation Failed! Please try again.')
                    })
            }
        )
    }

    const fileInput = useRef() as React.MutableRefObject<HTMLInputElement>;
    const selectFile = () => {
        fileInput.current.click();
    }
    const bannerInput = useRef() as React.MutableRefObject<HTMLInputElement>;
    const selectBannerFile = () => {
        bannerInput.current.click();
    }

    const getUserByID = async () => {
        const userDocSnap = await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`))
        setUserDocRef(userDocSnap?.data())
    }

    const getUser = React.useCallback(async () => {
        await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`)).then((querySnapShot) => {
            if (querySnapShot.exists())
                setUserDocRef(querySnapShot.data())
            setUserUpdateData({
                name: querySnapShot.data()?.displayName,
                username: querySnapShot.data()?.username,
                bio: querySnapShot.data()?.bio,
                link: querySnapShot.data()?.link
            })
        })
    }, [])

    const getUserAvatarByUserID = async () => {
        const docSnap = await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`));
        if (docSnap.exists()) {
            setPreview(docSnap?.data()?.photoURL)
            setBannerPreview(docSnap?.data()?.banner)
        }
    }

    React.useEffect(() => {
        getUserAvatarByUserID()
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
        } catch (err) { console.log(err) }
    }, [img])

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWordCount(e.target.value.length)
        setUserUpdateData({ ...userUpdateData, bio: e.target.value })
    }

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState<any>(null)
    const [zoom, setZoom] = useState(1)

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const { file, url } = await getCroppedImg(
                banner,
                croppedAreaPixels,
            )
            setCroppedImage(url)
            setBannerPreview(url)
            setBannerImg(file)
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels])

    const onClose = useCallback(() => {
        setCroppedImage(null)
    }, [])

    const closeCrop = React.useRef() as React.MutableRefObject<HTMLButtonElement>;
    const isClose = () => setIsCrop(false);
    const handleShowCroppedImage = () => {
        showCroppedImage()
        setCroppedImage("")
        closeCrop.current.click();
    }
    const style = { cropAreaStyle: { position: "absolute", top: "0", border: "1px solid black", width: "100%", height: "100%" } }
    return (
        <div className="w-full h-full max-w-4xl m-0 sm:m-auto p-0 mb-4 sm:p-8">
            <div className="border-0 sm:border sm:border-festa-eight rounded-lg sm:p-8 p-0" >
                <div className="w-full  mx-auto flex flex-col gap-4 sm:gap-8">
                    <div className="">
                        <div className={`relative `}>
                            <div className={`h-[150px] w-full aspect-video bg-festa-eight sm:rounded-lg overflow-hidden`}>
                                <img onClick={selectBannerFile} src={bannerPreview} alt="" className="w-full h-full object-cover cursor-pointer" />
                                <input ref={bannerInput} type="file" className="hidden" onChange={(e) => onBannerChange(e)} name="avatar" accept="image/*" id="" />
                            </div>
                            <div className="sm:h-40 aspect-square rounded-full h-36 sm:h-40 absolute bottom-0 left-8 translate-y-1/2 cursor-pointer">
                                <img onClick={() => fileInput.current.click()} src={preview} alt="" className="border-4 border-festa-one w-full h-full object-cover rounded-full" />
                            </div>
                        </div>
                        <div className="flex justify-end w-full h-[85px] xssm:h-[58px] sm:h-20 items-center">
                            <div className="flex px-8 gap-8 items-center">
                                <input ref={fileInput} type="file" className="hidden" onChange={(e) => onImageChange(e)} name="avatar" accept="image/*" id="" />
                                <div className="">
                                    {/* <h3 className="text-lg font-medium">{userDocRef?.username}</h3> */}
                                    <button onClick={selectFile} className="text-festa-two border border-festa-eight px-3 py-2 rounded-lg font-semibold text-sm sm:text-sm">Change profile pic</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="px-8 font-bold text-lg truncate w-full">@{userDocRef?.username} </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 p-4 sm:p-0">
                        <EditInput value={userUpdateData.name} onChange={(e) => setUserUpdateData({ ...userUpdateData, name: e.target.value })} type="text" placeholder="Name" label="Name" />
                        <EditInput value={userUpdateData.username} onChange={(e) => setUserUpdateData({ ...userUpdateData, username: e.target.value })} type="text" placeholder="username" label="Username" />
                        <EditInput value={userUpdateData.link} onChange={(e) => setUserUpdateData({ ...userUpdateData, link: e.target.value })} type="text" placeholder="attach any link if present" label="Link" />
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-16">
                            <label htmlFor="" className="w-28 font-semibold">Bio</label>

                            <div className="flex flex-col grow justify-between h-full border bg-white border-festa-eight rounded-lg p-2">
                                <textarea className="resize-none outline-none bg-transparent text-sm h-full w-full" name="" id="" placeholder='Write bio here...' maxLength={20} value={userUpdateData.bio}
                                    onChange={(e) => {
                                        handleTextAreaChange(e)
                                    }}
                                ></textarea>
                                <div className="text-end">
                                    <p className="text-sm text-festa-eight">{wordCount}/20</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="bg-festa-two px-4 py-2 text-festa-one font-semibold hover:bg-festa-two/80 rounded-lg w-[fit-content] mx-auto" onClick={(e) => handleEditSave()}>
                        <p className="flex justify-center items-center">Update Profile</p>
                    </button>
                </div>
            </div>

            <Transition appear show={isCrop} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => console.log('close')} >
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
                                <Dialog.Panel as="div" className="max-w-md w-full  overflow-scroll transform rounded-2xl bg-festa-one p-4 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="div"
                                        className="relative border-b border-festa-five"
                                    >
                                        <h4 className="text-md font-medium leading-6 text-gray-900 text-center tracking-wider mb-2">Crop Image</h4>
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 h-7 w-7 p-2 rounded-full border border-transparent bg-festa-three text-sm font-medium text-festa-two hover:bg-festa-six hover:text-festa-one focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={isClose}
                                            ref={closeCrop}
                                        >
                                            <XIcon type="button" className="absolute h-auto w-auto top-0 right-0 cursor-pointer" />
                                        </button>
                                    </Dialog.Title>
                                    <div className="mt-2 ">
                                        <div>
                                            <div className="relative mb-4 w-full h-[150px] bg-black">
                                                <Cropper
                                                    image={banner}
                                                    crop={crop}
                                                    aspect={16 / 9}
                                                    onCropChange={setCrop}
                                                    onCropComplete={onCropComplete}
                                                    onZoomChange={setZoom}
                                                    zoom={zoom}
                                                />
                                            </div>
                                            <div className="flex justify-center items-center">

                                                <button
                                                    onClick={handleShowCroppedImage}
                                                    className="bg-festa-two p-3 text-center"
                                                >
                                                    done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <ToastContainer />
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
        <div className="flex flex-col sm:items-center gap-4 sm:flex-row sm:gap-16">
            <label htmlFor="" className="font-semibold shrink-1 w-28">{label}</label>
            <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="grow border border-gray-300 rounded-lg p-2 text-sm" />
        </div>
    )

}

function CropImage({
    isCrop,
    isClose,
    header,
    src
}: Insta.CropImageProp) {

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState<any>(null)

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                src,
                croppedAreaPixels,
            )
            setCroppedImage(croppedImage.url)
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels])

    const onClose = useCallback(() => {
        setCroppedImage(null)
    }, [])

    return (
        <>
            <Transition appear show={isCrop} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => console.log('close')} >
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
                                <Dialog.Panel as="div" className="w-full max-w-4xl  overflow-scroll transform rounded-2xl bg-festa-one p-4 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="div"
                                        className="relative border-b border-festa-five"
                                    >
                                        <h4 className="text-md font-medium leading-6 text-gray-900 text-center tracking-wider mb-2">{header}</h4>
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 h-7 w-7 p-2 rounded-full border border-transparent bg-festa-three text-sm font-medium text-festa-two hover:bg-festa-six hover:text-festa-one focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={isClose}
                                        // ref={closeModal}
                                        >
                                            <XIcon type="button" className="absolute h-auto w-auto top-0 right-0 cursor-pointer" />
                                        </button>
                                    </Dialog.Title>
                                    <div className="mt-2 ">
                                        <div>
                                            <div className="relative w-full h-[200px] bg-yellow-500 ">
                                                <Cropper
                                                    image={src}
                                                    crop={crop}
                                                    aspect={16 / 9}
                                                    onCropChange={setCrop}
                                                    onCropComplete={onCropComplete}
                                                />
                                            </div>
                                            <div className="">

                                                <button
                                                    onClick={showCroppedImage}
                                                    className="bg-festa-two p-4"
                                                >
                                                    Show Result
                                                </button>
                                            </div>
                                            <img src={croppedImage} alt="" className="h-[100px] w-full bg-rose-400" />
                                        </div>
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



export default EditProfile