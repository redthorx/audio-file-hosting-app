import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useSession } from '../providers/SessonProvider';


export default function LandingPage() {
  const session = useSession();
  const [startLink,setStartLink] = useState('/login')
    useEffect(()=>{
      if(!session.loading && session.username){
        setStartLink('/home')
      }
  
    },[session])
  return (
    <div className="text-center py-5">
      <Container>
        <h1>Audio file hosting app</h1>
        <p className="lead">Landing page for the audio file hosting app</p>
        <LinkContainer to={startLink}>
                <Button variant="primary">Get Started</Button>
        </LinkContainer>
      </Container>
    </div>
  );
}
