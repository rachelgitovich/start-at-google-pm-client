import { Button } from '@progress/kendo-react-buttons';
import { classNames } from '@progress/kendo-react-common';
import { Badge, BadgeContainer } from '@progress/kendo-react-indicators';
import { Input } from '@progress/kendo-react-inputs';
import { TaskBoardColumn } from '@progress/kendo-react-taskboard';
import React, { useState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import TaskEditDialog from './TaskEditDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
const colors = ['primary', 'secondary', 'warning', 'info', 'success', 'dark'];

const ColumnHeader = (props) => {
  const { edit, title } = props.column;
  const [themeColor, setThemeColor] = useState(
    colors[Math.floor(Math.random() * colors.length)]
  );
  const [status, setStatus] = useLocalStorageState('status', {
    defaultValue: props.column.status,
  });
  const [permission, setPermission] = useLocalStorageState('permission', {
    defaultValue: '',
  });
  const addItem = () => {
    setStatus(props.column.title);
    props.onShowAddCardDialog();
  };
  return (
    <div className={'k-taskboard-column-header'}>
      <div className={'k-taskboard-column-header-text k-text-ellipsis'}>
        {edit ? (
          <Input
            value={title}
            onChange={props.onTitleChange}
            onBlur={props.onColumnExitEdit}
            autoFocus={true}
          />
        ) : (
          <>
            <BadgeContainer
              style={{
                left: '12px',
                top: '-4px',
              }}
            >
              <Badge
                themeColor={themeColor}
                style={{
                  zIndex: 0,
                }}
              >
                {props.tasks && props.tasks.length}
              </Badge>
            </BadgeContainer>
            <span
              style={{
                marginLeft: '30px',
              }}
            >
              {title}
            </span>
          </>
        )}
      </div>
      <span className={'k-spacer'} />
      <div
        className={classNames('k-taskboard-column-header-actions', {
          'k-disabled': edit,
        })}
      >
        {(permission === 'ADMIN'||permission==='LEADER')&&<Button
          fillMode='flat'
          icon='add'
          title={props.addButtonTitle}
          onClick={addItem}
        />}
        {permission === 'ADMIN' && (
          <Button
            fillMode='flat'
            icon='close'
            title={props.closeButtonTitle}
            onClick={props.onColumnDelete}
          />
        )}
      </div>
    </div>
  );
};
export const Column = (props) => {
  return (
    <>
      <TaskBoardColumn {...props} header={ColumnHeader} />
      {props.showEditCard && props.editedTask && (
        <props.editCardDialog
          onClose={props.onCloseDialog}
          onSave={props.onSave}
          task={props.editedTask}
          priorities={props.priorities}
          editPane={TaskEditDialog}
        />
      )}

      {props.showAddCard && (
        <props.addCardDialog
          {...props}
          onClose={props.onCloseDialog}
          onSave={props.onTaskCreate}
          priorities={props.priorities}
          editPane={TaskEditDialog}
        />
      )}

      {props.showColumnConfirmDelete && (
        <ConfirmDeleteDialog
          onClose={props.onColumnDelete}
          onConfirm={props.onColumnConfirmDelete}
          dialogMessage={props.confirmDialogMessage}
          dialogTitle={props.confirmDialogTitle}
          dialogConfirmButton={props.confirmDialogConfirmButton}
          dialogCancelButton={props.confirmDialogCancelButton}
        />
      )}
    </>
  );
};
