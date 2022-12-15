import * as React from 'react';
import { TaskBoardCard, TaskBoardCardHeader } from '@progress/kendo-react-taskboard';
import { CardBody } from '@progress/kendo-react-layout';
import { cards } from '../cards';
const CardHeaderComponent = props => {
  return <TaskBoardCardHeader {...props} title={props.task.title} />;
};
const CardBodyComponent = props => {
  return <CardBody>
    <div>{props.task.description}</div>
      </CardBody>;
};
export const Card = props => {
  return <TaskBoardCard {...props} cardHeader={CardHeaderComponent} cardBody={CardBodyComponent} />;
};