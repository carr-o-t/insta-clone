import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Authlayout from '../../components/Authlayout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { ReactComponent as GoogleIcon } from '../../assets/svgs/google_icon.svg'
import {useAuth} from '../../context/AuthProvider'
import { fireStore, store } from '../../firebase'

function Login() {

    const { signInWithGoogle, loginWithEmailAndPassword, currentUser } = useAuth()
    
    const [loginInfo, setLoginInfo] = React.useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()

    const handleChange = (target: ("email" | "password"), value: string) => {
        setLoginInfo((oldInfo) => {
            return { ...oldInfo, [target]: value }
        })
    }

    const handleLogin = () => {
        loginWithEmailAndPassword({email:loginInfo.email, password:loginInfo.password}).then((result) => {
      navigate('/')
      alert('Login Successful! current user: ' + result.user)
    }).catch(() => {
      
        alert('Failed to Log in.')
      
    })
    }

     const handleGoogleLogin = async () => {
        
            await signInWithGoogle().then(async () => {
                    await fireStore.setDoc(fireStore.doc(store, `users/${currentUser?.uid}`), {
                        uid: currentUser?.uid,
                        displayName: currentUser?.displayName,
                        photoURL: `https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fdefault_avatar.jpg?alt=media&token=b3f0c452-922a-4594-a407-380622369ff3`,
                        username: currentUser?.displayName,
                        email: currentUser?.email,
                        bio: ""
                    })              
                    navigate('/')
                })

           
    }

    return (
        <Authlayout>
            <Input
                label="Username or email"
                value={loginInfo.email}
                onChange={(event) => {
                    handleChange('email', event.target.value)
                }}
            />
            <Input
                label="Password"
                type={"password"}
                value={loginInfo.password}
                onChange={(event) => {
                    handleChange('password', event.target.value)
                }}
            />
            <Button onClick={(e) => handleLogin()}>
                Login
            </Button>
        
            <Authlayout.Bottom>
                <div className="space-y-4">
                    <button className="flex items-center mx-auto gap-2" onClick={(e) => handleGoogleLogin()}>
                        <span>
                            <GoogleIcon className="h-6 w-auto" />
                        </span>
                        <span className="font-semibold text-gray-600/90">Login with Google</span>
                    </button>
                    <div className="">
                        <Link to="/forgot-password" className="text-sm font-medium text-gray-500/90">Forgot password?</Link>
                    </div>
                </div>
            </Authlayout.Bottom>
        </Authlayout>
    )
}

export default Login