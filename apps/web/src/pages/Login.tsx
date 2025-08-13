import React, { FormEvent, ReactEventHandler, useState,useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router'
import { login } from '../utils/webFetch';
import { useSession } from '../providers/SessonProvider';

interface LoginError{
  type:'username' | 'password' | 'login',
  message:string
}
export default function LoginPage() {
  const [formUsername, setFormUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState<LoginError | null>(null)
  const {username, fetchSession, setSession, loading} = useSession();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!loading && username){
      navigate('/')
    }

  },[username,loading])
  const handleLogin = async (e:FormEvent) => {
    e.preventDefault();
    if(formUsername.length <1){
      setError({type:'username',message:'Please enter username'})
    }
    if(password.length<1){
      setError({type:'password',message:'Please enter password'})
    }
    const user = await login(formUsername,password)
    if(user.username){
      fetchSession();
      navigate('/home');
      return;
    }
    if(user.error===401){
      setError({type:'login',message:'Invalid credentials'})
      return
    }
    else{
      setError({type:'login',message:`Error from server: ${user.error}`})
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '22rem' }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Login</h3>
          {error && error.type === 'login' &&(
            <Form.Text className='text-danger'>{error.message}</Form.Text>
          )}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="string" 
                placeholder="Enter Username" 
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                required 
              />
              {error && error.type === 'username' &&(
                <Form.Text className='text-danger'>{error.message}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
              {error && error.type === 'password' &&(
                <Form.Text className='text-danger'>{error.message}</Form.Text>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <p className='lh-lg fw-lighter text-center'>Don't have an account? <Link to="/register">Register</Link></p>
        </Card.Body>
      </Card>
    </Container>
  );
}
