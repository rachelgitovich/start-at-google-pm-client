import { CardBody } from '@progress/kendo-react-layout';
import {
  TaskBoardCard,
  TaskBoardCardHeader,
} from '@progress/kendo-react-taskboard';
import React, { useState } from 'react';
import { PreviewDialog } from './PreviewDialog';
import TaskEditDialog from './TaskEditDialog';
import useLocalStorageState from 'use-local-storage-state';
const CardHeaderComponent = (props) => {
  const [permission, setPermission] = useLocalStorageState('permission', {
    defaultValue: '',
  });
  console.log("card header", props)
  const menuItems=permission=='LEADER'||permission=='USER'?[props.menuItems[0]]:props.menuItems;
  return <TaskBoardCardHeader {...props} menuItems={menuItems} title={props.task.title} />;
};
const CardBodyComponent = (props) => {
  return (
    <CardBody>
      <div>{props.task.description}</div>
    </CardBody>
  );
};
export const Card = (props) => {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <>
      <TaskBoardCard
        {...props}
        cardHeader={CardHeaderComponent}
        cardBody={CardBodyComponent}
        previewDialogEdit={TaskEditDialog}
        onTaskEdit={() => setShowEdit(true)}
      />
      {props.showTaskPreviewPane && (
        <PreviewDialog
          title={props.task.title}
          description={props.task.description}
          status={props.task.status}
          assignedTo={props.task.assignedTo}
          type={props.task.type}
          comments={props.task.comments}
          creator={props.task.creatorId}
          dueDate={props.task.dueDate}
          priorityLabel={props.previewDialogPriorityLabel}
          delete={props.previewDialogDelete}
          edit={props.previewDialogEdit}
          onClosePreviewPane={props.onClosePreviewPane}
          onTaskDelete={props.onTaskDelete}
          onTaskEdit={props.onTaskEdit}
          priority={props.task.priority}
        />
      )}
      {showEdit && <TaskEditDialog />}
    </>
  );
};
