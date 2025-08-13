import { useState,useEffect,useCallback } from "react";
import { data, useNavigate } from "react-router";
import { useSession } from "../providers/SessonProvider";
import { Button, Container } from "react-bootstrap";
import { adminListUser, getUserUploads } from "../utils/webFetch";
import UserMgtTable from "./UserMgtTable";
import { useModal } from "../providers/ModalProvider";
import AudioUploadsTable from "./AudioUploadsTable";
import AudioUploadModal from "./AudioUploadModal";
export interface Audio{
    id:string,
    name:string,
    category:string|null,
    uploaded_date:String
}

export default function AudioUpload(){

    const session = useSession();
    const navigate = useNavigate();
    const [uploads,setUploads] = useState<Audio[]|null>(null);
    const [error, setError] = useState<string|null>(null);
    const {setModalContent,openModal} = useModal();

    const fetchAudio = useCallback(async ()=>{
        const results = await getUserUploads();
        if(results.error){
            if(results.error === 401){
                setError('You are unauthorized')
                setUploads(null);
            }
            else{
                setError('Internal Server Error')
                setUploads(null);
            }
            return;
        }
        if(results.data){
            setUploads(results.data)
            return;
        }

    },[])

    
    useEffect(()=>{
        fetchAudio();
    },[])    
    
    const OpenUploadModal = ()=>{

        setModalContent(
            <AudioUploadModal {...{fetchAudio}} />
        )
        openModal()
    }

    return(
            <>
            {
                error &&<p className="lead">Error encountered: {error}</p>
            }
            <div className="py-3">
                <h1>Audio Uploads</h1>
            </div>
            <div className="pb-5">
                <Button size="lg" onClick={OpenUploadModal}>Upload new Audio file</Button>
            </div>
            <AudioUploadsTable audioUploadsTableProps={{uploads}}/>
            </>
                       
    )


}