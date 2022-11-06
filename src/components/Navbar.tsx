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
import { Menu } from '@headlessui/react'
import { ReactComponent as InstaNavLogo } from '../assets/svgs/insta_logo.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CreatePost from './CreatePost'
import { auth, firebaseAuth, fireStore, store } from '../firebase'
import { useAuth } from '../context/AuthProvider'
import Search from './Search'
import { Insta } from '../types'



function Navbar() {

    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [isCreate, setIsCreate] = useState(false)

    const [userRef, setUserRef] = useState<fireStore.DocumentData | undefined>()
    const { pathname } = useLocation()
    const HomeMenuIcon = pathname === '/' ? HomeFilledIcon : HomeIcon
    const ChatMenuIcon = pathname === '/chat' ? ChatFilledIcon : ChatIcon

    const navIcons = [
        { id: HomeMenuIcon, icon: HomeMenuIcon, onClick: () => { navigate('/') }, },
        { id: ChatMenuIcon, icon: ChatMenuIcon, onClick: () => { navigate('/chat') } },
        { id: 'PlusCircleIcon', icon: PlusCircleIcon, onClick: () => { setIsCreate(true) } },
        { id: 'HeartIcon', icon: HeartIcon, onClick: () => { } },
    ]

    const profilePopoverIcons = [
        { id: 'UserCircleIcon', icon: UserCircleIcon, onClick: () => { } },
        { id: 'BookmarkIcon', icon: BookmarkIcon, onClick: () => { } },
        { id: 'CogIcon', icon: CogIcon, onClick: () => { } },
        { id: 'LogoutIcon', icon: LogoutIcon, onClick: () => { } },
    ]

    const getCurrentUser = React.useCallback(async () => {
        await fireStore.onSnapshot(fireStore.doc(store, `users/${currentUser?.uid}`), (querySnapShot) => {
            setUserRef(querySnapShot.data())
        })
    }, [])

    const handleCreate = () => {
        // e.preventDefault();
        setIsCreate(false);
    }

    React.useEffect(() => {
        getCurrentUser();

    }, [])

    return (
        <>
            <nav className="w-full z-[2] sticky top-0 h-[fit-content] bg-festa-two p-2 ">
                <div className="max-w-5xl flex flex-row justify-between items-center mx-auto gap-4">
                    <Link to="/" className="cursor-pointer sm:basis-[128px]">
                        <div className="">
                            <InstaNavLogo className="h-6 sm:h-8 w-auto text-festa-one" />
                        </div>
                    </Link>
                    <Search />
                    <div className="flex flex-row justify-between gap-4 items-center">
                        {
                            navIcons.map(({ id, icon: Component, onClick }) => {
                                return (
                                    <Component className='h-7 w-7 cursor-pointer text-festa-one hidden sm:block' onClick={(e) => onClick()} />
                                )
                            })
                        }
                        <Menu as="div" className="relative h-7 w-7 cursor-pointer">
                            <Menu.Button className="absolute inset-0 h-7 w-7 rounded-full bg-festa-one cursor-pointer"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <img src={userRef?.photoURL} loading="lazy" className="h-full w-full object-cover rounded-full" alt="" />
                            </Menu.Button>
                            <DropDown onClick={() => setIsCreate(true)} />
                        </Menu>
                    </div>
                </div>
            </nav>

            <CreatePost isCreate={isCreate} onClose={() => handleCreate()} />
        </>
    )
}

function DropDown({onClick}: Insta.DropDownProp) {

    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const handleLogout = () => {
        firebaseAuth.signOut(auth).then(() => navigate('/login'))
    }
    return (
        <Menu.Items className="absolute z-10 py-1 px-3 right-0 top-12 bg-festa-one rounded-md w-52 shadow-custom text-black">
            <Menu.Item>
                {({ active }) => (
                    <a
                        className={`flex flex-row items-center gap-5 p-2 mb-1 rounded-md  font-medium ${active && 'bg-festa-six text-festa-one duration-75 font-semibold scale-105 '}`}
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
                        className={`flex flex-row items-center gap-5 p-2 mb-1 rounded-md  font-medium ${active && 'bg-festa-six text-festa-one duration-75 font-semibold scale-105 '}`}
                        href="/profile/edit"
                    >
                        <CogIcon className='h-5 w-5' />
                        <span className="text-sm">Edit Profile</span>
                    </a>
                )}
            </Menu.Item>
            <Menu.Item>
                {({ active }) => (
                    <button
                        className={`flex sm:hidden flex-row items-center gap-5 p-2 mb-1 rounded-md  font-medium ${active && 'bg-festa-six text-festa-one duration-75 font-semibold scale-105 '}`}
                        onClick={onClick}
                    >
                        <PlusCircleIcon className='h-5 w-5' />
                        <span className="text-sm">Create Post</span>
                    </button>
                )}
            </Menu.Item>
            <Menu.Item>
                {({ active }) => (
                    <a
                        className={`flex sm:hidden flex-row items-center gap-5 p-2 mb-1 rounded-md  font-medium ${active && 'bg-festa-six text-festa-one duration-75 font-semibold scale-105 '}`}
                        href="/chat"
                    >
                        <ChatIcon className='h-5 w-5' />
                        <span className="text-sm">Chat</span>
                    </a>
                )}
            </Menu.Item>
            <Menu.Item>
                {({ active }) => (
                    <a
                        className={`flex flex-row items-center gap-5 p-2 mb-1 rounded-md  font-medium ${active && 'bg-festa-six text-festa-one duration-75 font-semibold scale-105 '}`}
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