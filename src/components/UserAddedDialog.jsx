import React from 'react'
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

export default function UserAddedDialog({close}) {
  return (
    <Dialog onClose={close}>
      <p
        style={{
          margin: '25px',
          textAlign: 'center',
        }}
      >
        User added successfully!
      </p>
      <DialogActionsBar>
        <Button themeColor={'primary'} onClick={() => close()}>
          OK
        </Button>
      </DialogActionsBar>
    </Dialog>
  )
}
