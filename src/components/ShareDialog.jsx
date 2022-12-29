import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';
import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';


export default function ShareDialog({ close, boardId, userAdded }) {
  const [users, setUsers] = useLocalStorageState('users', {
    defaultValue: [],
  });
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState(['ADMIN', 'LEADER', 'USER']);
  const [selectedRole, setSelectedRole] = useState('USER');
  const share = () => {
    let requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        boardId: boardId,
        userEmail: email,
        role: selectedRole,
      }),
      redirect: 'follow',
    };
    fetch('http://localhost:8080/api/v1/board/share', requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            let oldUsers = [...users];
            oldUsers.push(result.data.user.email);
            setUsers([...oldUsers]);
            userAdded();
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  return (
    <Dialog width={500} closeIcon onClose={close} title='Share board'>
      <div className='k-d-flex'>
        <Input
          className='shareInput'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <DropDownList
          className='shareDropDown'
          data={roles}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        />
      </div>
      <DialogActionsBar>
        <Button
          themeColor={'primary'}
          className='k-m-3'
          fillMode={'outline'}
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          themeColor={'primary'}
          className='k-m-3'
          onClick={share}
        >
          Share
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
}
