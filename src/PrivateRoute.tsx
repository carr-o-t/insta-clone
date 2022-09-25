import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthProvider'

const PrivateRoute = ({ children }: any) => {
    const { currentUser } = useAuth()
    return currentUser ? children : <Navigate to="/login" />
}

export default PrivateRoute