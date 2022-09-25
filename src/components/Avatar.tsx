import React from 'react'
import { Link } from 'react-router-dom'
import { Insta } from '../types'

function Avatar({
  className = "",
  link,
  image,
  style = {}
}: Insta.AvatarProps) {
  console.log("/profile/" + link)
  return (
    <Link to={`/profile/${link}`} className={`${className} rounded-full`} style={style}>
      <img src={image} alt="" className='w-[inherit] h-[inherit] object-cover rounded-full' />
    </Link>
  )
}

export default Avatar