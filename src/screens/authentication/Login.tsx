import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Authlayout from '../../components/Authlayout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { ReactComponent as GoogleIcon } from '../../assets/svgs/google_icon.svg'
import { useAuth } from '../../context/AuthProvider'
import { fireStore, store } from '../../firebase'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Login() {

    const { signInWithGoogle, loginWithEmailAndPassword, currentUser } = useAuth()
    const [loginInfo, setLoginInfo] = React.useState({
        email: "",
        password: "",
        isEmailValid: true,
        signUpDisabled: true
    })
    const [error, setError] = React.useState({
        email: false,
        password: false
    })

    const navigate = useNavigate()

    const isValidEmail = (value: string) => {
        return /\S+@\S+\.\S+/.test(value);
    }
    React.useEffect(() => {
    }, [loginInfo])

    const handleChange = (target: ("email" | "password"), value: string) => {
        if (value === "") {
            setError((old) => ({ ...old, [target]: true }));
        }
        if (value !== "" && error[target]) {
            setError((old) => ({ ...old, [target]: false }))
        }
        setLoginInfo((oldInfo) => {
            return { ...oldInfo, [target]: value, signUpDisabled: error[target] || value === "" || loginInfo.email === "" || loginInfo.password === "" || !loginInfo.isEmailValid }
        })
    }

    const handleLogin = () => {
        loginWithEmailAndPassword({ email: loginInfo.email, password: loginInfo.password }).then(() => {
            navigate('/');
            toast.success(
                'Login Successful !'
            );
        }).catch(() => {
            toast.error('Operation Failed! Please try again.')
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
        })
            .then(() => {
                navigate('/');
                toast.success(
                    'Login Successful !'
                );
            }).catch((err) => {
                toast.error('Operation Failed! Please try again.')
            })
    }

    return (
        <div className="flex justify-center items-center m-auto">
            <Authlayout>
                <Input
                    label="email"
                    value={loginInfo.email}
                    error={loginInfo.email === "" && error.email ? "*email cannot be empty" : !loginInfo.isEmailValid ? "invalid email" : ""}
                    onChange={(event) => {
                        handleChange('email', event.target.value);
                        setTimeout(() => {
                            setLoginInfo((oldInfo) => {
                                return { ...oldInfo, isEmailValid: isValidEmail(event.target.value), signUpDisabled: error.email || event.target.value === "" || loginInfo.email === "" || loginInfo.password === "" || !loginInfo.isEmailValid }
                            })
                        }, 500)
                    }}
                />
                <Input
                    label="Password"
                    type={"password"}
                    error={error.password ? "*password cannot be empty" : ""}
                    value={loginInfo.password}
                    onChange={(event) => {
                        handleChange('password', event.target.value)
                    }}
                />
                <Button disabled={loginInfo.signUpDisabled} onClick={(e) => handleLogin()} className={`${loginInfo.signUpDisabled ? 'cursor-not-allowed bg-festa-two/30' : 'cursor-pointer'}`}>
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
                        {/* <div className="">
                        <Link to="/forgot-password" className="text-sm font-medium text-gray-500/90">Forgot password?</Link>
                    </div> */}
                    </div>
                </Authlayout.Bottom>
            </Authlayout>
            <ToastContainer />
        </div>
    )
}

export default Login