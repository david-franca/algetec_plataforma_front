import { CheckedState } from '@radix-ui/react-checkbox';
import { useMemo } from 'react';
import { CSVLink } from 'react-csv';

import { DashboardComponent, Stack } from '../../components';
import { StyledLink } from '../../components/Dashboard/styles';
import { DropdownMenuProps } from '../../components/DropdownMenu';
import { Content, TableComponent } from '../../components/Table';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import {
  addManyToDemandsCart,
  addToDemandsCart,
  clearDemandsCart,
  removeFromDemandsCart,
} from '../../config/reducers/cartSlice';
import { handleStringDate } from '../../helpers';
import { useGetDemandsQuery } from '../../services/demands.service';
import CreateDemandPage from './Create';
import { EditDemandPage } from './Edit';

export function DemandPage() {
  const { demands: demandCart } = useAppSelector((state) => state.cart);
  const { data: demandsData, isLoading } = useGetDemandsQuery();

  const dispatch = useAppDispatch();

  const captions = useMemo<Array<{ caption: string; tooltip?: string }>>(
    () => [
      { caption: '' },
      { caption: 'ID', tooltip: 'Identificador' },
      { caption: 'Experimento' },
      { caption: 'Cliente' },
      { caption: 'Status' },
      { caption: 'R', tooltip: 'Roteirização' },
      { caption: 'M', tooltip: 'Modelagem' },
      { caption: 'P', tooltip: 'Programação' },
      { caption: 'T', tooltip: 'Testes' },
      { caption: 'U', tooltip: 'UALAB' },
      { caption: 'Data de Criação' },
      { caption: 'Última Atualização' },
      { caption: '' },
    ],
    [],
  );

  const content = useMemo<Content[]>(
    () =>
      demandsData
        ? demandsData.map((demand) => ({
            id: demand.id,
            value: [
              demand.id.toString(),
              <StyledLink to={`/dashboard/production/${demand.id}`}>{demand.experiments.name}</StyledLink>,
              demand.institutions.name,
              demand.status,
              demand.scripting,
              demand.modeling,
              demand.coding,
              demand.testing,
              demand.ualab,
              handleStringDate(demand.created_at),
              handleStringDate(demand.updated_at),
            ],
            checked: !!demandCart.find((cartDemand) => cartDemand.id === demand.id),
            onCheckedChange: (checked: CheckedState) =>
              checked === true ? dispatch(addToDemandsCart(demand)) : dispatch(removeFromDemandsCart(demand)),
          }))
        : [],
    [demandsData, demandCart],
  );

  const exportData = useMemo(() => {
    const data = demandCart.map((demand) => ({
      id: demand.id,
      institution_id: demand.institution_id,
      experiment_id: demand.experiment_id,
      status: demand.status,
      created_at: demand.created_at,
      updated_at: demand.updated_at,
    }));

    return data;
  }, [demandCart]);

  const exportHeaders = useMemo(() => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'ID da Instituição', key: 'institution_id' },
      { label: 'ID do Experimento', key: 'experiment_id' },
      { label: 'Status', key: 'status' },
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
            onClick: () => dispatch(addManyToDemandsCart(demandsData || [])),
          },
          {
            label: 'Limpar seleção',
            value: 'none',
            onClick: () => dispatch(clearDemandsCart()),
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
    [demandsData, exportData, exportHeaders],
  );

  return (
    <DashboardComponent isLoading={isLoading}>
      <Stack
        css={{
          width: '100%',
        }}
      >
        <TableComponent
          title="Entregas"
          captions={captions}
          content={content}
          menu={menu}
          closeDialog={false}
          create={{
            element: <CreateDemandPage />,
            link: true,
            subject: 'Demand',
          }}
          editElement={<EditDemandPage />}
          editTitle="Editar Entrega"
          updateLink
        />
      </Stack>
    </DashboardComponent>
  );
}
