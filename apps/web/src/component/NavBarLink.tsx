import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export interface NavBarLinkProps{
    link:string;
    name:string;
    hideWhenLoggedIn?:boolean;
}
export default function NavBarLinkComponent({navBarLinkProps}:{
    navBarLinkProps:NavBarLinkProps
}){
    return(
        <LinkContainer to={navBarLinkProps.link}>
            <Nav.Link>{navBarLinkProps.name}</Nav.Link>
        </LinkContainer>
    )
}