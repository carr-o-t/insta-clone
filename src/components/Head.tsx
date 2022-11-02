import React, { Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LinkIcon } from '@heroicons/react/outline'
import { Insta } from '../types'
import { fireStore, store } from '../firebase'
import { useAuth } from '../context/AuthProvider'
import Follow from './buttons/Follow'
import { addUserToFolloweeAndFollower, getUserByID, removeUserFromFolloweeAndFollower } from '../functions/services'
import UserModal from './UserModal'
import Spinner from './Spinner'
import ProfileBody from './ProfileBody'

const Head = ({ userID }: Insta.ProfileHeaderProps) => {
    const { currentUser } = useAuth()

    const [userDoc, setUserDoc] = useState<fireStore.DocumentData | undefined>();
    const [postCount, setPostCount] = useState(0)
    const [isFollower, setIsFollower] = React.useState<boolean>(false)
    const [isFollowee, setIsFollowee] = React.useState<boolean>(false)
    const [isFollow, setIsFollow] = React.useState<boolean | null>(null)
    const [followerData, setFollowerData] = React.useState<fireStore.DocumentData | undefined>()
    const [followeeData, setFolloweeData] = React.useState<fireStore.DocumentData | undefined>()
    const [loading, setLoading] = useState<boolean>(true)

    const handleFollow = () => {
        setIsFollow(typeof isFollow === null ? true : !isFollow)
    }

    const getIsFollowedByUser = async () => {
        const userFolloweeDocSnap = await fireStore.getDoc(fireStore.doc(store, `users/${currentUser?.uid}/followees/${userID}`));
        if (userFolloweeDocSnap.exists()) {
            setIsFollow(true)
        }
    }

    const handleisFollower = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsFollower(true);
    }
    const handleisFollowee = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsFollowee(true);
    }
    function handleCloseFollower() {
        setIsFollower(false)
    }
    function handleCloseFollowee() {
        setIsFollowee(false)
    }

    React.useEffect(() => {
        setLoading(true)
        getUserByID(currentUser?.uid).then((result) => setFollowerData(result)).finally(() => setLoading(false));
        getUserByID(userID).then((result) => setFolloweeData(result));
        getIsFollowedByUser();
    }, [])

    React.useEffect(() => {
        if (isFollow == true) {
            addUserToFolloweeAndFollower(currentUser?.uid, userID, { ...followerData, uid: currentUser?.uid }, { ...followeeData, uid: userID })
        }
        if (isFollow == false) {
            removeUserFromFolloweeAndFollower(currentUser?.uid, userID)
        }
    }, [isFollow])

    useEffect(() => {
        getUserByID(userID).then((res) => { setUserDoc(res) })
    }, [])

    React.useEffect(() => {
        const postRef = fireStore.query(fireStore.collection(store, `posts`), fireStore.where('byUser', "==", userID), fireStore.orderBy("timestamp", "desc"))
        fireStore.onSnapshot(postRef, (querySnapShot) => {
            setPostCount(querySnapShot.size)
        })
    }, [])
    if (loading) return <Spinner />
    return (
        <>
            <div className='mb-4'>
                <div className={`relative `}>
                    <div className={`h-[150px] w-full aspect-video bg-festa-two `}>
                        {userDoc?.banner && <img src={userDoc?.banner} loading="lazy" alt="" className="w-[inherit] h-full object-cover" />}
                    </div>
                    <div className="md:h-40 aspect-square rounded-full h-36 smmd:h-40 absolute bottom-0 left-8 translate-y-1/2 object-cover">
                        <img src={userDoc?.photoURL} alt={`${userDoc?.username}` + ' profile picture'} loading="lazy" className="border-4 border-festa-one w-full h-full object-cover rounded-full img-alt" />
                    </div>
                </div>
                <div className="pt-3 px-8">
                    <div className="flex justify-end w-full h-[58px] smmd:h-20 items-center">
                        {
                            currentUser?.uid === userID ?
                                <>
                                    <Link to="/profile/edit" className="px-3 py-2 border border-festa-eight rounded-md text-xs smms:text-base smmd:font-semibold font-bold order-3 justify-center smmd:order-none smmd:w-[fit-content] text-center">Edit profile</Link>
                                </>
                                :
                                <>
                                    <Follow key={userID} isFollow={isFollow} onClick={(e) => handleFollow()} />
                                </>
                        }
                    </div>
                    <div className="flex flex-col mb-4">
                        <span className="text-2xl font-bold smmd:text-3xl">{userDoc?.displayName}</span>
                        <span className=" font-medium truncate md:max-w-[31ch] w-full max-w-[15ch] ">@{userDoc?.username} </span>
                    </div>
                    {
                        userDoc?.bio && <div className="mb-4">
                            <p className="m-0 p-0 text-sm">🔮  {userDoc?.bio}
                            </p>
                        </div>
                    }
                    {
                        userDoc?.link && <div className="flex gap-2">
                            <LinkIcon className="h-4 w-auto text-black" />
                            <a href={userDoc?.link} className="text-sm text-festa-two font-semibold truncate max-w-[31ch]">{userDoc?.link}</a>
                        </div>
                    }
                    <div className='border-t mt-8 smmd:mt-8 border-t-festa-eight border-b border-b-festa-eight'>
                        <div className="flex gap-4 p-3 items-center justify-around ">
                            <div className="justify-center text-sm flex flex-col items-baseline flex-wrap">
                                <span className="font-medium text-xs  smmd:text-base text-black w-full text-center m-0 p-0 ">{postCount}</span>
                                <span className="font-bold smmd:font-semibold text-xs  smmd:text-base text-black m-0 p-0 ">posts</span>
                            </div>
                            <div className="justify-center text-sm flex flex-col items-baseline flex-wrap  ">
                                <span className="font-medium text-xs  smmd:text-base text-black w-full text-center">{userDoc?.followerCount}</span>
                                <a href="" className="font-bold smmd:font-semibold text-xs  smmd:text-base cursor-pointer" onClick={(e) => handleisFollower(e)}>followers</a>
                            </div>
                            <div className="justify-center text-sm flex flex-col items-baseline flex-wrap ">
                                <span className="font-medium text-xs  smmd:text-base text-black w-full text-center">{userDoc?.followeeCount}</span>
                                <a href="" className="font-bold smmd:font-semibold text-xs  smmd:text-base cursor-pointer" onClick={(e) => handleisFollowee(e)}>following</a>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    isFollower && <UserModal
                        isUserModalActive={isFollower}
                        isClose={(e) => handleCloseFollower()}
                        ID={userID}
                        header="Followers"
                        collectionName="followers"
                    />
                }
                {
                    isFollowee && <UserModal
                        isUserModalActive={isFollowee}
                        isClose={(e) => handleCloseFollowee()}
                        ID={userID}
                        header="Following"
                        collectionName="followees"
                    />
                }
            </div>
            <Suspense fallback={<Spinner />}>
                <ProfileBody userID={userID} />
            </Suspense>
        </>
    )
}

export default Head