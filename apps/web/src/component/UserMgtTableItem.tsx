import { useEffect, useState } from "react";
import {User} from './UserMgt'
import { Form,Button, Modal } from "react-bootstrap";
import { useModal } from "../providers/ModalProvider";
import UserEditModal from "./UserEditModal";
interface UserMgtTableItemProps{
    user:User
    fetchUsers:()=>void
}

export default function UserMgtTableItem({userMgtTableItemProps}:{userMgtTableItemProps:UserMgtTableItemProps}) {
    
    const {setModalContent,openModal,closeModal} = useModal();
    
    const openUpdateModal = ()=>{

        setModalContent(
            <UserEditModal {...userMgtTableItemProps} />
        )
        openModal()
    }
    return(
        <tr>
            <td>{userMgtTableItemProps.user.id}</td>
            <td>{userMgtTableItemProps.user.username}</td>
            <td><Form.Check aria-label={userMgtTableItemProps.user.username} checked={userMgtTableItemProps.user.isAdmin} disabled/></td>
            <td><a href="#" onClick={()=>{openUpdateModal()}}>Edit</a></td>
        </tr>
    )
}

