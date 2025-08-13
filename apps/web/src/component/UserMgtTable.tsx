import { useEffect } from "react";
import {User} from './UserMgt'
import { Table } from "react-bootstrap";
import UserMgtTableItem from "./UserMgtTableItem";
interface UserMgtTableProps{
    users:User[]|null,
    fetchUsers:()=>void
}

export default function UserMgtTable({userMgtTableProps}:{userMgtTableProps:UserMgtTableProps}) {
    
    return(
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Username</th>
                    <th>IsAdmin</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {   userMgtTableProps.users &&
                    userMgtTableProps.users.map((user)=>{
                        return (
                            <UserMgtTableItem key={user.id} userMgtTableItemProps={{user,fetchUsers:userMgtTableProps.fetchUsers}}/>
                        )
                    })
                }
            </tbody>
        </Table>
    )

}