import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSidebar, SidebarNavLink } from "../providers/SidebarProvider";
import SidebarNav from './SidebarNav'
export default function Sidebar({}) {
    const {availableLinks} = useSidebar();
    
    return (
        <div className="bg-secondary d-flex flex-lg-column flex-row align-items-md-center w-lg-auto">
            <Nav
                className="mb-auto px-2 py-lg-5 px-xl-1 flex-row w-100"
            >
            {availableLinks.map((link)=><SidebarNav sidebarNavProps={{link}} key={link} />)}
            </Nav>
            <hr className="d-none d-md-block" />
        </div>
    );
}