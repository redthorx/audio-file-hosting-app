import {Audio} from './AudioUpload'
import { Table } from "react-bootstrap";
import AudioUploadTableItem from "./AudioUploadTableItem";
interface AudioUploadsTableProps{
    uploads:Audio[]|null
}

export default function AudioUploadsTable({audioUploadsTableProps}:{audioUploadsTableProps:AudioUploadsTableProps}) {
    
    return(
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Audio name</th>
                    <th>Uploaded date</th>
                    <th>Category</th>
                    <th>Download</th>
                </tr>
            </thead>
            <tbody>
                {   audioUploadsTableProps.uploads &&
                    audioUploadsTableProps.uploads.map((upload)=>{
                        return (
                            <AudioUploadTableItem key={upload.id} audioUploadTableItemProps={{audio:upload}}/>
                        )
                    })
                }
            </tbody>
        </Table>
    )

}