import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import useLocalStorageState from 'use-local-storage-state';
import { useNavigate } from 'react-router-dom';
import { Label } from '@progress/kendo-react-labels';

export default function CreateBoardDialog({ close }) {
  const [boardName, setBoardName] = useState('');
  const [boards, setBoards] = useLocalStorageState('boards', {
    defaultValue: [],
  });
  const navigate = useNavigate();
  const createBoard = async () => {
    let requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: boardName,
      redirect: 'follow',
    };
    debugger;
    fetch(`http://localhost:8080/api/v1/board/create`, requestOptions)
      .then((response) => {
        debugger;
        if (response.ok) {
          response.json().then((result) => {
            const oldBoards = [...boards];
            oldBoards.push(result.data);
            setBoards([...oldBoards]);
            navigate(`/boards/${result.data.id}`);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  return (
    <Dialog title={'Create new board'} closeIcon onClose={close}>
      <Label editorId='boardName'>Enter Board Name:&nbsp;</Label>
      <Input
        onChange={(e) => setBoardName(e.target.value)}
        validityStyles={false}
        name='boardName'
        type='text'
        minLength={2}
        required={true}
        margin='normal'
        id={'boardName'}
      />

      <DialogActionsBar>
        <Button themeColor={'primary'} onClick={close} fillMode={'outline'}>
          Cancel
        </Button>
        <Button type='submit' themeColor={'primary'} onClick={createBoard}>
          Create
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
}
