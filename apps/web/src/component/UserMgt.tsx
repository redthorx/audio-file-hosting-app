import { useState,useEffect,useCallback } from "react";
import { data, useNavigate } from "react-router";
import { useSession } from "../providers/SessonProvider";
import { Button, Container } from "react-bootstrap";
import { adminListUser } from "../utils/webFetch";
import UserMgtTable from "./UserMgtTable";
import { useModal } from "../providers/ModalProvider";
import UserMgtCreateUserModal from "./UserMgtCreateUserModal";

export interface User{
    id:number,
    username:string,
    isAdmin:boolean
}

export default function UserMgt(){

    const session = useSession();
    const navigate = useNavigate();
    const [users,setUsers] = useState<User[]|null>(null);
    const [error, setError] = useState<string|null>(null);
    const {setModalContent,openModal} = useModal();

    const fetchUsers = useCallback(async ()=>{
        const results = await adminListUser();
        if(results.error){
            if(results.error === 401){
                setError('You are unauthorized to see the users')
                setUsers(null);
            }
            if(results.error === 404){
                setError('No users found')
                 setUsers(null);
            }
            if(results.error === 500){
                setError('Internal Server Error')
                setUsers(null);
            }
            return;
        }
        if(results.data){
            setUsers(results.data)
            return;
        }

    },[])
    useEffect(()=>{
    if(!session.loading && !session.isAdmin ){
        navigate('/')
    }
      },[session])
    
    useEffect(()=>{
        fetchUsers();
    },[])    
    
    const openAdminCreateModal = ()=>{

        setModalContent(
            <UserMgtCreateUserModal {...{fetchUsers}} />
        )
        openModal()
    }

    return(
            <>
            {
                error &&<p className="lead">Error encountered: {error}</p>
            }
            <div className="py-3">
                <h1>User Management</h1>
            </div>
            <div className="pb-5">
                <Button size="lg" onClick={openAdminCreateModal}>Create User</Button>
            </div>
            <UserMgtTable userMgtTableProps={{users,fetchUsers}}/>
            </>
                       
    )


}