import { Nav } from "react-bootstrap";
import { useSidebar } from "../providers/SidebarProvider";
import UserMgt from "./UserMgt";
import AudioUpload from "./AudioUpload";

export default function HomepageContent() {
    const {selected} = useSidebar();
    switch(selected){
        case "Audio Upload":
            return(<AudioUpload/>
            )
        case "User management":
           return( 
            <UserMgt/>
           )
    }       
}