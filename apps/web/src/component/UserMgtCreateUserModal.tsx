import { FormEvent, useState } from "react";
import { Modal, Button,Form } from "react-bootstrap";
import { adminCreateUser } from "../utils/webFetch";
import { useAlert } from "../providers/AlertProvider";
import { useModal } from "../providers/ModalProvider";

interface UserMgtCreateUserModalProps {
  fetchUsers: () => void;
}
interface createUserError{
  type: "username"|"password"|"password2"| "admin";
  message:string;
}

export default function UserMgtCreateUserModal({fetchUsers}:UserMgtCreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [password,setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [username,setUsername] = useState('')
  const {pushAlert} = useAlert();
  const {closeModal} = useModal();
  const [error,setError] = useState< createUserError| null>(null)

  const handleCreateUser = async (e:FormEvent)=>{
    e.preventDefault();
    if(password!==password2){
      setError({type:'password2',message:'passwords do not match'})
      return;
    }
    const {success,error} = await adminCreateUser(username,password)
        if(success){
          pushAlert({type:'success',message:'your account has been created'})
          fetchUsers();
          closeModal();
        }
        else{
          if(error === 409){
            setError({type:'username',message:'Please use another username'})
            return
          }
          if(error===401){
            setError({type:'admin',message:'Unauthorized'})
          }
          else{
            setError({type:'admin',message:'there was an issue creating an account'})
          }
        } 
}

  return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Create User</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleCreateUser}>
                        {error && error.type === 'admin' &&(
                            <Form.Text className='text-danger'>{error.message}</Form.Text>
                            )}
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
                </Modal.Body>

            </>
  );
}