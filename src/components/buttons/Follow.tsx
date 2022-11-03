import React from 'react'
import { fireStore, store } from '../../firebase';
import { addUserToFolloweeAndFollower, getUserByID, removeUserFromFolloweeAndFollower } from '../../functions/services';
import { Insta } from '../../types'
import { ReactComponent as FollowingIcon } from '../../assets/svgs/followed_icon.svg'

function Follow({
    // currentUserID,
    // followeeID,
    isFollow,
    onClick
}: Insta.followProp) {

    // const [isFollow, setIsFollow] = React.useState<boolean | null>(null)
    // const [followerData, setFollowerData] = React.useState<fireStore.DocumentData | undefined>()
    // const [followeeData, setFolloweeData] = React.useState<fireStore.DocumentData | undefined>()
    // const handleFollow = () => {
    //     setIsFollow(typeof isFollow === null ? true : !isFollow)
    // }

    // const getIsFollowedByUser = async () => {
    //     const userFolloweeDocSnap = await fireStore.getDoc(fireStore.doc(store, `users/${currentUserID}/followees/${followeeID}`));
    //     if (userFolloweeDocSnap.exists()) {
    //         setIsFollow(true)
    //     }
    // }

    // React.useEffect(() => {
    //     getUserByID(currentUserID).then((result) => setFollowerData(result));
    //     getUserByID(followeeID).then((result) => setFolloweeData(result));
    //     getIsFollowedByUser();
    // }, [])

    // React.useEffect(() => {
    //     if (isFollow == true) {
    //         addUserToFolloweeAndFollower(currentUserID, followeeID, { ...followerData, uid: currentUserID }, { ...followeeData, uid: followeeID })
    //     }
    //     if (isFollow == false) {
    //         removeUserFromFolloweeAndFollower(currentUserID, followeeID)
    //     }
    // }, [isFollow])
    

    return (
        <div>
            <button
                className={`text-festa-one font-semibold px-4 py-1 rounded-lg cursor-pointer ${isFollow ? 'bg-festa-one border border-festa-eight' : 'bg-festa-two'}`}
                onClick={onClick}
            >
                {
                    isFollow ?
                        <FollowingIcon className="h-6 w-6" />
                        :
                        <span className="">Follow</span>
                }
            </button>
        </div>
    )
}

export default Follow