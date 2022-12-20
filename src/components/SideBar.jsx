import { Drawer } from '@progress/kendo-react-layout';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [expanded, setExpanded] = useState(true);
  const sidebarWidth = 250;

  const items = [
    {
      text: 'Board1',
      selected: true,
      route: '/boards/1',
      id:1
    },
    {
      text: 'Board2',
      route: '/boards/2',
      selected: false,
      id:2
    },
    {
      text: 'Board3',
      selected: false,
      route: '/boards/3',
      id:3
    }
  ];
  const onSelect=(e)=>{
    navigate(e.itemTarget.props.route)
  }
  return (
    <Drawer
    onSelect={onSelect}
      expanded={true}
      position={'start'}
      mode={'push'}
      width={220}
      items={items.map((item) => ({
        ...item,
        selected: item.id==boardId,
      }))}
    />
     
   
  );
};

export default Sidebar;
