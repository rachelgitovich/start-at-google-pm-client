import { Button } from '@progress/kendo-react-buttons';
import React from 'react';
export const PreviewDialog = (props) => {
  return (
    <div className='k-taskboard-pane k-taskboard-preview-pane'>
      <div className='k-taskboard-pane-header'>
        <div className='k-taskboard-pane-header-text'>{props.title}</div>
        <span className='k-spacer' />
        <div className='k-taskboard-pane-header-actions'>
          <Button
            icon='close'
            fillMode='flat'
            onClick={props.onClosePreviewPane}
          />
        </div>
      </div>

      <div className='k-taskboard-pane-content'>
        <p>{props.description}</p>
        <p>
          {props.priorityLabel}
          &nbsp;
          {props.priority}
        </p>
        <p>Type: {props.type}</p>
        <p>Status: {props.status}</p>
        {props.assignedTo && <p>Assigned to: {props.assignedTo}</p>}
        {props.DueDate && <p>Due Date: {props.DueDate}</p>}
      </div>

      <div className='k-taskboard-pane-actions k-actions k-hstack k-justify-content-end'>
        <Button onClick={props.onTaskDelete}>{props.delete}</Button>
        <Button themeColor={'primary'} onClick={props.onTaskEdit}>
          {props.edit}
        </Button>
      </div>
    </div>
  );
};
