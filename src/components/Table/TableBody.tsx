/* eslint-disable import/named */
import { nanoid } from '@reduxjs/toolkit';

import { TableComponentProps, Tbody } from '.';
import { TableRow } from './TableRow';

interface TableBodyProps<T> {
  content: T;
  editElement: JSX.Element;
  editTitle: string;
  updateLink?: boolean;
}

export function TableBody({
  content,
  editElement,
  editTitle,
  updateLink,
}: TableBodyProps<TableComponentProps['content']>) {
  return (
    <Tbody>
      {content.map(({ value, id, checked, onCheckedChange }) => (
        <TableRow
          key={nanoid()}
          id={id}
          value={value}
          checked={checked}
          onCheckedChange={onCheckedChange}
          editElement={editElement}
          editTitle={editTitle}
          updateLink={updateLink}
        />
      ))}
    </Tbody>
  );
}

TableBody.defaultProps = {
  updateLink: false,
};
