import React from 'react'
import { Insta } from '../types'

function Input(props: Insta.InputProps) {
    const {
        label = "Enter your email",
        type = "text",
        className = "",
        placeholder = label,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null)
    return (
        <div className="text-left relative font-medium">
            <input
                type={type}
                className={`peer placeholder:text-transparent border border-gray-500/70 rounded px-4 pb-2 pt-4 text-sm focus:outline-none w-full bg-white ${className}`}
                placeholder={placeholder}
                ref={inputRef}
                {...restProps}
            />
            <label
                className="cursor-text absolute top-1 left-0 text-xs px-4 text-gray-500/75 transition-all duration-150 peer-placeholder-shown:top-[calc(50%-8px)] peer-placeholder-shown:text-sm"
                onClick={() => {
                    if (inputRef)
                        inputRef.current?.focus()
                }}
            >
                {label}
            </label>
        </div>
    )
}

export default Input