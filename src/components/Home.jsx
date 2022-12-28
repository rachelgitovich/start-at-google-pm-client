import { Button } from '@progress/kendo-react-buttons';
import React, {useState} from 'react';
import CreateBoardDialog from './CreateBoardDialog';

export default function Home() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className='home'>
      <Button icon='add' onClick={() => setShowDialog(true)}>
        Create new board
      </Button>
      {showDialog && <CreateBoardDialog close={()=>setShowDialog(false)}/>}
    </div>
  );
}
