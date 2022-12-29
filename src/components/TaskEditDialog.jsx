import { Button } from '@progress/kendo-react-buttons';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { FieldWrapper } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Label } from '@progress/kendo-react-labels';
import { ListView } from '@progress/kendo-react-listview';
import React, { useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useParams } from 'react-router-dom';
import Comment from './Comment';

export default function TaskEditDialog(props) {
  const { boardId } = useParams();
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [priority, setPriority] = useState(props.priority);
  const [assignTo, setAssignTo] = useState(props.task?.assignedTo);
  const [boardUsers, setBoardUsers] = useState([]);
  const [type, setType] = useState(props.task?.type);
  const [types, setTypes] = useLocalStorageState('types', {
    defaultValue: [],
  });
  const [dueDate, setDueDate] = useState(
    props.task ? new Date(props.task.dueDate) : null
  );
  const [comment, setComment] = useState('');
  const [openEditor, setOpenEditor] = useState(false);
  const [statuses, setStatuses] = useLocalStorageState('statuses', {
    defaultValue: [],
  });
  const [comments, setComments] = useState(props.task?.comments);
  const [tasks, setTasks] = useLocalStorageState('tasks', {
    defaultValue: [],
  });
  const [status, setStatus] = useLocalStorageState('status', {
    defaultValue: '',
  });
  const [users, setUsers] = useLocalStorageState('users', {
    defaultValue: [],
  });
  const [subTasks, setSubTasks] = useState([]);
  const [priorities, setPriorities] = useState(props.priorities);
  useEffect(() => {
    if (props.task) {
      let requestOptions = {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        redirect: 'follow',
      };
      fetch(
        `http://localhost:8080/api/v1/item/${props.task.id}/get/subitems`,
        requestOptions
      )
        .then((response) => {
          if (response.ok) {
            response.json().then((result) => setSubTasks(result.data));
          } else {
            response.json().then((result) => alert(result.message));
          }
        })
        .catch((error) => console.log('error', error));
    }
  }, []);

  const createOrUpdateItem = (event) => {
    if (props.saveButton === 'Create') {
      createItem(event);
    }
    if (props.saveButton === 'Save changes') {
      updateItem(event);
    }
  };
  const updateItem = (event) => {
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        id: props.task.id,
        boardId: boardId,
        type: type,
        status: props.task.status,
        assignedToId: assignTo,
        dueDate: dueDate,
        importance: priority.priority,
        title: title,
        description: description,
        subItems: subTasks.map((t) => t.id),
      }),
      redirect: 'follow',
    };
    fetch(`http://localhost:8080/api/v1/item/update`, requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            const newTask = result.data;
            let oldTasks = [...tasks];
            oldTasks = oldTasks.map((t) =>
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
            setTasks([...oldTasks]);
            props.onClose();
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  const createItem = () => {
    let requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        type: type,
        status: status,
        boardId: boardId,
        parentItem: null,
        assignedToEmail: assignTo,
        dueDate: dueDate,
        importance: priority.priority,
        title: title,
        description: description,
        subItems: subTasks.map((t) => t.id),
      }),
      redirect: 'follow',
    };
    fetch(`http://localhost:8080/api/v1/item/create`, requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            let oldTasks = [...tasks];
            oldTasks.push({
              id: result.data.id,
              title: result.data.title,
              description: result.data.description,
              status: status,
              priority: priorities.find(
                (p) => p.priority == result.data.importance
              ),
              type: result.data.type,
              assignedTo: result.data.assignedTo,
              comments: result.data.comments,
              creatorId: result.data.creator.id,
              dueDate: result.data.dueDate,
            });
            setTasks([...oldTasks]);
            props.onClose();
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };

  const addComment = () => {
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({
        itemId: props.task.id,
        comment: comment,
      }),
      redirect: 'follow',
    };
    fetch('http://localhost:8080/api/v1/item/comment/add', requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            const updatedTasks = tasks.map((t) =>
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
            setComment('');
            setComments([...result.data.comments]);
            setTasks([...updatedTasks]);
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  const itemRender = (li, itemProps) => {
    const color = itemProps.dataItem.color;
    const itemChildren = (
      <>
        <span
          style={{
            backgroundColor: color,
          }}
        >
          &nbsp;
        </span>
        {li.props.children}
      </>
    );
    return React.cloneElement(li, li.props, itemChildren);
  };
  const valueRender = (element, value) => {
    if (!value) {
      return element;
    }
    const children = (
      <>
        <span
          style={{
            backgroundColor: value.color,
          }}
        >
          &nbsp;
        </span>
        <span>&nbsp; {element.props.children}</span>
      </>
    );
    return React.cloneElement(
      element,
      {
        ...element.props,
      },
      children
    );
  };
  return (
    <div className='k-taskboard-pane k-taskboard-edit-pane'>
      <div className='k-taskboard-pane-header'>
        <div className='k-taskboard-pane-header-text'>{props.header}</div>
        <span className='k-spacer' />
        <div className='k-taskboard-pane-header-actions'>
          <Button icon='close' fillMode='flat' onClick={props.onClose} />
        </div>
      </div>

      <div className='k-taskboard-pane-content'>
        <div role='form' data-role='form' className='k-form'>
          <FieldWrapper>
            <Label editorId={'title'}>{props.titleLabel}</Label>
            <Input
              id={'title'}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              title={props.titleInputTitle}
            />
          </FieldWrapper>

          <FieldWrapper>
            <Label editorId={'description'}>{props.descriptionLabel}</Label>
            <Input
              id={'description'}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              title={props.descriptionInputTitle}
            />
          </FieldWrapper>

          <FieldWrapper>
            <Label editorId={'priority'}>{props.priorityLabel}</Label>
            <DropDownList
              id={'priority'}
              data={priorities}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              textField='priority'
              dataItemKey='priority'
              itemRender={itemRender}
              valueRender={valueRender}
              title={props.priorityDropDownTitle}
            />
          </FieldWrapper>

          <FieldWrapper>
            <Label editorId={'assignTo'}>Assign To:</Label>
            <DropDownList
              id={'assignTo'}
              data={users}
              defaultItem={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              title='Assign To'
            />
          </FieldWrapper>
          <FieldWrapper>
            <Label editorId={'types'}>Type:</Label>

            <DropDownList
              id={'type'}
              data={types}
              value={type}
              onChange={(e) => setType(e.target.value)}
              title='Type'
            />
          </FieldWrapper>
          <FieldWrapper>
            <Label editorId={'subItems'}>Sub Items:</Label>
            <MultiSelect
              data={tasks.filter((t) => t.id !== props.task?.id)}
              textField='title'
              value={subTasks}
              onChange={(e) => setSubTasks([...e.value])}
            />
          </FieldWrapper>
          <FieldWrapper>
            <Label editorId={'dueDate'}>Due Date:</Label>
            <DatePicker
              defaultValue={dueDate}
              format='dd/MM/yyyy'
              onChange={(e) => setDueDate(e.value)}
            />
          </FieldWrapper>
          {props.task?.comments?.length > 0 && (
            <FieldWrapper>
              <Label editorId={'comments'}>Comments:</Label>
              <ListView
                data={comments}
                style={{
                  width: '100%',
                  height: 500,
                }}
                item={Comment}
              />
            </FieldWrapper>
          )}
        </div>
      </div>
      {props.task && (
        <div className='k-hbox' style={{ padding: '16px 16px 0' }}>
          <textarea
            className='k-textarea'
            placeholder='Comment...'
            style={{
              resize: 'none',
              borderRadius: 10,
              padding: 5,
              fontSize: 10,
            }}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <button
            className='k-button k-button-md k-rounded-md k-button-flat k-button-flat-primary'
            style={{ marginLeft: 10, borderRadius: 10 }}
            onClick={addComment}
          >
            Add Comment
          </button>
        </div>
      )}
      <div className='k-taskboard-pane-actions k-actions k-hstack k-justify-content-end'>
        <Button onClick={props.onClose}>{props.cancelButton}</Button>
        <Button
          themeColor={'primary'}
          onClick={createOrUpdateItem}
          disabled={!title || !description}
        >
          {props.saveButton}
        </Button>
      </div>
    </div>
  );
}
