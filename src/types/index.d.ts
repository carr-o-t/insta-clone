import * as firebase from 'firebase/auth'
import { FunctionTypeNode } from 'typescript';
import { fireStore } from '../firebase';

declare namespace Insta {
    interface Children extends React.PropsWithChildren<{}> { }

    type CurrentUser = null | firebase.UserInfo;

    type CreateUserPromise = { success: boolean; message: string }

    // type UserData = undefined | fireStore.DocumentData;

    interface AuthContext {
        currentUser: CurrentUser;
        createUserWithEmail: (params: { email: string; password: string; }) => Promise<firebase.UserCredential>;
        signInWithGoogle: () => Promise<firebase.UserCredential>;
        loginWithEmailAndPassword: (params: { email: string; password: string; }) => Promise<firebase.UserCredential>;
    }

    // interface UserContext {
    //     userData: UserData;
    //     isLoading: boolean;
    //     getUserByUserID: (params: {uid: string}) => Promise<fireStore>;
    // }

    interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        label?: string;
        userNameExists?: boolean;
        isUsernameValid?: boolean;
        error?: string;
        isEmailValid?: boolean;
        errorStyle?: string;
    }

    interface ButtonProps extends Children, React.ButtonHTMLAttributes<HTMLButtonElement> {
        buttonType?: 'auth' | 'others';
    }

    interface SearchProps {
        className?: string;
    }

    interface Dropdown {
        isOpen: boolean;
    }

    interface AvatarProps {
        className?: string;
        image?: string;
        link?: string;
        style?: React.CSSProperties<HTMLAnchorElement>;
    }

    interface SidefeedProps {
        follow?: boolean;
        handleClick ?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }

    interface ProfileHeaderProps {
        userID?: string;
        userImg?: string;
    }

    interface ProfileBodyProps {
        userID?: string;
    }
    interface postDetails {
        posts: {
            view: boolean;
            postDetail: {
                imgURL?: string;
                caption?: string;
                byUser?: string;
                likes?: number;
                mediaType?: string;
                timestamp?: Date;
            };
            id?: string;
        }
    }

    interface ViewPostProps extends postDetails{
        postID?: string;
        userID?: string;
        viewPost?: boolean;
        onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }

    interface InputProps extends React.ComponentProps<'input'> { 
        label?: string;
    }

    interface CreatePostProp {
        isCreate?: boolean;
        onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }

    interface PostProp {
        caption?: string;
        media?: string;
        mediaType?: string;
        likes?: number;
        byUser?: string; 
        postID?: string;
        createdAt?: Date;
        id?: string;
    }
    
    interface deleteProp {
        isDelete?: boolean;
        isClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
        postID?: string;
        handleModalRef?: React.MutableRefObject<HTMLButtonElement>;
    }

    interface Dropdown {
        isOpen?: boolean;
        close?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }

    interface followProp {
        isFollow: boolean | null;
        onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }

    interface UserModalProp  {
        isUserModalActive?: boolean;
        isClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
        ID?: string;
        currentUserID?: string;
        followeeID?: string;
        header?: string;
        collectionName?: string;
    }

    interface LikeButtonProp {
        onLike?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }

    interface CropImageProp  {
        isCrop?: boolean;
        isClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
        header?: string;
        src?:  any;
        handleCrop?: (croppedImage: string | undefined) => void;
    }

    interface ToastProp {
        status: 'success' | 'fail' | 'deleted' | '';
        message: '' | string;
    }
    interface DropDownProp {
        onClick?: () => void;
    }

}