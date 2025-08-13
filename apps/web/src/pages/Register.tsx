import React, { FormEvent, ReactEventHandler, useEffect, useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import { useAlert } from '../providers/AlertProvider';
import { useSession } from '../providers/SessonProvider';
import { register } from '../utils/webFetch';
interface RegisterError{
  type: "username"|"password"|"password2";
  message:string;
}
export default function RegisterPage() {
  const {pushAlert} = useAlert();
  const session = useSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password2, setPassword2] = useState('')
  const [password, setPassword] = useState('')
  const [error,setError] = useState<RegisterError | null>(null)

  useEffect(()=>{
    if(!session.loading && session.username){
      navigate('/')
    }

  },[session])

  const handleRegister = async (e:FormEvent) => {
    e.preventDefault();
    if(password!==password2){
      setError({type:'password2',message:'passwords do not match'})
      return;
    }
    const {success,error} = await register(username,password)
    if(success){
      pushAlert({type:'success',message:'your account has been created'})
    }
    else{
      if(error === 409){
        setError({type:'username',message:'Please use another username'})
        return
      }
    pushAlert({type:'danger',message:'unable to create account'})

    }
    
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '22rem' }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Register</h3>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="string" 
                placeholder="Enter Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <Form.Group className="mb-3" controlId="formPassword2">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password2}
                onChange={(e) => setPassword2(e.target.value)} 
                required
              />
              {error && error.type === 'password2' &&(
                <Form.Text className='text-danger'>{error.message}</Form.Text>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
          <p className='lh-lg fw-lighter text-center'>Have an account? <Link to="/login">Login</Link></p>
        </Card.Body>
      </Card>
    </Container>
  );
}
