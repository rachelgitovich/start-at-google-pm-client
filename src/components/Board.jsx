import { filterBy } from '@progress/kendo-data-query';
import { Button } from '@progress/kendo-react-buttons';
import { TaskBoard, TaskBoardToolbar } from '@progress/kendo-react-taskboard';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import {fetchEventSource} from "@microsoft/fetch-event-source";
import { Card } from './Card';
import { Column } from './Column';

const EditType = [{
  type: 'CREATE'
},
{
  type: 'DELETE'
},
{
  type: 'UPDATE_TYPE'
},
{
  type: 'UPDATE_STATUS'
},
{
  type: 'COMMENT_ADD'
}]

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

  let requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }),
    redirect: 'follow',
  };

  useEffect(() => {
    console.log(boardId)

    const fetchData = async () => {
      await fetchEventSource('http://localhost:8080/api/v1/subscribe?boardId=' + boardId, {
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log("Connection made ", res);
          } else if (
              res.status >= 400 &&
              res.status < 500 &&
              res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(event) {
          let data = JSON.parse(event.data);
          console.log(data);
          if (event.event === 'CREATE') {
            if (Object.keys(data)[0] === 'ITEM') {
              // addItem(data['ITEM']);
              let oldTasks = [...taskData];
              oldTasks.push({
                id: data['ITEM'].id,
                title: data['ITEM'].title,
                description: data['ITEM'].description,
                status: data['ITEM'].status,
                priority: priorities.find(
                    (p) => p.priority == data['ITEM'].importance
                ),
                type: data['ITEM'].type,
                assignedTo: data['ITEM'].assignedTo,
                comments: data['ITEM'].comments,
                creatorId: data['ITEM'].creator.id,
                dueDate: data['ITEM'].dueDate,
              });
              setTaskData([...oldTasks])
            }
          }
          if (event.event === 'DELETE') {
            if (Object.keys(data)[0] === 'ITEM') {
              // addItem(data['ITEM']);
              let oldTasks = [...taskData];
              setTaskData([...oldTasks.filter((t) => t.id !== data['ITEM'].id)]);
            }
          }
          if (event.event === 'UPDATE') {
            if (Object.keys(data)[0] === 'ITEM') {
              const newTask = JSON.parse(event.data);
              let oldTasks = [...taskData];
              oldTasks = oldTasks.map((t) =>
                  data['ITEM'].id === t.id
                      ? {
                        id: data['ITEM'].id,
                        title: data['ITEM'].title,
                        description: data['ITEM'].data.description,
                        status: data['ITEM'].status,
                        priority: priorities.find(
                            (p) => p.priority == data['ITEM'].importance
                        ),
                        type: data['ITEM'].type,
                        assignedTo: data['ITEM'].assignedTo,
                        comments: data['ITEM'].comments,
                        creatorId: data['ITEM'].creator.id,
                        dueDate: data['ITEM'].dueDate,
                      }
                      : t
              );
              setTaskData([...oldTasks]);
            }
          }
          if (event.event === 'UPDATE') {
            if (Object.keys(data)[0] === 'ITEM_TYPE') {
              console.log("Updating Item Type");
            }
          }
          if (event.event === 'UPDATE') {
            if (Object.keys(data)[0] === 'ITEM_STATUS') {
              // addItem(data['ITEM']);
              console.log("Updating Item status")
            }
          }
          if (event.event === 'ADD') {
            if (Object.keys(data)[0] === 'COMMENT') {
              console.log("ADDING COMMENT")
            }
          }
          //console.log(JSON.parse(event.data));
          //const parsedData = JSON.parse(event.data);
          //setData((data) => [...data, parsedData]);
        },
      });
    };
    fetchData();

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
      console.log("Event " + event);
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

  const addItem = (data) => {
    const newTask = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.importance
    };
    setTaskData([...taskData, newTask]);
  }

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
