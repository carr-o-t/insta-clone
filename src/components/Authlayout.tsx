import React from 'react'
import { Link } from 'react-router-dom';
import { Insta } from '../types'
import InstaImg from '../assets/insta_logo.png'
import Button from './Button';
import { ReactComponent as GoogleIcon } from '../assets/svgs/google_icon.svg'

interface AuthlayoutProps extends Insta.Children {
    bottomContainerText?: string;
    bottomContainerLink?: string;
    bottomContainerLinkText?: string;
    topText?: string;
    googleLoginButtonOnClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function Authlayout(props: AuthlayoutProps) {
    const {
        children,
        bottomContainerLink = "/register",
        bottomContainerLinkText = "Sign Up",
        bottomContainerText = "Don't have an account?",
        topText = "",
        googleLoginButtonOnClick
    } = props;

    return (
        <div className="max-w-sm w-full mx-auto my-10 3xl:my-auto space-y-8 text-center">
            <div className="p-8 bg-white shadow-md rounded-md">
                <div className="">
                    {/* INSTAGRAM LOGO INSIDE DIV */}
                    <div className="flex justify-center">
                        <img src={InstaImg} alt="Instagram Logo" height={'auto'} width={"50%"} />
                    </div>

                    {
                        topText !== "" &&
                        <>
                            <div className="w-10/12 mx-auto font-semibold my-5 text-gray-500">
                                <span>{topText}</span>
                            </div>
                            <div className="">
                                <Button onClick={googleLoginButtonOnClick} buttonType='auth' className='flex items-center justify-center bg-gray-200 hover:bg-gray-300 gap-3'>
                                    <span>
                                        <GoogleIcon className="h-6 w-auto" />
                                    </span>
                                    <span className='text-festa-one hover:text-gray-500 font-semibold'>
                                        Log in with Google
                                    </span>
                                </Button>
                            </div>
                            <div className="my-8 h-0 border border-gray-500/30 relative flex items-center justify-center">
                                <span className='uppercase absolute bg-white px-8 text-gray-500/80 text-sm'>or</span>
                            </div>
                        </>
                    }
                </div>
                <div className="mt-10 space-y-3">
                    {children}
                </div>
            </div>

            {/* BOTTOM CONTAINER */}
            <div className="p-8 bg-white shadow-md rounded-md">
                <span>{bottomContainerText}&nbsp;</span>
                <Link
                    to={bottomContainerLink !== "" ? bottomContainerLink : "/"}
                    className="text-festa-two font-semibold text-lg"
                >
                    {bottomContainerLinkText}
                </Link>
            </div>
        </div>
    )
}

function BottomContent({ children }: Insta.Children) {
    return (
        <div>
            <div className="my-8 h-0 border border-gray-500/30 relative flex items-center justify-center">
                <span className='uppercase absolute bg-white px-8 text-gray-500/80 text-sm'>or</span>
            </div>
            <div className="">
                {children}
            </div>
        </div>
    )
}

Authlayout.Bottom = BottomContent

export default Authlayout