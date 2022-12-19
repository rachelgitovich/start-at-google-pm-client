import React from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate } from 'react-router-dom';


export default function SignUpPopup() {
    const navigate=useNavigate();
  return (
    <Dialog>
      <p
        style={{
          margin: '25px',
          textAlign: 'center',
        }}
      >
        User registered successfully!
      </p>
      <DialogActionsBar>
        <Button themeColor={'primary'} onClick={()=>navigate('/login')}>
          OK
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
}
