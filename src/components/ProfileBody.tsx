import React, { useState } from 'react'
import {
    ChatIcon,
    HeartIcon
} from '@heroicons/react/solid'
import ViewPostModal from './ViewPostModal'
import { Insta } from '../types'
import { fireStore, store } from '../firebase'
import { getUserByID } from '../functions/services'

function ProfileBody({ userID }: Insta.ProfileBodyProps) {

    const [postCount, setPostCount] = useState(0)
    const [likeCount, setLikeCount] = useState(0)
    const [postID, setPostID] = useState<string | undefined>("")
    const [postList, setPostList] = useState<fireStore.DocumentData | undefined>([])
    const [viewPost, setViewPost] = useState({
        view: false,
        postDetail: {},
        id: ''
    })
    const obj = {
        likes: 0,
        comments: 0
    }
    const likeRef = React.useRef<number>();
    const postidRef = React.useRef() as React.MutableRefObject<any>;

    React.useEffect(() => {
        const postRef = fireStore.query(fireStore.collection(store, `posts`), fireStore.where('byUser', "==", userID), fireStore.orderBy("timestamp", "desc"))
        fireStore.onSnapshot(postRef, (querySnapShot) => {
            setPostCount(querySnapShot.size)
            setPostList([])
            setPostList(querySnapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            // querySnapShot.docs.map((doc) => {
            //     setPostList({ ...doc.data(), id: doc.id });
            //     setPostCount((prev) => prev + 1);
            // })
        });
        console.log(postList, "posts")
    }, [])

    // like count
     function getLikeCount(postID: string | undefined) {
        const postRef =  fireStore.collection(store, `posts/${postID}/likedBy`)
        fireStore.onSnapshot(postRef, (querySnapShot) => {
            setLikeCount(querySnapShot.size)
        })
        return likeCount
     }
    
    React.useEffect(() => {
        postidRef.current = postID;
        setPostID(postidRef.current)
        console.log(postidRef, postID)
    }, [postID])
    
    function getLikes(post: any) {
        setPostID(post.id)
        let likes = getLikeCount(post.id);
        setViewPost({
            view: true, id:post?.id, postDetail: { ...post }
        })
        console.log(likes)
    }
    
    React.useEffect(() => {
        console.log("likecount altered")
        likeRef.current = likeCount;
        setViewPost({
            ...viewPost, postDetail: { ...viewPost.postDetail, likes: likeRef.current }
        })
        console.log(viewPost)
    }, [likeCount])

    return (
        <>
            <div className='border-t border-t-gray-300  smmd:hidden'>
                <div className="flex gap-4 p-3 items-center justify-around ">
                    <div className="justify-center text-sm flex flex-col items-baseline flex-wrap">
                        <span className="font-semibold w-full text-center m-0 p-0">{postCount}</span>
                        <span className="text-gray-500 m-0 p-0 text-xs">posts</span>
                    </div>
                    <div className="justify-center text-sm flex flex-col items-baseline flex-wrap">
                        <span className="font-semibold w-full text-center">10</span>
                        <span className="text-gray-500 text-xs">followers</span>
                    </div>
                    <div className="justify-center text-sm flex flex-col items-baseline flex-wrap">
                        <span className="font-semibold w-full text-center">10</span>
                        <span className="text-gray-500 text-xs">following</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 smmd:gap-6">
                {/* <p>{userSnapDocRef.current?.uid}</p> */}
                {
                    postList?.map((post: any, idx: number) => {
                        return (
                            <div
                                key={idx}
                                className="group w-full aspect-square flex justify-center items-center bg-black relative overflow-hidden"
                                onClick={(e) => getLikes(post)}
                            >
                                {
                                    post.mediaType === "image" ? <img src={post.imgURL} alt="" className="w-auto h-auto object-cover smmd:h-auto" />
                                        :
                                        <video src={post.imgURL} className='absolute to-0 right-0 left--0 bottom-0 w-full h-full'></video>
                                }
                                <div className="absolute top-0 left-0 w-full h-0 group-hover:cursor-pointer bg-black/50 opacity-0 group-hover:h-full group-hover:opacity-100 transition-all ease-linear duration-300 flex flex-col gap-2 justify-center items-center">
                                    <div className="flex gap-4 items-center text-white ">
                                        <HeartIcon className="h-7 w-7" />
                                        {likeRef.current}
                                    </div>
                                    <div className="flex gap-4 items-center text-white ">
                                        <ChatIcon className="h-7 w-7" />
                                        10
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