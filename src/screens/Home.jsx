import { collection, limit, onSnapshot, orderBy, startAfter } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import PostLayout from '../components/PostLayout'
import { fireStore, store } from '../firebase'
import NoPost from '../assets/no_posts.gif'
import { useAuth } from '../context/AuthProvider'


function Home() {

  const { currentUser } = useAuth()

  const [postList, setPostList] = useState([]);
  // const [newPostList, setNewPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestDoc, setLatestDoc] = useState(null)
  const [updated, setUpdated] = useState(false);
  const postCollectionRef = collection(store, "posts");

  const [prevListSize, setPrevListSize] = useState(0)
  const [newListSize, setNewListSize] = useState(0)
  
  async function getPosts() {
    setUpdated(false);
    setPostList([])
    const postCollectionQuery = fireStore.query(postCollectionRef, orderBy("timestamp", "desc"),limit(2));
   return await fireStore.getDocs(postCollectionQuery).then((result) => {
     setPostList(result.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
     setLatestDoc(result.docs[result.docs.length - 1]);
    })
  }

  async function handleLoadMore() {
    // if (window.innerHeight + document.documentElement.scrollTop !== document.scrollingElement.scrollHeight) return
      const postCollectionQuery = fireStore.query(postCollectionRef, orderBy("timestamp", "desc"), startAfter(latestDoc || 0), limit(2));
    return await fireStore.getDocs(postCollectionQuery).then((result) => {
       result.docs.map((doc) => (
        setPostList((prev) => [...prev, { ...doc.data(), id: doc.id }])
        ));
     setLatestDoc(result.docs[result.docs.length - 1]);
   })
   
  }

  const isNewPostMade = async () => {
      const postCollectionQuery = fireStore.query(postCollectionRef, orderBy("timestamp", "desc"));
       await onSnapshot(postCollectionQuery, (querySnapShot) => {
          setNewListSize(querySnapShot.docs.length)
       })
    if (newListSize !== prevListSize) {
      setUpdated(true)
      console.log(newListSize)
    }
    else  {
      setUpdated(false)
    }
  }
  
  const defaultFunc = async () => {
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
    console.log(prevListSize+"+" + newListSize)
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
    return <Spinner />
  }
  return (
    
    <>
      
      {
        // !loading && postList.length === 0 ?
        //   <>
        //     <div className="flex flex-col justify-centerw-full h-full max-w-4xl m-auto p-2">
        //       <h2 className="text-center font-bold text-lg">No Posts made yet!</h2>
        //       <img src={NoPost} alt="" />
        //     </div>
        //   </>
        //   :
          <>
            <div className="w-full h-full max-w-4xl m-auto p-2 
            grid grid-cols-1 gap-4 lg:grid-cols-1">
              {
        updated && <div className="">
          <button className="p-2 text-sm border-none bg-blue-500 text-white fixed left-[calc(50%_-_34px)] -translate-x-1/2 top-20 rounded-full font-semibold animate-bounce" onClick={defaultFunc}>new posts</button>
        </div>
      }
           <div className="space-y-5">
        {
          postList?.map((post, idx) => {
            return <PostLayout caption={post.caption} media={post.imgURL } mediaType={post.mediaType} byUser={post.byUser} postID={post?.id} createdAt={(post?.timestamp)} key={idx} />
          })
        }
      </div>
              <div className="">
                <button className="" onClick={() => handleLoadMore()}>Load more posts...</button>
      </div>
          </div>
          </>
      }
    </>
     
  )
}

// function SideHomeFeed() {
//   return (
//     <div className="flex gap-4 p-4 bg-white items-center rounded-lg z-10">
//       <div className="">
//         <Avatar link={``} className="h-8 w-8" />
//       </div>
//       <div className="flex-grow">
//         <div className="text-sm">username</div>
//       </div>
//       <button
//         className="text-sm text-blue-500 font-semibold"
//       >follow</button>
//     </div>
//   )
// }

function Spinner() {
  return <div className="">LOADING............</div>
}

export default Home