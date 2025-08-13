import { useState } from "react";
import { Modal, Button,Form, Alert } from "react-bootstrap";
import { adminDeleteUser, updateUser } from "../utils/webFetch";
import { User } from "./UserMgt";
import { useAlert } from "../providers/AlertProvider";
import { useModal } from "../providers/ModalProvider";
interface UserEditModalProps {
  user: User;
  fetchUsers: () => void;
}
interface ModalAlert{
    type:'success' | 'danger'
    message:string
}

export default function UserEditModal({ user, fetchUsers }: UserEditModalProps) {
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [loading, setLoading] = useState(false);
  const [modalAlert,setModalAlert] = useState<ModalAlert | null>(null)
  const [password,setPassword] = useState('')
  const {closeModal} = useModal();
  const {pushAlert} = useAlert();

  const handleToggleAdmin = async () => {
                                        setLoading(true);
                                        const { success, error: updateError } = await updateUser(user.username, undefined, !isAdmin);
                                        if (!success) {
                                        setModalAlert({type:'danger',message:"unable to set admin"})
                                        } else {
                                        setIsAdmin(!isAdmin);
                                        setModalAlert({type:'success',message:"Changed Admin settings"});
                                        fetchUsers();
                                        }
                                        setLoading(false);
                                    };
    const handleUpdatePassword = async (newPassword:string)=>{
                                    setLoading(true);
                                    const { success, error: updateError } = await updateUser(
                                                                                    user.username,
                                                                                    newPassword,
                                                                                    undefined
                                                                                )
                                    if (!success) {
                                        setModalAlert({type:'danger',message:"Unable to change password"})
                                        } 
                                    else {
                                        setModalAlert({type:'success',message:"Password Changed"})
                                        fetchUsers();
                                        }
                                    setLoading(false);
                                }
    const handleDeleteAccount = async()=>{
                                    setLoading(true)
                                        const { success, error: updateError } = await adminDeleteUser(user.username);
                                        if (!success) {
                                            setModalAlert({type:'danger',message:"unable to delete account"})
                                        } else {
                                            pushAlert({type:'info',message:'Account Deleted successfully'})
                                        }
                                        closeModal();
                                        fetchUsers();
                                        setLoading(false);
    }

  return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Edit user {user.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        modalAlert &&
                        <Alert variant={modalAlert.type}>
                            {modalAlert.message}
                        </Alert>
                    }
                    <Button onClick={handleToggleAdmin} 
                    variant={isAdmin ? "success": "warning"}
                    disabled={loading}>
                                {
                                    isAdmin?
                                     "Unset Admin"
                                     :"Set Admin"
                                }
                            </Button>
                    <Form
                      onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdatePassword(password);
                            setPassword('')
                        }}>
                        <Form.Group className="mb-3 mt-3" controlId="formPassword">
                                        <Form.Label>Update Password</Form.Label>
                                        <Form.Control 
                                        type="password" 
                                        placeholder="Password"
                                        onChange={e => setPassword(e.target.value)} 
                                        value={password}
                                        required
                                        />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={loading}>
                                Update
                            </Button>
                    </Form>
                    <div className="pt-5">
                        <Button variant="danger" size="sm" onClick={handleDeleteAccount}>Delete account</Button>
                    </div>
                </Modal.Body>

            </>
  );
}