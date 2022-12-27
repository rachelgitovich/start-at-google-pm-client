import { filterBy } from '@progress/kendo-data-query';
import { Button } from '@progress/kendo-react-buttons';
import { TaskBoard, TaskBoardToolbar } from '@progress/kendo-react-taskboard';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import { Card } from './Card';
import { Column } from './Column';

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
  const { boardId } = useParams();

  useEffect(() => {
    localStorage.setItem('boardId', boardId);
    localStorage.removeItem('statuses');
    localStorage.removeItem('types');
    let requestOptions = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      redirect: 'follow',
    };
    fetch('http://localhost:8080/api/v1/board/' + boardId, requestOptions)
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
            setTypes(result.data.types);
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
  }, [boardId]);

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
      if (event.type === 'task') {
        if (event.item.status === event.previousItem.status) {
          return;
        }
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
        fetch('http://localhost:8080/api/v1/item/update/status', requestOptions)
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
      } else if (event.type === 'column') {
        setColumnsData(event.data);
      } else {
        // New Task has been added.
        if (event.item && event.item.id === undefined) {
          event.item.id = event.data.length + 1;
        }
        setTaskData(event.data);
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

  return (
    <TaskBoard
      types={types}
      columnData={columnsData}
      taskData={resultTasks}
      priorities={priorities}
      onChange={onChangeHandler}
      column={Column}
      card={Card}
      style={{ height: '700px' }}
      tabIndex={0}
    >
      <TaskBoardToolbar>
        <Button icon='add' onClick={onAddColumn}>
          Add Column
        </Button>
      </TaskBoardToolbar>
    </TaskBoard>
  );
};

export default Board;
