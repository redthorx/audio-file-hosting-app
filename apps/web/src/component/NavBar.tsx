import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { routes } from '../routes';
import NavBarLinkComponent from './NavBarLink';
import { useSession } from '../providers/SessonProvider';
export default function NavbarComponent() {
  const {username} = useSession();
  const navBarRoutes = routes.filter((route)=>{
    if(username){
      return !route.hideOnLogin && route.showOnNavbar;
    }
    return !route.isProtected && route.showOnNavbar
  })
  return (
    <Navbar bg="dark" variant="dark" expand="xl" sticky='top'>
      <Container fluid>
        <LinkContainer to='/'>
          <Navbar.Brand className='px-2'>Audio App</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {navBarRoutes.map(({path,label})=>(
              <NavBarLinkComponent key={path} navBarLinkProps={{link:path,name:label}} />
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
