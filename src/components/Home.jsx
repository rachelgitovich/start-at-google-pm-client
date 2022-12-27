import { Button } from '@progress/kendo-react-buttons';
import React from 'react';

export default function Home() {
  const createBoard = async () => {};

  return (
    <div className='home'>
      <Button fillMode={'outline'} themeColor={'success'} onClick={createBoard}>
        Click here to create your first board
      </Button>
    </div>
  );
}
