import { collection, doc, limit, onSnapshot, orderBy, startAfter } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import PostLayout from '../components/PostLayout'
import { fireStore, store } from '../firebase'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { ChevronDoubleUpIcon } from '@heroicons/react/outline'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Home() {

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [postList, setPostList] = useState(Array<fireStore.DocumentData | undefined>);
  const [loading, setLoading] = useState(true);
  const [latestDoc, setLatestDoc] = useState<fireStore.DocumentData | undefined | null>(null)
  const [loadMore, setLoadMore] = useState(true)
  const [updated, setUpdated] = useState(false);
  const postCollectionRef = collection(store, "posts");
  const [isLoading, setIsLoading] = useState(false)

  const [prevListSize, setPrevListSize] = useState(0)
  const [newListSize, setNewListSize] = useState(0)
  const [followeeIDs, setFolloweeIDs] = useState<Array<string>>([])
  const [newList, setNewList] = useState(Array<fireStore.DocumentData | undefined>);
  


  useEffect(() => {
    console.log([...followeeIDs, currentUser?.uid])
    const postQuery = fireStore.query(postCollectionRef, orderBy("timestamp", "desc"), fireStore.where("byUser", "in", [...followeeIDs, currentUser?.uid]), fireStore.limit(2));
    fireStore.onSnapshot(postQuery, (result) => {
      if (result.docs.length === 1) setLoadMore(false)
      setPostList(result.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLatestDoc(result.docs[result.docs.length - 1]);
    })
  }, [followeeIDs])

  function getFollowees() {
    const followeeRef = fireStore.collection(store, `users/${currentUser?.uid}/followees`)
    fireStore.onSnapshot(followeeRef, (result) => {
      setFolloweeIDs(result.docs.map((doc) => doc.data().uid));
    })
  }
  async function getPosts() {
    setUpdated(false);
    setPostList([])
    let res = []
    getFollowees();
    console.log("getposts' followee lists : ", followeeIDs)
    // const postCollectionQuery = fireStore.query(postCollectionRef, orderBy("timestamp", "desc"), limit(2));
    // return await fireStore.onSnapshot(postCollectionQuery, (result) => {
    //   if (result.docs.length === 1) setLoadMore(false)
    //   setPostList(result.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //   setLatestDoc(result.docs[result.docs.length - 1]);
    // })
  }

  async function handleLoadMore() {
    // if (window.innerHeight + document.documentElement.scrollTop < document.scrollingElement.scrollHeight) console.log("not loadable")
    // else {
    setIsLoading(true)
    const postCollectionQuery = fireStore.query(postCollectionRef, orderBy("timestamp", "desc"), fireStore.where("byUser", "in", [...followeeIDs, currentUser?.uid]), startAfter(latestDoc || 0), limit(2));
    return await fireStore.getDocs(postCollectionQuery).then((result) => {
      if (result.docs.length >= 1) {
        setLoadMore(true)
        result.docs.map((doc) => (
          setPostList((prev) => [...prev, { ...doc.data(), id: doc.id }])
        ));
        setLatestDoc(result.docs[result.docs.length - 1]);
        if (result.docs.length === 1) setLoadMore(false)
      }
      else {
        setLoadMore(false)
      }
    })
      .then(() => {
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false)
        toast.error("couldn't load data")
      })
    // }   
  }

  const isNewPostMade = async () => {
    const postCollectionQuery = fireStore.query(postCollectionRef, orderBy("timestamp", "desc"));
    onSnapshot(postCollectionQuery, (querySnapShot) => {
      setNewListSize(querySnapShot.docs.length)
    })
    if (newListSize !== prevListSize) {
      setUpdated(true)
    }
    else {
      setUpdated(false)
    }
  }

  const defaultFunc = async () => {
    setLoadMore(true)
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    const postCollectionQuery = fireStore.query(postCollectionRef, orderBy("timestamp", "desc"));
    await fireStore.getDocs(postCollectionQuery).then((result) => {
      setPrevListSize(result.docs.length)
    })
    getPosts()
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setUpdated(false)
    isNewPostMade();
    setUpdated(false)
  }, [newListSize])

  useEffect(() => {
    
    defaultFunc();
  }, [])



  // useEffect(() => {
  //     window.addEventListener('scroll', handleLoadMore);

  //       return () => {
  //           window.removeEventListener('scroll', handleLoadMore);
  //       };
  // }, [])


  if (loading) {
    return <div className="height-[100%] flex min-h-[inherit] justify-center items-center"><Spinner /></div>
  }
  return (

    <>

      {
        !loading && postList?.length === 0 ?
          <>
            <div className="flex flex-col justify-centerw-full h-full max-w-4xl m-auto p-2">
              <h2 className="text-center font-bold text-lg">No Posts made yet!</h2>
              {/* <img src={NoPost} alt="" /> */}
            </div>
          </>
          :
          <>
            <div className="w-full h-full max-w-4xl m-auto p-2 
            grid grid-cols-1 gap-4 lg:grid-cols-1">
              {
                updated && <div className="">
                  <button className="p-2 text-sm border-none bg-festa-two text-festa-one font-mono fixed left-[calc(50%_-_34px)] -translate-x-1/2 top-20 rounded-full font-semibold animate-bounce" onClick={defaultFunc}>new posts</button>
                </div>
              }
              <div className="space-y-5">
                {
                  postList?.map((post: any, idx: any) => {
                    return <PostLayout caption={post.caption} likes={post.likes} media={post.imgURL} mediaType={post.mediaType} byUser={post.byUser} postID={post?.id} createdAt={(post?.timestamp)} key={idx} />
                  })
                }
              </div>
              {
                isLoading ? <Spinner /> : <div className="flex justify-center items-center mb-2">
                  {
                    loadMore ? <button className="bg-festa-two text-festa-one font-mono text-sm font-semibold p-3 rounded-lg" onClick={() => handleLoadMore()}>Load more </button> :
                      <button className="bg-festa-two text-festa-one font-mono text-sm font-semibold p-3 rounded-lg" onClick={() => defaultFunc()}>
                        <ChevronDoubleUpIcon className="h-8 w-8" />
                      </button>
                  }
                </div>
              }

            </div>
          </>
      }
      <ToastContainer />
    </>

  )
}



export default Home