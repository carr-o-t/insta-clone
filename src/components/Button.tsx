import React from 'react'
import { Insta } from '../types'

function Button(props: Insta.ButtonProps) {
    const {
        buttonType = "others",
        children,
        className = "",
        ...restProps
    } = props;

    if (buttonType === "auth")
        return (
            <button className={`py-1.5 px-5 transition-all duration-300 w-full bg-festa-two text-festa-one font-semibold tracking-wide rounded ${className}`} {...restProps}>{children}</button>
        )

    return <button className={`py-1.5 px-5 transition-all duration-300 w-full bg-festa-two text-festa-one font-semibold tracking-wide rounded ${className}`} {...restProps}>{children}</button>
}

export default Button