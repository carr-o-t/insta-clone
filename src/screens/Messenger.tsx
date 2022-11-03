import React from 'react'
import { useAuth } from '../context/AuthProvider'
import { fireStore } from '../firebase'
import { getUserByID } from '../functions/services'
import Avatar from '../components/Avatar'
import { Link } from 'react-router-dom'
import demoUser from '../assets/demouser.jpg'

function Messenger() {

    const {currentUser} = useAuth()
    const [activeUser, setActiveUser] = React.useState<fireStore.DocumentData | undefined>()

    const users = [
        {
            id: 1,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 2,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 3,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 4,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 5,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 6,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 7,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
        {
            id: 8,
            image: demoUser,
            username: 'Loremipsum'
        },
       
    ]

    React.useEffect(() => {
        getUserByID(currentUser?.uid)
        .then((result) => setActiveUser(result))
    }, [])
    return (
        <div className="w-full h-[calc(100vh_-_49px)] max-w-5xl mx-auto p-2 flex">
            <div className="border border-gray-300 rounded-lg flex w-full">
                <div className="basis-[35%] shrink-0 ">
                    <div className="flex flex-col border-r border-r-gray-300">
                        <Link to={`/profile/${activeUser?.uid}`} className="sticky top-0 left-0 bg-white border-b border-b-gray-300" >
                            <div className="p-3 flex gap-3 items-center">
                                <div className="h-10 w-10 rounded-full">
                                    <img src={activeUser?.photoURL} alt="" className="h-full w-full rounded-full" />
                                </div>
                                <span className="font-semibold">{activeUser?.username}</span>
                            </div>
                        </Link>
                        <div className="h-[calc(100vh_-_48px_-_54px)] overflow-scroll flex flex-col gap-4 p-2">
                                {
                                    users.map((user) => {
                                        return (
                                            <div className="px-2 py-4 flex gap-3 items-center cursor-pointer hover:bg-blue-200 rounded-md">
                                                <div className="h-10 w-10 rounded-full">
                                                    <img src={user.image} alt="" className="h-full w-full rounded-full" />
                                                </div>
                                                <span className="">{ user.username }</span>
                                            </div>
                                        )
                                    })
                                }
                        </div>
                    </div>
                </div>
                <div className="grow">
                    <div className="flex flex-col">
                        <Link to={`/profile/${activeUser?.uid}`} className="sticky top-0 left-0 bg-white border-b border-b-gray-300" >
                            <div className="p-3 flex gap-3 items-center">
                                <div className="h-10 w-10 rounded-full">
                                    <img src={activeUser?.photoURL} alt="" className="h-full w-full rounded-full" />
                                </div>
                                <span className="font-semibold">{activeUser?.username}</span>
                            </div>
                        </Link>
                        <div className="h-[calc(100vh_-_48px_-_54px)] overflow-scroll flex flex-col gap-4 p-2">
                            chat area
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messenger