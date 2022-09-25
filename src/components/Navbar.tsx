import React, { useState } from 'react'
import {
    HomeIcon,
    ChatIcon,
    HeartIcon,
    UserCircleIcon,
    BookmarkIcon,
    CogIcon,
    LogoutIcon,
    PlusCircleIcon
} from '@heroicons/react/outline'
import { HomeIcon as HomeFilledIcon, ChatIcon as ChatFilledIcon } from '@heroicons/react/solid'
import { Menu, Popover } from '@headlessui/react'
import { ReactComponent as InstaNavLogo } from '../assets/svgs/insta_logo.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Insta } from '../types'
import CreatePost from './CreatePost'
import { auth, firebaseAuth, fireStore, store } from '../firebase'
import { useAuth } from '../context/AuthProvider'

function Navbar() {

    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [isCreate, setIsCreate] = useState(false)
    const [userRef, setUserRef] =  useState<fireStore.DocumentData | undefined>()
    const { pathname } = useLocation()
    const HomeMenuIcon = pathname === '/' ? HomeFilledIcon : HomeIcon
    const ChatMenuIcon = pathname === '/chat' ? ChatFilledIcon : ChatIcon

    const navIcons = [
        { id: HomeMenuIcon, icon: HomeMenuIcon, onClick: () => { navigate('/')},},
        { id: ChatMenuIcon, icon: ChatMenuIcon, onClick: () => { } },
        { id: 'PlusCircleIcon', icon: PlusCircleIcon, onClick: () => { setIsCreate(true)} },
        { id: 'HeartIcon', icon: HeartIcon, onClick: () => { } },
    ]

    const profilePopoverIcons = [
        { id: 'UserCircleIcon', icon: UserCircleIcon, onClick: () => { } },
        { id: 'BookmarkIcon', icon: BookmarkIcon, onClick: () => { } },
        { id: 'CogIcon', icon: CogIcon, onClick: () => { } },
        { id: 'LogoutIcon', icon: LogoutIcon, onClick: () => { } },
    ]

    const getCurrentUser = React.useCallback(async () => {
        await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}`)).then((querySnapShot) => {
            if (querySnapShot.exists())
                setUserRef(querySnapShot.data())
        })
    }, [])

    React.useEffect(() => {
        getCurrentUser();
        
    }, [])

    return (
        <>
            <nav className="w-full sticky top-0 h-16 bg-white text-black p-4 border-b border-gray-400">
                <div className="max-w-5xl flex flex-row justify-between items-center mx-auto">
                    <Link to="/" className="cursor-pointer">
                        <div className="">
                            <InstaNavLogo className="h-8  w-auto" />
                        </div></Link>
                    <div className="w-64 min-w-[125px] sm:block hidden">
                        <input type="text" placeholder='Search' className=" w-full " />
                    </div>
                    <div className="flex flex-row justify-between gap-4 items-center">
                        {
                            navIcons.map(({ id, icon: Component, onClick}) => {
                                return (
                                    // <Link to={to}>
                                    <Component className='h-7 w-7 cursor-pointer ' onClick={(e) => onClick()} />
                                    // </Link>
                                )
                            })
                        }
                        <Menu as="div" className="relative h-7 w-7 cursor-pointer">
                            <Menu.Button className="absolute inset-0 h-7 w-7 rounded-full bg-gray-200 cursor-pointer"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <img src={userRef?.photoURL} className="h-full w-full object-cover rounded-full" alt="" />
                            </Menu.Button>
                            <DropDown />
                        </Menu>
                    </div>
                </div>
            </nav>

            <CreatePost isCreate={isCreate} onClose={(e) => {setIsCreate(false)}} />
        </>
    )
}



function DropDown() {

    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const closePopUp = React.useRef() as React.MutableRefObject<HTMLAnchorElement>;
    const handleLogout = () => {
        firebaseAuth.signOut(auth).then(() => navigate('/login'))      
    }
    // if(!isOpen) return <></>
    return (
        <Menu.Items className="absolute z-10 py-1 px-3 right-0 top-12 bg-white rounded-md w-52 shadow-custom">
            <Menu.Item>
                {({ active }) => (
                    <a
                        className={`flex flex-row items-center gap-5 p-2 mb-1 rounded-md transition-all ease ${active && 'bg-blue-200 text-black font-semibold scale-105 transition-all ease'}`}
                        href={`/profile/${currentUser?.uid}`}
                    >
                        <UserCircleIcon className='h-5 w-5' />
                        <span className="text-sm">Profile</span>
                    </a>
                )}
            </Menu.Item>
            <Menu.Item>
                {({ active }) => (
                    <a
                        className={`flex flex-row items-center gap-5 p-2 mb-1 rounded-md transition-all ease ${active && 'bg-blue-200 text-black font-semibold scale-105 transition-all ease'}`}
                        href="/saved"
                    >
                        <BookmarkIcon className='h-5 w-5' />
                        <span className="text-sm">Saved</span>
                    </a>
                )}
            </Menu.Item>
            <Menu.Item>
                {({ active }) => (
                    <a
                        className={`flex flex-row items-center gap-5 p-2 mb-1 rounded-md transition-all ease ${active && 'bg-blue-200 text-black font-semibold scale-105 transition-all ease'}`}
                        href="/settings"
                    >
                        <CogIcon className='h-5 w-5' />
                        <span className="text-sm">Settings</span>
                    </a>
                )}
            </Menu.Item>
            <Menu.Item>
                {({ active }) => (
                    <a
                        className={`flex flex-row items-center gap-5 p-2 mb-1 rounded-md transition-all ease ${active && 'bg-blue-200 text-black font-semibold scale-105 transition-all ease'}`}
                        href="/login"
                        onClick={(e) => handleLogout()}
                    >
                        <LogoutIcon className='h-5 w-5' />
                        <span className="text-sm">Log out</span>
                    </a>
                )}
            </Menu.Item>

            <img src="/solutions.jpg" alt="" />
        </Menu.Items>
    )
}



export default Navbar