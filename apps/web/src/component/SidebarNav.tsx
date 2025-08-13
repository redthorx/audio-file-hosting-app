import { Nav } from "react-bootstrap";
import { useSidebar, type SidebarNavLink } from "../providers/SidebarProvider";
interface SidebarNavProps{
    link:SidebarNavLink;
}

export default function SidebarNav({sidebarNavProps}:{sidebarNavProps:SidebarNavProps}){

    const {setSelected, selected} = useSidebar();
    return(
        <Nav.Item>
            <Nav.Link onClick={()=>setSelected(sidebarNavProps.link)} className={selected === sidebarNavProps.link ? " text-black" : "text-white"}>
                {sidebarNavProps.link}
            </Nav.Link>
        </Nav.Item>
    )


}