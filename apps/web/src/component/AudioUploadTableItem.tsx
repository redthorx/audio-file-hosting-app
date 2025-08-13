import { MouseEvent, useEffect, useState } from "react";
import {Audio} from './AudioUpload'
import { useAlert } from "../providers/AlertProvider";
import { getAudioUrl } from "../utils/webFetch";
interface AudioUploadTableItemProps{
    audio:Audio
}

export default function AudioUploadTableItem({audioUploadTableItemProps}:{audioUploadTableItemProps:AudioUploadTableItemProps}) {
    const {pushAlert} = useAlert();

    const redirectToAudio = async (e:MouseEvent<HTMLAnchorElement>)=>{
        e.preventDefault();
        const {error,url } = await getAudioUrl(audioUploadTableItemProps.audio.id);
        if(error){
            if(error === 401) pushAlert({type:'danger',message:'You cannot access the file'});
            if(error===404) pushAlert({type:'danger',message:'File not found'});
            else pushAlert({type:'danger',message:'Internal Server Error'});
            return;
        }
        if(url) window.location.href=url;
        return;
    }

    
    return(
        <tr>
            <td>{audioUploadTableItemProps.audio.name}</td>
            <td>{audioUploadTableItemProps.audio.uploaded_date}</td>
            <td>{audioUploadTableItemProps.audio.category}</td>
            <td><a href="#" onClick={redirectToAudio}>Download</a></td>
        </tr>
    )
}

