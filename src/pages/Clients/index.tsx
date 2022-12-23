import { CheckedState } from '@radix-ui/react-checkbox';
import { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Navigate } from 'react-router-dom';

import { DashboardComponent, Stack } from '../../components';
import { DropdownMenuProps } from '../../components/DropdownMenu';
import { Content, TableComponent } from '../../components/Table';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import {
  addManyToInstitutionsCart,
  addToInstitutionsCart,
  clearInstitutionsCart,
  removeFromInstitutionsCart,
} from '../../config/reducers/institutionSlice';
import { handleStringDate } from '../../helpers';
import { useGetInstitutionsQuery } from '../../services/institution.service';
import { CreateInstitution } from './Create';
import { EditClient } from './Edit';

export function ClientsPage() {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { institutions: institutionsCart } = useAppSelector((state) => state.institution);
  const { data: institutionsData, isLoading } = useGetInstitutionsQuery();
  const [closeDialog, setCloseDialog] = useState(false);
  const dispatch = useAppDispatch();

  const captions = useMemo(() => ['', 'ID', 'Nome', 'Criado em', 'Atualizado em'], []);

  const content = useMemo<Content[]>(
    () =>
      institutionsData
        ? institutionsData.map((institution) => ({
            id: institution.id,
            value: [
              institution.id.toString(),
              institution.name,
              handleStringDate(institution.created_at),
              handleStringDate(institution.updated_at),
            ],

            checked: !!institutionsCart.find((cartInstitution) => cartInstitution.id === institution.id),
            onCheckedChange: (checked: CheckedState) =>
              checked === true
                ? dispatch(addToInstitutionsCart(institution))
                : dispatch(removeFromInstitutionsCart(institution)),
          }))
        : [],
    [institutionsData, institutionsCart],
  );

  const exportData = useMemo(() => {
    const data = institutionsCart.map((institution) => ({
      id: institution.id,
      name: institution.name,
      created_at: handleStringDate(institution.created_at),
      updated_at: handleStringDate(institution.updated_at),
    }));
    return data;
  }, [institutionsCart]);

  const exportHeaders = useMemo(() => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'name' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
    ];
    return headers;
  }, []);

  const menu = useMemo<DropdownMenuProps[]>(
    () => [
      {
        label: 'Seleção',
        content: [
          {
            label: 'Selecionar tudo',
            value: 'all',
            onClick: () => dispatch(addManyToInstitutionsCart(institutionsData || [])),
          },
          {
            label: 'Limpar seleção',
            value: 'none',
            onClick: () => dispatch(clearInstitutionsCart()),
          },
          {
            label: (
              <CSVLink headers={exportHeaders} data={exportData}>
                <span>Exportar Laboratórios</span>
              </CSVLink>
            ),
            value: 'export',
          },
        ],
      },
    ],
    [institutionsData, exportData, exportHeaders],
  );

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <DashboardComponent isLoading={isLoading}>
      <Stack
        css={{
          width: '100%',
        }}
      >
        <TableComponent
          title="Instituições"
          captions={captions}
          content={content}
          menu={menu}
          closeDialog={closeDialog}
          createElement={<CreateInstitution onClose={setCloseDialog} />}
          editElement={<EditClient id={1} onClose={setCloseDialog} />}
          editTitle="Editar Instituição"
        />
      </Stack>
    </DashboardComponent>
  );
}
