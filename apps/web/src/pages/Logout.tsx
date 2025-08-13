import React, { FormEvent, ReactEventHandler, useEffect, useState } from 'react';
import {  Container } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router'
import { logout } from '../utils/webFetch';
import { useSession } from '../providers/SessonProvider';
import { useAlert } from '../providers/AlertProvider';


export default function LogoutPage() {
  const {username, fetchSession} = useSession();
  const [error,setError] = useState<string | null>(null)
  const navigate = useNavigate();
  const logoutUser = async ()=>{
    const status = await logout()
    if(status.success){
        fetchSession()
        navigate('/')
    }
    if(error){
        setError(error)
    }
  }   
  useEffect(()=>{
    logoutUser();
  },[])
  return (
    <Container>
        {
            error ? <p className='text-danger lead'>Error: {error}</p> : <p className='lead'>Logging out...</p>
        }
    </Container>
  );
}
