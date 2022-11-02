import React from 'react'
import { useNavigate } from 'react-router-dom'
import Authlayout from '../../components/Authlayout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useAuth } from '../../context/AuthProvider'
import { firebaseAuth, fireStore, store } from '../../firebase'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Register() {

    const RandomAvatar = [
        "https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fjm.jpeg?alt=media&token=83d81e55-d056-4f2f-b121-c8cbc103d42b",
        "https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Frkive.jpeg?alt=media&token=76c3e12c-2623-4ded-b74d-af3b600b8e8c",
        "https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fthv.jpeg?alt=media&token=91e48dd5-7a5d-4c08-91b5-f5217e4ee59d",
        'https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fjk.jpeg?alt=media&token=da0ea952-a90b-410d-81de-2c538bf9a5d7',
        'https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fsua.jpeg?alt=media&token=0b20a4ca-0e4a-4652-88a0-fdef39a44ccf',
        'https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fhope.jpeg?alt=media&token=f56bbf41-d4fe-4b12-b665-bd5122e66023',
        'https://firebasestorage.googleapis.com/v0/b/ig-clone-8d433.appspot.com/o/images%2Fjn.jpeg?alt=media&token=b25abe30-c6b6-4e33-a06a-e48ee7942c6b'
    ]

    const { signInWithGoogle, createUserWithEmail } = useAuth()
    const [userNameExists, setUserNameExists] = React.useState(false)
    const [emailExist, setEmailExists] = React.useState(false)
    const [isUserNameValid, setIsUserNameValid] = React.useState(true)
    const [poorPassword, setPoorPassword] = React.useState(false);
    const [weakPassword, setWeakPassword] = React.useState(false);
    const [strongPassword, setStrongPassword] = React.useState(false);
    const [passwordError, setPasswordErr] = React.useState("");
    const [userInfo, setUserInfo] = React.useState({
        email: "",
        password: "",
        username: "",
        name: "",
        isEmailValid: true,
        isUsernameValid: true,
        IsUserNameExists: false,
        signUpDisabled: true
    })

    const [error, setError] = React.useState({
        email: false,
        name: false,
        username: false,
        password: false
    })

    const navigate = useNavigate()

    const handleUserNameExists = (value: string) => {
        setIsUserNameValid(isUsernameValid(value));
        const usersRef = fireStore.query(fireStore.collection(store, 'users'), fireStore.where('username', '==', value))

        fireStore.onSnapshot(usersRef, (querySnapShot) => {
            if (querySnapShot.size === 0) {
                setUserNameExists(false)
                setUserInfo((oldInfo) => {
                    return { ...oldInfo, IsUserNameExists: false, signUpDisabled: userInfo.email === "" || userInfo.name === "" || userInfo.username === "" || userInfo.password === "" || !userInfo.isEmailValid || emailExist || !isUserNameValid }
                })
            }
            else {
                setUserNameExists(true)
                setUserInfo((oldInfo) => {
                    return { ...oldInfo, IsUserNameExists: true, signUpDisabled: true }
                })
            }
        });
    }

    const handleEmailExists = (value: string) => {
        const usersRef = fireStore.query(fireStore.collection(store, 'users'), fireStore.where('email', '==', value))

        fireStore.onSnapshot(usersRef, (querySnapShot) => {
            if (querySnapShot.size === 0) {
                setEmailExists(false)
                setUserInfo((oldInfo) => {
                    return { ...oldInfo, emailExist: false, signUpDisabled: userInfo.email === "" || userInfo.name === "" || userInfo.username === "" || userInfo.password === "" || !userInfo.isEmailValid || userNameExists || !isUserNameValid }
                })
            }
            else {
                setEmailExists(true)
                setUserInfo((oldInfo) => {
                    return { ...oldInfo, emailExist: true, signUpDisabled: true }
                })
            }
        });
    }

    const isValidEmail = (value: string) => {
        return /\S+@\S+\.\S+/.test(value);
    }

    const isUsernameValid = (value: string) => {
        const re = /^[a-z0-9_.]{2,18}$/;
        setIsUserNameValid(re.test(value))
        return re.test(value)
    }

    const isPasswordStrong = (value: string) => {
        // const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        const passwordValue = value;
        const passwordLength = passwordValue.length;
        const poorRegExp = /[a-z]/;
        const weakRegExp = /(?=.*?[0-9])/;;
        const strongRegExp = /(?=.*?[#?!@$%^&*-])/;
        const whitespaceRegExp = /^$|\s+/;
        const poorPassword = poorRegExp.test(passwordValue);
        const weakPassword = weakRegExp.test(passwordValue);
        const strongPassword = strongRegExp.test(passwordValue);
        const whiteSpace = whitespaceRegExp.test(passwordValue);

        if (passwordValue === '') {
            setPasswordErr("*Password cannot be Empty");
        } else {

            // to check whitespace
            if (whiteSpace) {
                setPasswordErr("*Whitespaces are not allowed");
            }
            // to check poor password
            if (passwordLength < 6 && (poorPassword || weakPassword || strongPassword)) {
                setPoorPassword(true);
                setPasswordErr("*Password must be minimum 6 character long");
            }
            // to check weak password
            if (passwordLength >= 6 && poorPassword && (weakPassword || strongPassword)) {
                setWeakPassword(true);
                setPasswordErr("*Password is Weak(min 6 chars,include a-z,A-Z,0-9,special symbols)");
            } else {
                setWeakPassword(false);
            }
            // to check strong Password
            if (passwordLength >= 6 && (poorPassword && weakPassword) && strongPassword) {
                setStrongPassword(true);
                setPasswordErr("Strong password");
            } else {
                setStrongPassword(false);
            }
        }
    }

    const handleGoogleSignin = async () => {
        signInWithGoogle().then(async ({ user }) => {
            await fireStore.setDoc(fireStore.doc(store, `users/${user.uid}`), {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: RandomAvatar[Math.floor(Math.random() * 7)],
                username: user.displayName,
                email: user.email,
                bio: "",
                followeeCount: 0,
                followerCount: 0,
                link: "",
                banner: ""
            })
        })
            .then(() => {
                navigate('/');
                toast.success(
                    'Account created !'
                );
            }).catch((err) => {
                toast.error('Operation Failed! Please try again.')
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
                        photoURL: RandomAvatar[Math.floor(Math.random() * 7)],
                        username: userInfo.username,
                        email: userInfo.email,
                        bio: "",
                        followeeCount: 0,
                        followerCount: 0,
                        link: "",
                        banner: ""
                    }).then(() => {
                        navigate('/');
                        toast.success(
                            'Account created !'
                        );
                    }).catch((err) => {
                        toast.error('Operation Failed! Please try again.')
                    })
                })

            })
        }
    }

    const handleChange = (target: ("email" | "name" | "username" | "password"), value: string) => {
        if (value === "") {
            setError((old) => ({ ...old, [target]: true }));
        }
        if (value !== "" && error[target]) {
            setError((old) => ({ ...old, [target]: false }))
        }
        setUserInfo((oldInfo) => {
            return {
                ...oldInfo, [target]: value, signUpDisabled: error[target] || value === "" || userInfo.email === "" || userInfo.name === "" || userInfo.username === "" || userInfo.password === "" || !userInfo.isEmailValid || userNameExists || !isUserNameValid
            }
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
                error={userInfo.email === "" && error.email ? "*email cannot be empty" : !userInfo.isEmailValid ? "invalid email" : emailExist ? "email is already in use" : (userInfo.isEmailValid && !emailExist && userInfo.email !== "") ? "valid email" : ""}
                errorStyle={userInfo.isEmailValid && !emailExist && userInfo.email !== "" ? "border-green-700 text-green-700" : "border-red-500 text-red-600"}
                onChange={(event) => {
                    handleChange('email', event.target.value);
                    setTimeout(() => {
                        handleEmailExists(event.target.value);
                        setUserInfo((oldInfo) => {
                            return { ...oldInfo, isEmailValid: isValidEmail(event.target.value), signUpDisabled: error.email || userInfo.email === "" || userInfo.name === "" || userInfo.username === "" || userInfo.password === "" || !userInfo.isEmailValid || userNameExists || emailExist || !isUserNameValid }
                        })
                    }, 500)
                }}
                className={`${error.email || !userInfo.isEmailValid || emailExist ? 'border-red-500' : userInfo.isEmailValid && !emailExist && userInfo.email !== "" ? "border-green-700" : ''}`}
                onBlur={(event) => {
                    handleChange('email', event.target.value);
                    handleEmailExists(event.target.value)
                    setUserInfo((oldInfo) => {
                        return { ...oldInfo, isEmailValid: isValidEmail(event.target.value), signUpDisabled: error.email || userInfo.email === "" || userInfo.name === "" || userInfo.username === "" || userInfo.password === "" || !userInfo.isEmailValid || userNameExists || emailExist || !isUserNameValid }
                    })
                }}
            />
            <Input
                label="Full Name"
                value={userInfo.name}
                error={error.name ? "*name cannot be empty" : ""}
                onChange={(event) => {
                    handleChange('name', event.target.value)
                }}
                className={`${error.name ? 'border-red-500' : userInfo.name !== "" ? "border-green-700" : ""}`}
                onBlur={(event) => handleChange('name', event.target.value)}
            />
            <Input
                label="Username"
                userNameExists={userInfo.IsUserNameExists}
                isUsernameValid={isUserNameValid}
                value={userInfo.username}
                error={error.username ? "*username cannot be empty" : userNameExists ? "username already exists" : !isUserNameValid ? "*invalid username" : isUserNameValid && !userNameExists && userInfo.username !== "" ? "username valid" : ""}
                errorStyle={(isUserNameValid && !userNameExists && userInfo.username !== "") ? 'border-green-700 text-green-700' : "border-red-500 text-red-600"}
                onChange={(event) => {
                    handleChange('username', event.target.value)
                    setTimeout(() => {
                        handleUserNameExists(event.target.value);
                        isUsernameValid(event.target.value)

                    }, 500)
                }}
                className={`${error.username || userInfo.IsUserNameExists || !isUserNameValid ? 'border-red-500' : isUserNameValid && !userNameExists && userInfo.username !== "" ? 'border-green-700' : ''}`}
                onBlur={(event) => {
                    handleChange('username', event.target.value);
                    handleUserNameExists(event.target.value);
                }}
            />

            <Input
                label="Password"
                value={userInfo.password}
                type={"password"}
                error={passwordError
                    // error.password ? "*password cannot be empty" : !isStrongPssword ? "*password must be atleast 6 characters long(a-z,A-Z,0-9,special symbols)" : ""
                }
                onChange={(event) => {
                    handleChange('password', event.target.value)
                }}
                className={`${strongPassword ? 'border-green-700' : ''}`}
                errorStyle={`${strongPassword ? 'border-green-700 text-green-700' : 'border-red-500 text-red-600 '}`}
                onBlur={(event) => {
                    handleChange('password', event.target.value);
                    isPasswordStrong(event.target.value);
                }}
            />

            <div className="text-xs space-y-4 p-1 text-gray-500/80">
                <div className="">
                    People who use our service may have uploaded your contact information to Instagram. Learn More
                </div>
                <div className="">
                    By signing up, you agree to our Terms , Privacy Policy and Cookies Policy.
                </div>
            </div>
            <Button disabled={userInfo.signUpDisabled} onClick={handleSubmit} className={`${userInfo.signUpDisabled ? 'cursor-not-allowed bg-festa-two/30' : 'cursor-pointer'}`}>
                Sign up
            </Button>
        </Authlayout>
    )
}

export default Register