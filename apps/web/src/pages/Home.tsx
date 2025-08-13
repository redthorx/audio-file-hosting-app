import { useState,useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import Sidebar from "../component/Sidebar";
import { SidebarNavLink, SidebarProvider, useSidebar } from "../providers/SidebarProvider";
import { useSession } from "../providers/SessonProvider";
import HomepageContent from "../component/HomepageContent";
import { ModalProvider } from "../providers/ModalProvider";


export default function Home() {
  const session = useSession();
  const navigate = useNavigate();
  function selectComponent(link:SidebarNavLink){
    switch(link){
        case"Audio Upload":
        return <></>
    }
    
  }
  useEffect(()=>{
    if(!session.loading && !session.username){
      navigate('/')
    }

  },[session])
    return(
        <div className="d-flex flex-column flex-lg-row vh-100">
            <SidebarProvider>
                <Sidebar />
                <ModalProvider>
                  <Container fluid>
                    <div className="w-75">
                      <HomepageContent/>
                    </div>
                  </Container>
                </ModalProvider>
            </SidebarProvider>
        </div>
    )
}
