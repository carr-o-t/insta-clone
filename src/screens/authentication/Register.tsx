import { collection } from 'firebase/firestore'
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Authlayout from '../../components/Authlayout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useAuth } from '../../context/AuthProvider'
import { firebaseAuth, fireStore, store } from '../../firebase'

function Register() {
    const { signInWithGoogle, createUserWithEmail } = useAuth()
    const [userInfo, setUserInfo] = React.useState({
        email: "",
        password: "",
        username: "",
        name: ""
    })

    const [error, setError] = React.useState({
        email: false,
        name: false,
        username: false,
        password: false
    })

    const navigate = useNavigate()

    const handleGoogleSignin = async () => {
        signInWithGoogle().then(async ({ user }) => {
            await fireStore.setDoc(fireStore.doc(store, `users/${user.uid}`), {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: `https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fdefault_avatar.jpg?alt=media&token=b3f0c452-922a-4594-a407-380622369ff3`,
                username: user.displayName,
                email: user.email,
                bio: ""
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleSubmit = async () => {
        if (!error.email && !error.name && !error.password && !error.username) {
            await createUserWithEmail({ email: userInfo.email, password: userInfo.password }).then(async ({ user }) => {
                await firebaseAuth.updateProfile(user, {
                    displayName: userInfo.name,
                }).then(async () => {
                    await fireStore.setDoc(fireStore.doc(store, `users/${user.uid}`), {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: `https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fdefault_avatar.jpg?alt=media&token=b3f0c452-922a-4594-a407-380622369ff3`,
                        username: userInfo.username,
                        email: userInfo.email,
                        bio: ""
                    })

                    navigate('/')
                })

            })
        }
    }

    const handleChange = (target: ("email" | "name" | "username" | "password"), value: string) => {
        if (value === "") {
            setError((old) => ({ ...old, [target]: true }))
        }
        if (value !== "" && error[target]) {
            setError((old) => ({ ...old, [target]: false }))
        }
        setUserInfo((oldInfo) => {
            return { ...oldInfo, [target]: value }
        })
    }

    return (
        <Authlayout
            topText='Sign up to see photos and videos from your friends.'
            bottomContainerText='Have an account?'
            bottomContainerLinkText='Log in'
            bottomContainerLink='/login'
            googleLoginButtonOnClick={handleGoogleSignin}
        >
            <Input
                label="Email"
                value={userInfo.email}
                type={"email"}
                onChange={(event) => {
                    handleChange('email', event.target.value)
                }}
                className={`${error.email ? 'border-red-500' : ''}`}
                onBlur={(event) => handleChange('email', event.target.value)}
            />
            <Input
                label="Full Name"
                value={userInfo.name}
                onChange={(event) => {
                    handleChange('name', event.target.value)
                }}
                className={`${error.name ? 'border-red-500' : ''}`}
                onBlur={(event) => handleChange('name', event.target.value)}
            />
            <Input
                label="Username"
                value={userInfo.username}
                onChange={(event) => {
                    handleChange('username', event.target.value)
                }}
                className={`${error.username ? 'border-red-500' : ''}`}
                onBlur={(event) => handleChange('username', event.target.value)}
            />
            <Input
                label="Password"
                value={userInfo.password}
                type={"password"}
                onChange={(event) => {
                    handleChange('password', event.target.value)
                }}
                className={`${error.password ? 'border-red-500' : ''}`}
                onBlur={(event) => handleChange('password', event.target.value)}
            />

            <div className="text-xs space-y-4 p-1 text-gray-500/80">
                <div className="">
                    People who use our service may have uploaded your contact information to Instagram. Learn More
                </div>
                <div className="">
                    By signing up, you agree to our Terms , Privacy Policy and Cookies Policy.
                </div>
            </div>
            <Button onClick={handleSubmit}>
                Sign up
            </Button>
        </Authlayout>
    )
}

export default Register