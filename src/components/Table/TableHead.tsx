import { nanoid } from '@reduxjs/toolkit';

import { Th, Thead } from '.';

interface TableHeadProps {
  captions: string[];
}

export function TableHead({ captions }: TableHeadProps) {
  return (
    <Thead>
      <tr>
        {captions.map((caption) => (
          <Th key={nanoid()}>{caption}</Th>
        ))}
      </tr>
    </Thead>
  );
}
