import React from 'react'
import { useParams } from 'react-router-dom'
import ProfileHeader from '../components/ProfileHeader'
import ProfileBody from '../components/ProfileBody'
import { getUserByID } from '../functions/services';
import { fireStore } from '../firebase';



function Profile() {
    const { uid } = useParams();
    const [data, setData] = React.useState<any>([])
    const dataRef = React.useRef() as React.MutableRefObject<any>

    React.useEffect(() => { 
        dataRef.current = data;
        setData(dataRef.current)
        // console.log(dataRef.current[0].uid)
    }, [data])
    
    React.useEffect(() => {
        getUserByID(uid)
            .then((result) => {setData(result)})
            .catch((err) => console.log(err));
    }, [])
    return (
        <div className="max-w-4xl mx-auto smmd:p-2 ">
            <div className="w-full h-full ">
                <ProfileHeader userID={uid} />
            </div>
            <ProfileBody userID={uid} />
        </div>
    )
}

export default Profile