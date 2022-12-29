import { filterBy } from '@progress/kendo-data-query';
import { Button } from '@progress/kendo-react-buttons';
import { TaskBoard, TaskBoardToolbar } from '@progress/kendo-react-taskboard';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import { Card } from './Card';
import { Column } from './Column';
import TypeAddedDialog from './TypeAddedDialog';
import AddTypeDialog from './AddTypeDialog';
import ShareDialog from './ShareDialog';
import UserAddedDialog from './UserAddedDialog';
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
const filters = [
  {display:'default', filter:'DEFAULT'},
  {display:'assigned to me', filter:'ASSIGNED_TO_ME'},
  {display:'no dates', filter:'NO_DATES'},
  {display:'overdue',filter:'OVERDUE'},
  {display:'created by me', filter:'CREATED_BY_ME'},
  {display: 'high priority', filter:'HIGH_IMPORTANCE'},
  {display: 'low priority', filter:'LOW_IMPORTANCE'}

];
const Board = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState({display:'default', filter:'DEFAULT'});
  const [shareDialog, setShareDialog] = useState(false);
  const [addTypeDialogVisible, setAddTypeDialogVisible] = useState(false);
  const [typeAddedVisible, setTypeAddedVisible] = useState(false);
  const [userAddedVisible, setUserAddedVisible] = useState(false);
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
  const [permission, setPermission] = useLocalStorageState('permission', {
    defaultValue: '',
  });
  const { boardId } = useParams();
  useEffect(()=>{
    let boardRequestOptions = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      redirect: 'follow',
    };
    fetch(
      `http://localhost:8080/api/v1/item/${boardId}/get/${selectedFilter.filter}`,
      boardRequestOptions
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            const tasks = result.data.map((c) => ({
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
            setTaskData(tasks);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  },[selectedFilter])
  const getBoards = () => {
    let boardRequestOptions = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      redirect: 'follow',
    };
    fetch(
      `http://localhost:8080/api/v1/board/get/${boardId}`,
      boardRequestOptions
    )
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
  };
  const getUsers = () => {
    let usersRequestOptions = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      redirect: 'follow',
    };
    fetch(
      `http://localhost:8080/api/v1/board/${boardId}/get/users`,
      usersRequestOptions
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            setUsers([...result.data]);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  const getPermission = () => {
    let usersRequestOptions = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      redirect: 'follow',
    };
    fetch(
      `http://localhost:8080/api/v1/board/${boardId}/get/permission`,
      usersRequestOptions
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            setPermission(result.data);
          });
        } else {
          response.json().then((result) => {
            alert(result.message);
            navigate('/');
          });
        }
      })
      .catch((error) => console.log('error', error));
  };
  useEffect(() => {
    setStatuses([]);
    setTypes([]);
    setUsers([]);
    getPermission();
    getBoards();
    getUsers();
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
        boardId: boardId,
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
        boardId: boardId,
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
    debugger;
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
            const columns = result.data.statuses.map((s, index) => ({
              id: index,
              title: s,
              status: s,
            }));
            setColumnsData(columns);
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
      debugger;
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
  const userAdded = () => {
    setShareDialog(false);
    setUserAddedVisible(true);
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
          {permission == 'ADMIN' && (
            <Button icon='add' onClick={onAddColumn}>
              Add Status
            </Button>
          )}
          {permission == 'ADMIN' && (
            <Button icon='add' onClick={onAddType}>
              Add Item Type
            </Button>
          )}
          {permission == 'ADMIN' && (
            <Button iconClass='fa-solid fa-user-plus' onClick={share}>
              Share
            </Button>
          )}
          <span className='k-spacer' />
          <span>Filter By:</span>
          <DropDownList
            data={filters}
            value={selectedFilter}
            textField={"display"}
            onChange={(e) => setSelectedFilter(e.target.value)}
          ></DropDownList>
        </TaskBoardToolbar>
      </TaskBoard>
      {addTypeDialogVisible && (
        <AddTypeDialog boardId={boardId} success={typeAdded} close={close} />
      )}
      {typeAddedVisible && (
        <TypeAddedDialog close={() => setTypeAddedVisible(false)} />
      )}
      {shareDialog && (
        <ShareDialog
          close={() => setShareDialog(false)}
          boardId={boardId}
          userAdded={userAdded}
        />
      )}
      {userAddedVisible && (
        <UserAddedDialog close={() => setUserAddedVisible(false)} />
      )}
    </>
  );
};

export default Board;
