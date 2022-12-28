import { Drawer } from '@progress/kendo-react-layout';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
const Sidebar = (props) => {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [boards, setBoards] = useLocalStorageState('boards', {
    defaultValue: [],
  });

  const onSelect = (e) => {
    navigate(`/boards/${e.itemTarget.props.id}`);
  };

  let requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }),
    redirect: 'follow',
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/board/all', requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            setBoards(result.data);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  }, []);

  return (
    <Drawer
   
      onSelect={onSelect}
      expanded={true}
      position={'start'}
      mode={'push'}
      width={220}
      items={boards.map((board) => ({
        text: board.name,
        id: board.id,
        selected: board.id == boardId,
      }))}
    >
    </Drawer>
  );
};

export default Sidebar;
