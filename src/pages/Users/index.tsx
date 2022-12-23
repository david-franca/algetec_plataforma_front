import { CheckedState } from '@radix-ui/react-checkbox';
import { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Navigate } from 'react-router-dom';

import { DashboardComponent, Stack } from '../../components';
import { DropdownMenuProps } from '../../components/DropdownMenu';
import { TableComponent, TableComponentProps } from '../../components/Table';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import {
  addManyToUsersCart,
  addToUsersCart,
  clearUsersCart,
  removeFromUsersCart,
} from '../../config/reducers/cartSlice';
import { handleStringDate } from '../../helpers';
import { useGetUsersQuery } from '../../services/user.service';
import CreateUserPage from './Create';
import { EditUser } from './Edit';

export function UsersPage() {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { users: usersCart } = useAppSelector((state) => state.cart);
  const { data: usersData, isLoading } = useGetUsersQuery();
  const [closeDialog, setCloseDialog] = useState(false);

  const dispatch = useAppDispatch();

  const captions = ['', 'ID', 'Nome', 'Email', 'Criação', 'Atualização', 'Nível de Acesso', 'Equipe'];

  const content = useMemo<TableComponentProps['content']>(
    () =>
      usersData
        ? usersData.map((user) => ({
            id: user.id,
            value: [
              user.id.toString(),
              user.name,
              user.email,
              handleStringDate(user.created_at),
              handleStringDate(user.updated_at),
              user.role.name,
              user.department.name,
            ],
            checked: !!usersCart.find((cartUser) => cartUser.id === user.id),
            onCheckedChange: (checked: CheckedState) =>
              checked === true ? dispatch(addToUsersCart(user)) : dispatch(removeFromUsersCart(user)),
          }))
        : [],
    [usersData, usersCart],
  );

  const exportHeaders = useMemo(
    () => [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
      { label: 'Nível de Acesso', key: 'role.name' },
      { label: 'Equipe', key: 'department.name' },
    ],
    [],
  );

  const exportData = useMemo(() => {
    const data = usersData
      ? usersData.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: handleStringDate(user.created_at),
          updated_at: handleStringDate(user.updated_at),
          'role.name': user.role.name,
          'department.name': user.department.name,
        }))
      : [];

    return data;
  }, [usersData]);

  const menu = useMemo<DropdownMenuProps[]>(
    () => [
      {
        label: 'Seleção',
        content: [
          {
            label: 'Selecionar tudo',
            value: 'all',
            onClick: () => dispatch(addManyToUsersCart(usersData || [])),
          },
          {
            label: 'Limpar seleção',
            value: 'none',
            onClick: () => dispatch(clearUsersCart()),
          },
          {
            label: (
              <CSVLink headers={exportHeaders} data={exportData}>
                <span>Exportar Usuários</span>
              </CSVLink>
            ),
            value: 'export',
          },
        ],
      },
    ],
    [usersData, exportData, exportHeaders],
  );

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardComponent isLoading={isLoading}>
      <Stack
        css={{
          gap: '$sm',
          width: '100%',
        }}
      >
        <TableComponent
          title="Usuários"
          captions={captions}
          content={content}
          menu={menu}
          closeDialog={closeDialog}
          createElement={<CreateUserPage onClose={setCloseDialog} />}
          editElement={<EditUser onClose={setCloseDialog} id={1} />}
          editTitle="Editar Usuário"
        />
      </Stack>
    </DashboardComponent>
  );
}
