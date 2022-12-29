import {
  Avatar,
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from '@progress/kendo-react-layout';
import React from 'react';

export default function Comment(props) {
  return (
    <div key={props.dataItem.id}>
      <Card
        style={{
          width: 260,
          boxShadow: '0 0 4px 0 rgba(0, 0, 0, .1)',
          marginTop: '15px',
        }}
      >
        <CardHeader
          className='k-hbox'
          style={{
            background: 'transparent',
          }}
        >
          <Avatar
            type='text'
            shape='circle'
            size='small'
            style={{ color: 'white' }}
          >
            <span>{props.dataItem.user.email[0].toUpperCase()}</span>
          </Avatar>
          <div>
            <CardTitle style={{ marginBottom: '4px' }}>
              {props.dataItem.user.email}
            </CardTitle>
            <CardSubtitle>
              <p>{props.dataItem.content}</p>
            </CardSubtitle>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
  return <div></div>;
}
