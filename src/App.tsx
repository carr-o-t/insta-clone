import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './screens/authentication/Login'
import Register from './screens/authentication/Register'
// import EditProfile from './screens/EditProfile'
// import Home from './screens/Home'
// import Profile from './screens/Profile'
import Saved from './screens/Saved'
import Settings from './screens/Settings'
import PrivateRoute from './PrivateRoute'
import { useAuth } from './context/AuthProvider'
import Messenger from './screens/Messenger'
import Error503 from './components/Error503'
import Error404 from './components/Error404'
import Spinner from './components/Spinner'

const Home = lazy(() => import("./screens/Home"))
const Profile = lazy(() => import("./screens/Profile"))
const EditProfile = lazy(() => import("./screens/EditProfile"))

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
                        <Suspense fallback={<Spinner />}>
                            <Home />
                        </Suspense>
                    </PrivateRoute>
                } />
                <Route path='/profile/:uid' element={
                    <PrivateRoute>
                        <Suspense fallback={<Spinner />}>
                            <Profile />
                        </Suspense>
                    </PrivateRoute>
                } />
                <Route path={`/profile/edit`} element={
                    <PrivateRoute>
                        <Suspense fallback={<Spinner />}>
                            <EditProfile />
                        </Suspense>
                    </PrivateRoute>
                } />
                {/* <Route path="*" element={currentUser ? () => navigate(-1)) : <Navigate to="/login" />} />/ */}
                {/* <Route path="*" element={(pathName !== 'login' && pathName !== 'register') ? <Navigate to={history.} /> : <Navigate to={"/login"} />} /> */}
                <Route path="/chat" element={
                    <PrivateRoute>
                        <Error503 />
                    </PrivateRoute>
                } />
                <Route path="/*" element={
                    <PrivateRoute>
                        <Error404 />
                    </PrivateRoute>
                } />
            </Routes>

        </>
    )
}

export default App