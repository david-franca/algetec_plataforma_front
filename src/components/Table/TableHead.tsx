import { InfoCircledIcon } from '@radix-ui/react-icons';
import { nanoid } from '@reduxjs/toolkit';

import { Th, Thead } from '.';
import { Box } from '../box';
import { Tooltip } from '../Tooltip';

interface TableHeadProps {
  captions: Array<{ caption: string; tooltip?: string }>;
}

export function TableHead({ captions }: TableHeadProps) {
  return (
    <Thead>
      <tr>
        {captions.map((caption) =>
          caption.tooltip ? (
            <Tooltip key={nanoid()} label={caption.tooltip}>
              <Th>
                <Box
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '$xs',
                  }}
                >
                  {caption.caption} <InfoCircledIcon />
                </Box>
              </Th>
            </Tooltip>
          ) : (
            <Th key={nanoid()}>{caption.caption}</Th>
          ),
        )}
      </tr>
    </Thead>
  );
}
