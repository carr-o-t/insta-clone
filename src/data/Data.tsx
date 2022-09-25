import demoAvatar from '../assets/default_avatar.jpg'

export const dummyData = [
    {
        user_id: 1,
        name: "당곰",
        username: "Loremipsumdolorsitamet",
        bio: "전 당곰 이올시다 아미 💜",
        email: "chongching@gmail.com",
        gender: "female",
        avatar: demoAvatar,
        postCount: 10,
        followCount: 10,
        isFollowedBy: [
            {
                user_id: ""
            }
        ],
        followingCount: 10,
        isFollowing: [
            {
                user_id: ""
            }
        ]
    },

    {
        user_id: 2,
        name: "thv",
        username: "thv",
        bio: "💜",
        email: "thv@gmail.com",
        gender: "male",
        avatar: demoAvatar,
        postCount: 10,
        followCount: 10,
        isFollowedBy: [
            {
                user_id: ""
            }
        ],
        followingCount: 10,
        isFollowing: [
            {
                user_id: ""
            }
        ]
    }
]