import React from 'react';
import { getRoomList } from '../api/api';

interface ListItem {
  id: number;
  text: string;
}

interface ListProps {
  items: ListItem[];
}

const List: React.FC<ListProps> = ({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
};

export default List;