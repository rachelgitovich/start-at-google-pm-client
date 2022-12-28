import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import useLocalStorageState from 'use-local-storage-state';
import { useNavigate } from 'react-router-dom';
import { Label } from '@progress/kendo-react-labels';
import { async } from 'q';

export default function AddTypeDialog({ boardId, close, success }) {
  const [typeName, setTypeName] = useState('');
  const [types, setTypes] = useLocalStorageState('types', {
    defaultValue: [],
  });
  const addType = async () => {
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        boardId: boardId,
        name: typeName,
      }),
      redirect: 'follow',
    };
    fetch(`http://localhost:8080/api/v1/board/type/add`, requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            setTypes([...result.data.types]);
            success();
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  return (
    <Dialog onClose={close} title="Add new type" closeIcon>
      <Label editorId='typeName'>Enter type name:&nbsp;</Label>
      <Input
        onChange={(e) => setTypeName(e.value)}
        validityStyles={false}
        name='typeName'
        type='text'
        minLength={2}
        required={true}
        margin='normal'
        id={'typeName'}
      />

      <DialogActionsBar>
      <Button themeColor={'primary'} onClick={close} fillMode={"outline"}>
          Cancel
        </Button>
        <Button type='submit' themeColor={'primary'} onClick={addType}>
          OK
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
}
