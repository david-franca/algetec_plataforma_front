import { CheckedState } from '@radix-ui/react-checkbox';
import { PlusIcon } from '@radix-ui/react-icons';
import { nanoid } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { styled } from '../../config/styles/stitches.config';
import { Box, Center, Flex } from '../box';
import { Button } from '../button';
import { Card } from '../Card';
import { StyledLink } from '../Dashboard/styles';
import { Dialog } from '../Dialog';
import { DropdownMenu, DropdownMenuProps } from '../DropdownMenu';
import { ScrollArea } from '../ScrollArea';
import { Separator } from '../Separator';
import { Title } from '../text';
import { Tooltip } from '../Tooltip';
import { TableBody } from './TableBody';
import { TableHead } from './TableHead';

export const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  borderRadius: '$sm',

  '&::-webkit-scrollbar': {
    width: '0.5rem',
    height: '0.5rem',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '$violet1',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '$violet5',
    borderRadius: '1rem',
  },
});

export const Thead = styled('thead', {
  backgroundColor: '$gray1',
});

export const Tbody = styled('tbody', {
  backgroundColor: '$violet1',
});

export const Tr = styled('tr', {
  '&:nth-child(odd)': {
    backgroundColor: '$violet3',
  },

  '&:nth-child(even)': {
    backgroundColor: '$violet4',
  },

  '&:hover': {
    backgroundColor: '$violet6',
  },
});

export const Th = styled('th', {
  padding: '$xs',
  textAlign: 'start',
});

export const Td = styled('td', {
  padding: '$xs',
  textAlign: 'start',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: '150px',
});

export interface Content {
  value: Array<string | number | JSX.Element | JSX.Element[] | null>;
  id: number;
  checked: boolean;
  onCheckedChange: (checked: CheckedState) => void;
}

export interface TableComponentProps {
  title: string;
  captions: string[];
  content: Content[];
  menu?: DropdownMenuProps[];
  createElement: ReactNode;
  closeDialog: boolean;
  editElement: JSX.Element;
  editTitle: string;
  createLink?: boolean;
  updateLink?: boolean;
}

export function TableComponent({
  title,
  content,
  captions,
  menu,
  createElement,
  closeDialog,
  editElement,
  editTitle,
  createLink,
  updateLink,
}: TableComponentProps) {
  const { pathname } = useLocation();
  return (
    <Card
      css={{
        width: '100%',
      }}
    >
      <Center
        css={{
          justifyContent: 'space-between',
          width: '100%',
          paddingBottom: '$sm',
        }}
      >
        <Title size="extraLarge">{title}</Title>
        <Flex
          css={{
            gap: '$sm',
          }}
        >
          {createLink ? (
            <Tooltip label="Adicionar">
              <Button color="grass">
                <StyledLink to={`${pathname}/create`}>
                  <PlusIcon />
                </StyledLink>
              </Button>
            </Tooltip>
          ) : (
            <Dialog title={`Adicionar ${title}`} element={createElement} close={closeDialog}>
              <Button color="grass">
                <Tooltip label="Adicionar">
                  <PlusIcon />
                </Tooltip>
              </Button>
            </Dialog>
          )}
        </Flex>
      </Center>
      <Box
        css={{
          width: '100%',
          display: menu ? 'flex' : 'none',
          justifyContent: 'flex-start',
        }}
      >
        {menu
          ? menu.map(({ content, label }) => <DropdownMenu content={content} label={label} key={nanoid()} />)
          : null}
      </Box>
      {menu ? <Separator /> : null}
      <ScrollArea>
        <Table>
          <TableHead captions={captions} />
          <TableBody content={content} editElement={editElement} editTitle={editTitle} updateLink={updateLink} />
        </Table>
      </ScrollArea>
    </Card>
  );
}

TableComponent.defaultProps = {
  menu: [],
  createLink: false,
  updateLink: false,
};
