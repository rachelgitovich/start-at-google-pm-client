import React, {useEffect} from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
const ConfirmDeleteDialog = props => {
  const {
    onClose,
    onConfirm,
    dialogMessage,
    dialogTitle,
    dialogConfirmButton,
    dialogCancelButton
  } = props;
  useEffect(() => {
    console.log(props)
  }, [])
  
  const deleteItem=()=>{

  }
  return <Dialog title={dialogTitle} closeIcon={false}>
        {dialogMessage}

        <DialogActionsBar layout='end'>
          <Button themeColor={'primary'} onClick={onConfirm}>
            {dialogConfirmButton}
          </Button>
          <Button onClick={deleteItem}>
            {dialogCancelButton}
          </Button>
        </DialogActionsBar>
      </Dialog>;
};
export default ConfirmDeleteDialog