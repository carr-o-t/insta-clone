import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { getUserByID } from '../functions/services';
import Head from '../components/Head';

function Profile() {
    const { uid } = useParams();
    const [paramUID, setParamUID] = React.useState<string | undefined>(uid)
    const [data, setData] = React.useState<any>([])
    const dataRef = React.useRef() as React.MutableRefObject<any>

    React.useEffect(() => {
        dataRef.current = data;
        setData(dataRef.current)
    }, [data])

    React.useEffect(() => {
        if (uid === paramUID) {
            getUserByID(uid)
                .then((result) => { setData(result) })
                .catch((err) => console.log(err));
        }
        else {
            window.location.reload();
            getUserByID(uid)
                .then((result) => { setData(result) })
                .catch((err) => console.log(err));
        }
    }, [uid])
    return (
        <div className="max-w-4xl w-full mx-auto smmd:p-2 mb-4">
            <div className="w-full h-full ">
                    <Head userID={uid} />
            </div>
        </div>
    )
}

export default Profile