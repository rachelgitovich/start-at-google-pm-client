import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';
import React, { useState } from 'react';

export default function ShareDialog({ close }) {
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState(['ADMIN', 'LEADER', 'USER']);
  const [selectedRole, setSelectedRole] = useState('USER');
  const share=()=>{
    
  }
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
        <Button type='submit' themeColor={'primary'} className='k-m-3' onClick={share}>
          Share
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
}
