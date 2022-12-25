import { filterBy } from '@progress/kendo-data-query';
import { Button } from '@progress/kendo-react-buttons';
import { TaskBoard, TaskBoardToolbar } from '@progress/kendo-react-taskboard';
import { useParams } from 'react-router-dom';
import React, {useEffect, useState} from "react";
import { Card } from './Card';
import { Column } from './Column';


const priorities = [{
  priority: '1',
  color: 'green',
}, {
  priority: 'High Priority',
  color: 'blue'
}, {
  priority: 'Urgent',
  color: 'orange'
}];

const Board = () => {
  const [filter, setFilter] = useState('');
  const [taskData, setTaskData] = useState([]);
  const [columnsData, setColumnsData] = useState([]);

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
    fetch('http://localhost:8080/api/v1/board/' + boardId, requestOptions)
        .then((response) => {
          if (response.ok) {
            response.json().then((result) => {

              const columns = result.data.statuses.map(s => ({
                id: s.id,
                title: s.name,
                status: s.name
              }));

              const tasks = result.data.items.map(c => ({
                id: c.id,
                title: c.title,
                description: c.description,
                status: c.status.name,
                priority: c.importance
              }));

              setColumnsData(columns);
              setTaskData(tasks);
            });
          }
          else {
            response.json().then((result) => alert(result.message))
          }
        })
        .catch((error) => console.log('error', error));
  }, [boardId]);

  const resultTasks = React.useMemo(() => {
    const filterDesc = {
      logic: 'and',
      filters: [{
        field: 'title',
        operator: 'contains',
        value: filter
      }]
    };
    return filter ? filterBy(taskData, filterDesc) : taskData;
  }, [filter, taskData]);

  const onChangeHandler = React.useCallback(event => {
    if (event.type === 'column') {
      setColumnsData(event.data);
    } else {
      // New Task has been added.
      if (event.item && event.item.id === undefined) {
        event.item.id = event.data.length + 1;
      }
      setTaskData(event.data);
    }
  }, []);

  const onAddColumn = () => {
    const newColumn = {
      id: columnsData.length + 1,
      title: 'New Column',
      status: 'new',
      edit: true
    };
    setColumnsData([...columnsData, newColumn]);
  };

  return <TaskBoard
      columnData={columnsData}
      taskData={resultTasks}
      priorities={priorities}
      onChange={onChangeHandler}
      column={Column}
      card={Card}
      style={{height: '700px'}} tabIndex={0}>
        <TaskBoardToolbar>
          <Button icon="add" onClick={onAddColumn}>Add Column</Button>
        </TaskBoardToolbar>
      </TaskBoard>;
};

export default Board
