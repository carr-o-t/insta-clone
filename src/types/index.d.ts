import * as firebase from 'firebase/auth'
import { FunctionTypeNode } from 'typescript';

declare namespace Insta {
    interface Children extends React.PropsWithChildren<{}> { }

    type CurrentUser = null | firebase.UserInfo;

    type CreateUserPromise = { success: boolean; message: string }

    interface AuthContext {
        currentUser: CurrentUser;
        createUserWithEmail: (params: { email: string; password: string; }) => Promise<firebase.UserCredential>;
        signInWithGoogle: () => Promise<firebase.UserCredential>;
        loginWithEmailAndPassword: (params: { email: string; password: string; }) => Promise<firebase.UserCredential>;
    }

    interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        label?: string;
    }

    interface ButtonProps extends Children, React.ButtonHTMLAttributes<HTMLButtonElement> {
        buttonType?: 'auth' | 'others';
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
    }
    
    interface deleteProp {
        isDelete?: boolean;
        isClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
        postID?: string;
    }

    interface Dropdown {
        isOpen?: boolean;
        close?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }

    interface UserModalProp {
        isLikeActive?: boolean;
        isClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
        postID?: string;
    }
}