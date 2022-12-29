import { filterBy } from '@progress/kendo-data-query';
import { Button } from '@progress/kendo-react-buttons';
import { TaskBoard, TaskBoardToolbar } from '@progress/kendo-react-taskboard';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import { Card } from './Card';
import { Column } from './Column';
import TypeAddedDialog from './TypeAddedDialog';
import AddTypeDialog from './AddTypeDialog';
import ShareDialog from './ShareDialog';
const priorities = [
  {
    priority: '1',
    color: 'green',
  },
  {
    priority: '2',
    color: 'blue',
  },
  {
    priority: '3',
    color: 'yellow',
  },
  {
    priority: '4',
    color: 'orange',
  },
  {
    priority: '5',
    color: 'red',
  },
];

const Board = () => {
  const [shareDialog, setShareDialog] = useState(false);
  const [addTypeDialogVisible, setAddTypeDialogVisible] = useState(false);
  const [typeAddedVisible, setTypeAddedVisible] = useState(false);
  const [filter, setFilter] = useState('');
  const [columnsData, setColumnsData] = useState([]);
  const [types, setTypes] = useLocalStorageState('types', {
    defaultValue: [],
  });
  const [taskData, setTaskData] = useLocalStorageState('tasks', {
    defaultValue: [],
  });
  const [statuses, setStatuses] = useLocalStorageState('statuses', {
    defaultValue: [],
  });
  const [users, setUsers] = useLocalStorageState('users', {
    defaultValue: [],
  });
  const { boardId } = useParams();

  useEffect(() => {
    setStatuses([]);
    setTypes([]);
    setUsers([]);
    let boardRequestOptions = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      redirect: 'follow',
    };
    fetch(`http://localhost:8080/api/v1/board/${boardId}`, boardRequestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            const columns = result.data.statuses.map((s, index) => ({
              id: index,
              title: s,
              status: s,
            }));
            setTypes(result.data.types);
            setStatuses(result.data.statuses);
            const tasks = result.data.items.map((c) => ({
              id: c.id,
              title: c.title,
              description: c.description,
              status: c.status,
              priority:
                c.importance !== 0
                  ? priorities.find((p) => p.priority == c.importance)
                  : 0,
              type: c.type,
              assignedTo: c.assignedTo,
              comments: c.comments,
              creatorId: c.creator.id,
              dueDate: c.dueDate,
            }));
            setColumnsData(columns);
            setTaskData(tasks);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
    let usersRequestOptions = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      redirect: 'follow',
    };
    fetch(
      `http://localhost:8080/api/v1/board/${boardId}/users`,
      usersRequestOptions
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            setUsers([...result.data])
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  }, [boardId]);
  const deleteItem = (event) => {
    console.log(event);
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        itemId: event.previousItem.id,
      }),
      redirect: 'follow',
    };
    fetch('http://localhost:8080/api/v1/item/delete', requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            const oldTasks = [...taskData];
            setTaskData([...oldTasks.filter((t) => t.id !== result.data)]);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  const updateStatus = (event) => {
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        itemId: event.item.id,
        status: event.item.status,
      }),
      redirect: 'follow',
    };
    fetch('http://localhost:8080/api/v1/item/status/update', requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            const updatedTasks = taskData.map((t) =>
              result.data.id === t.id
                ? {
                    id: result.data.id,
                    title: result.data.title,
                    description: result.data.description,
                    status: result.data.status,
                    priority: priorities.find(
                      (p) => p.priority == result.data.importance
                    ),
                    type: result.data.type,
                    assignedTo: result.data.assignedTo,
                    comments: result.data.comments,
                    creatorId: result.data.creator.id,
                    dueDate: result.data.dueDate,
                  }
                : t
            );
            setTaskData(updatedTasks);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  const addStatus = (event) => {
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        boardId: boardId,
        name: event.item.title,
      }),
      redirect: 'follow',
    };
    fetch('http://localhost:8080/api/v1/board/status/add', requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            setStatuses([...result.data.statuses]);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  const deleteStatus = (event) => {
    debugger;
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        boardId: boardId,
        name: event.previousItem.title,
      }),
      redirect: 'follow',
    };
    fetch('http://localhost:8080/api/v1/board/status/delete', requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            setStatuses([...result.data.statuses]);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  const resultTasks = useMemo(() => {
    const filterDesc = {
      logic: 'and',
      filters: [
        {
          field: 'title',
          operator: 'contains',
          value: filter,
        },
      ],
    };
    return filter ? filterBy(taskData, filterDesc) : taskData;
  }, [filter, taskData]);

  const onChangeHandler = useCallback(
    (event) => {
      switch (event.type) {
        case 'task':
          if (!event.item && event.previousItem) {
            deleteItem(event);
          } else if (event.item.status === event.previousItem.status) {
            return;
          } else {
            updateStatus(event);
          }
          break;
        case 'column':
          if (!event.item && event.previousItem) {
            deleteStatus(event);
          } else if (event.item.title === event.previousItem.title) {
            addStatus(event);
          }
          setColumnsData(event.data);
          break;
        default:
          if (event.item && event.item.id === undefined) {
            event.item.id = event.data.length + 1;
          }
          setTaskData(event.data);
          break;
      }
    },
    [taskData]
  );

  const onAddColumn = () => {
    const newColumn = {
      id: columnsData.length + 1,
      title: 'New Column',
      status: 'new',
      edit: true,
    };
    setColumnsData([...columnsData, newColumn]);
  };
  const onAddType = () => {
    setAddTypeDialogVisible(true);
  };
  const typeAdded = () => {
    setAddTypeDialogVisible(false);
    setTypeAddedVisible(true);
  };
  const close = () => {
    setAddTypeDialogVisible(false);
  };
  const share = () => {
    setShareDialog(true);
  };
  return (
    <>
      <TaskBoard
        types={types}
        columnData={columnsData}
        taskData={resultTasks}
        priorities={priorities}
        onChange={onChangeHandler}
        column={Column}
        card={Card}
        style={{ height: '93vh' }}
        tabIndex={0}
      >
        <TaskBoardToolbar>
          <Button icon='add' onClick={onAddColumn}>
            Add Status
          </Button>
          <Button icon='add' onClick={onAddType}>
            Add Item Type
          </Button>
          <Button iconClass='fa-solid fa-user-plus' onClick={share}>
            Share
          </Button>
        </TaskBoardToolbar>
      </TaskBoard>
      {addTypeDialogVisible && (
        <AddTypeDialog boardId={boardId} success={typeAdded} close={close} />
      )}
      {typeAddedVisible && (
        <TypeAddedDialog close={() => setTypeAddedVisible(false)} />
      )}
      {shareDialog && <ShareDialog close={() => setShareDialog(false)} />}
    </>
  );
};

export default Board;
