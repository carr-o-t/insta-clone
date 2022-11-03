import { useEffect, useState } from 'react'
import { SearchIcon, XIcon } from '@heroicons/react/outline'
import { XCircleIcon } from '@heroicons/react/solid'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { Link } from 'react-router-dom'
import { fireStore, store } from '../firebase'
import { addUserToRecentSearch, getRecentSearches, getUsersByUserName, removeAllRecentSearch } from '../functions/services'
import { useAuth } from '../context/AuthProvider'
import Spinner from './Spinner'

function Search() {

  const { currentUser } = useAuth()
  const [initialSearchResult, setInitialSearchResult] = useState<fireStore.DocumentData | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchRes, setSearchRes] = useState<fireStore.DocumentData | undefined>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSearch, setIsSearch] = useState(false)

  const handleSearchQuery = (value: string) => {
    setSearchQuery(value.toLowerCase());
    const timer = setTimeout(() => {
      setIsLoading(true)
      getUsersByUserName(searchQuery)
        .then((res) => setSearchRes(res))
        .finally(() => setIsLoading(false))
    }, 1000)
  }
  const closeSearch = () => {
    setIsSearch(false);
  }

  const handleSearch = () => {
    setIsLoading(true)
    getUsersByUserName(searchQuery)
      .then((res) => setSearchRes(res))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    const postRef = fireStore.collection(store, `users/${currentUser?.uid}/recentSearches`)
    fireStore.onSnapshot(fireStore.collection(store, `users/${currentUser?.uid}/recentSearches`), (querySnapShot) => {
      setInitialSearchResult(querySnapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
  }, [])

  const handleAddUserToRecent = (uid: string, username: string, displayName: string, photoURL: string) => {
    addUserToRecentSearch(currentUser?.uid, uid, username, displayName, photoURL)
      .then(() => setIsSearch(false))
  }

  const searchRef = useDetectClickOutside({ onTriggered: closeSearch });

  return (
    <div className="relative flex text-xs sm:text-sm flex-row items-center px-2 py-1 sm:px-4 sm:py-2 rounded-lg bg-festa-one" ref={searchRef}>
      <input
        ref={searchRef}
        type="text"
        value={searchQuery}
        placeholder='Search'
        className="z-10 w-full text-festa-six font-semibold bg-transparent focus:text-festa-two focus:font-semibold focus:outline-none caret-festa-two"
        onChange={(e) => {
          handleSearchQuery(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSearch()
          }
        }}
        onClick={(e) => {
          setIsSearch(true);
          if (searchQuery === "") {
            setIsLoading(true)
          }
        }}
      />
      <SearchIcon className={`sm:h-8 sm:w-8 h-6 w-6 cursor-pointer text-festa-six ${isSearch ? 'hidden' : 'block'}`}
        onClick={(e) => handleSearch()}
      />
      <XCircleIcon className={`h-8 w-8 cursor-pointer text-festa-six ${!isSearch ? 'hidden' : 'block'}`}
        onClick={(e) => setSearchQuery("")}
      />
      <div className={`w-full min-h-[0] p-4 bg-festa-one shadow-bora rounded-lg  absolute left-0 top-0 opacity-0  transition-all ease duration-200 ${isSearch && 'opacity-100 min-h-[66px] top-[calc(100%_+_1rem)]'}`}>
        {
          searchQuery.length === 0 ? (initialSearchResult?.length > 0 && isSearch ?
            <>
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-row justify-between">
                  <span className="font-semibold text-black">Recent</span>
                  <button className="text-festa-two" onClick={(e) => {
                    removeAllRecentSearch(currentUser?.uid);
                    getRecentSearches(currentUser?.uid)
                      .then((res: fireStore.DocumentData) => setInitialSearchResult(res))
                      .finally(() => setIsLoading(false))
                  }
                  }>clear all</button>
                </div>
                {
                  initialSearchResult?.map((user: fireStore.DocumentData) => {
                    return <div className="flex  flex-col gap-y-4">
                      <Link
                        to={`/profile/${user.uid}`}
                        className="flex gap-3 items-center cursor-pointer hover:bg-festa-six hover:text-festa-one text-black transition-all duration-100 p-2 rounded-md"
                        onClick={(e) => handleAddUserToRecent(user.uid, user.username, user.displayName, user.photoURL)}
                      >
                        <div className="h-10 w-10 rounded-full">
                          <img src={user.photoURL} alt="" className="h-10 w-10 object-cover rounded-full" />
                        </div>
                        <span className="text-xs font-semibold">{user.username}</span>
                      </Link>
                    </div>
                  })
                }
              </div>
            </> : <span className="flex min-h-[inherit] justify-center items-center font-bold text-black">no recent searches!</span>) : isSearch && (isLoading ? <Spinner /> :
              <>
                {
                  searchRes?.length > 0 ? searchRes?.map((user: fireStore.DocumentData) => {
                    return <div className="flex  flex-col gap-y-4">
                      <Link
                        to={`/profile/${user.uid}`}
                        className="flex gap-3 items-center cursor-pointer hover:bg-festa-six hover:text-festa-one text-black transition-all duration-100 p-2 rounded-md"
                        onClick={(e) => addUserToRecentSearch(currentUser?.uid, user.uid, user.username, user.displayName, user.photoURL).then(() => setIsSearch(false))}
                      >
                        <div className="h-10 w-10 rounded-full">
                          <img src={user.photoURL} alt="" className="h-10 w-10 object-cover rounded-full" />
                        </div>
                        <span className="text-xs font-semibold">{user.username}</span>
                      </Link>
                    </div>
                  }) : <span className="flex min-h-[inherit] justify-center items-center text-black font-bold">no such user found!</span>
                }
              </>)
        }
      </div>
    </div>
  )
}

export default Search