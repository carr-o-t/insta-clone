import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './screens/authentication/Login'
import Register from './screens/authentication/Register'
import EditProfile from './screens/EditProfile'
import Home from './screens/Home'
import Profile from './screens/Profile'
import Saved from './screens/Saved'
import Settings from './screens/Settings'
import PrivateRoute from './PrivateRoute'
import { useAuth } from './context/AuthProvider'
import React from 'react'

function App() {

    const { currentUser } = useAuth()
    const pathName = useLocation().pathname.split('/')[1]
    const [currentPath, setCurrentPath] = React.useState("")
    const navigate = useNavigate()

    React.useEffect(() => {
        setCurrentPath(window.location.pathname)
    }, [])

    return (
        <>
            {
                pathName !== 'login' && pathName !== 'register' && <Navbar />
            }
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                } />
                <Route path='/profile/:uid' element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/saved" element={
                    <PrivateRoute>
                        <Saved />
                    </PrivateRoute>
                } />
                <Route path="/settings" element={
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                } />
                <Route path={`/profile/edit`} element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                } />
                {/* <Route path="*" element={currentUser ? () => navigate(-1)) : <Navigate to="/login" />} />/ */}
                {/* <Route path="*" element={(pathName !== 'login' && pathName !== 'register') ? <Navigate to={history.} /> : <Navigate to={"/login"} />} /> */}
            </Routes>

        </>
    )
}

export default App