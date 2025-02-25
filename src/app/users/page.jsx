
'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { ClientResponse } from "../clientResponse/clientResponse";
import { userApi } from "../services/userApi";

const ListContainer = styled.div`
  position:relative;
  left: 33%;
  width: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #212121;
  border-radius : 15px;
  user-select: none;

`;

const ListElem = styled.li`
  border-bottom: grey solid 1px;
  display: flex; 
  justify-content: space-around;
  list-style-type: none;
  width: 100%;
  opacity: 0.7;
  font-weight: 700;
  padding: 10px;
  margin-top:10px;
  border-radius : 15px;

  &:hover {
    cursor : pointer;
    background-color : #1DB954;
    opacity: 1;
  }

  &:active {
    color: black;
  }

`;


const UserList = () => {
  const router = useRouter();
  let injectOrNot = false;
  
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        const data = await response.users;
        console.log(response.users);
        
        setUsers(data);  // Met à jour l'état
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    };

    loadUsers();
    console.log(users);
  }, []);

  
  return (
    <ListContainer className="p-4 bg-white rounded-lg shadow">
      <h2 className="font-semibold mb-2">Gestion des utilisateurs</h2>
      <ul>
        {users.map((user) => (
          <ListElem
            key={user._id}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/users/${user._id}`)}
          >
            <p className="font-medium">{user.username} </p>
            <p className="text-sm text-gray-600">/{user.email} </p>
            <p className="text-sm text-gray-600">/{user.role} </p>
          </ListElem>
        ))}
      </ul>
      {/* {(injectOrNot) ? <p>aaaaaaaaaaaaaaa</p> : <ClientResponse message={"Accès à ce client non autoriser"} />} */}
    </ListContainer>
  );
};

export default UserList;