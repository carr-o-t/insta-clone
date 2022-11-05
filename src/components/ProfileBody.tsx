import React, { useState } from 'react'
import {
    ChatIcon,
    HeartIcon
} from '@heroicons/react/solid'
import ViewPostModal from './ViewPostModal'
import { Insta } from '../types'
import { fireStore, store } from '../firebase'
import { getPostsByUserID, getUserByID } from '../functions/services'
import Spinner from './Spinner'

function ProfileBody({ userID }: Insta.ProfileBodyProps) {

    const [postCount, setPostCount] = useState(0)
    const [userDoc, setUserDoc] = useState<fireStore.DocumentData | undefined>();
    const [postList, setPostList] = useState<fireStore.DocumentData | undefined>([])
    const [userRef, setUserRef] = useState<fireStore.DocumentData | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [viewPost, setViewPost] = useState({
        view: false,
        postDetail: {},
        id: ''
    })

    React.useEffect(() => {
        fireStore.onSnapshot(fireStore.query(fireStore.collection(store, 'users'), fireStore.where('uid', "==", userID)), (querySnapShot) => {
            setUserDoc(querySnapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
    }, [])

    React.useEffect(() => {
        setLoading(true)
        const postRef = fireStore.query(fireStore.collection(store, `posts`), fireStore.where('byUser', "==", userID), fireStore.orderBy("timestamp", "desc"))
        fireStore.onSnapshot(postRef, (querySnapShot) => {
           setPostList( querySnapShot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            setPostCount(querySnapShot.size)
        });
        setLoading(false)
        // getPostsByUserID(userID).then((result) => setPostList(result)).finally(() => setLoading(false))
    }, [])


    if (loading) return <Spinner />
    return (
        <>

            <div className="grid px-6 grid-cols-2 smmd:grid-cols-3 gap-6 smmd:gap-6">
                {
                    (postList?.length === 0 && !loading) ? <h1 className="">No Posts!</h1> :
                        postList?.map((post: any, idx: number) => {
                            return (
                                <div
                                    key={idx}
                                    className="group w-full aspect-square flex justify-center items-center bg-black relative overflow-hidden"
                                    onClick={(e) =>
                                        setViewPost({
                                            view: true, id: post.id, postDetail: { ...post }
                                        })
                                    }
                                >
                                    {
                                        post.mediaType === "image" ? <img src={post.imgURL} loading="lazy" alt="" className="w-auto h-auto object-cover smmd:h-auto" />
                                            :
                                            <video src={post.imgURL} className='absolute to-0 right-0 left--0 bottom-0 w-full h-full'></video>
                                    }
                                    <div className="absolute top-0 left-0 w-full h-0 group-hover:cursor-pointer bg-black/50 opacity-0 group-hover:h-full group-hover:opacity-100 transition-all ease-linear duration-300 flex flex-col gap-2 justify-center items-center">
                                        <div className="flex gap-4 items-center text-white ">
                                            <HeartIcon className="h-7 w-7" />
                                            {post.likes}
                                        </div>
                                        <div className="flex gap-4 items-center text-white ">
                                            <ChatIcon className="h-7 w-7" />
                                            0
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
            <ViewPostModal postID={viewPost.id} userID={userID} posts={{ ...viewPost }} viewPost={viewPost.view} onClose={(e) => setViewPost({ ...viewPost, view: false })} />
        </>
    )
}

export default ProfileBody
