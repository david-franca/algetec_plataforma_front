import { useEffect, useMemo, useState } from 'react';

import { DashboardComponent, Flex, Grid, Inline, Stack, Title } from '../../components';
import { Card } from '../../components/Card';
import { LineChart } from '../../components/Chart';
import { Select } from '../../components/Select';
import { User } from '../../models';
import { Demand, IDemand, TeamLog } from '../../models/demands.model';
import { useGetDemandsQuery } from '../../services/demands.service';
import { useGetUsersQuery } from '../../services/user.service';
import { Text } from './styles';

type SelectOption = {
  label: string;
  value: string;
};

export function Dashboard() {
  const [select, setSelect] = useState('issues');
  const { data: demandsData } = useGetDemandsQuery();
  const { data: usersData } = useGetUsersQuery();

  const [users, setUsers] = useState<User[]>([]);
  const [issues, setIssues] = useState<IDemand[]>([]);

  const [items1, setItems1] = useState<SelectOption[]>([]);
  const [items2, setItems2] = useState<SelectOption[]>([]);

  const [select1, setSelect1] = useState<string | undefined>(undefined);
  const [select2, setSelect2] = useState<string | undefined>(undefined);

  const [categories, setCategories] = useState<string[]>([]);

  const selectItems: SelectOption[] = useMemo(
    () => [
      {
        label: 'Entregas',
        value: 'issues',
      },
      {
        label: 'Usuários',
        value: 'users',
      },
      {
        label: 'Equipes',
        value: 'teams',
      },
    ],
    [],
  );

  const teamsItems: SelectOption[] = useMemo(
    () => [
      {
        label: 'Todas as Equipes',
        value: 'all',
      },
      {
        label: 'Roteirização',
        value: 'Scripting',
      },
      {
        label: 'Modelos',
        value: 'Modeling',
      },
      {
        label: 'Programação',
        value: 'Coding',
      },
      {
        label: 'Testes',
        value: 'Testing',
      },
      {
        label: 'UALAB',
        value: 'Ualab',
      },
    ],
    [],
  );
  const generateNumberArray = (length: number) =>
    Array(length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 100));

  const series = useMemo(() => {
    const seriesRaw = [];

    if (select === 'issues') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [],
        },
        ...issues.map((issue) => ({
          name: issue.experiments.name,
          data: [],
        })),
      );
    }
    if (select === 'users') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [100, 80, 60, 40, 20],
        },
        ...users.map((user) => ({
          name: user.name,
          data: generateNumberArray(5),
        })),
      );
    }
    if (select === 'teams') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [],
        },
        ...teamsItems.slice(1).map((team) => ({
          name: team.label,
          data: [],
        })),
      );
    }
    if (select1 !== 'none' && select !== 'issues') {
      const filteredSeries = seriesRaw.filter((serie) => serie.name === select1);
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [100, 80, 60, 40, 20],
        },
        ...filteredSeries,
      );
    }
    if (select === 'issues' && select1 !== 'all' && select2 !== 'all') {
      const filteredIssue = issues.find((issue) => issue.experiments.id === Number(select1));

      if (!filteredIssue) return seriesRaw;

      const demand = new Demand(filteredIssue);
      const dashboard = demand.toDashboard(select2 as TeamLog);
      const idealDates = dashboard.map(({ date }) => date);

      setCategories(idealDates);
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: dashboard.map(({ ideal }) => ideal),
        },
        {
          name: 'Real',
          data: dashboard.map(({ real }) => real),
        },
      );
    }
    return seriesRaw;
  }, [select, select1, select2, issues, users, teamsItems]);

  useEffect(() => {
    if (demandsData) {
      setIssues(demandsData);
    }
  }, [demandsData]);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    if (select === 'issues') {
      setItems1([
        {
          label: 'Todas as Entregas',
          value: 'all',
        },
        ...issues.map((issue) => ({
          label: `${issue.experiments.id} - ${issue.experiments.name}`,
          value: issue.experiments.id.toString(),
        })),
      ]);
      setItems2(teamsItems);
      setSelect1('all');
      setSelect2('all');
    }
    if (select === 'users') {
      setSelect1('none');
      setSelect2('all');
      setItems1([
        {
          label: 'Selecione um Usuário',
          value: 'none',
        },
        ...users.map((user) => ({
          label: user.name,
          value: user.name,
        })),
      ]);
      setItems2([
        {
          label: 'Todas as Entregas',
          value: 'all',
        },
        ...issues.map((issue) => ({
          label: issue.experiments.name,
          value: issue.experiments.name,
        })),
      ]);
    }
    if (select === 'teams') {
      setSelect1('none');
      setSelect2('all');
      const teams = [];
      teams.push(
        {
          label: 'Selecione uma Equipe',
          value: 'none',
        },
        ...teamsItems.slice(1),
      );
      setItems1(teams);
      setItems2([
        {
          label: 'Todas as Entregas',
          value: 'all',
        },
        ...issues.map((issue) => ({
          label: issue.experiments.name,
          value: issue.experiments.name,
        })),
      ]);
    }
  }, [select, issues, users, teamsItems]);

  useEffect(() => {
    //
  }, []);

  return (
    <DashboardComponent>
      <Stack
        css={{
          width: '100%',
        }}
      >
        <Flex>
          <Text css={{ marginLeft: 0 }} size="large">
            Velocidade de Produção
          </Text>
        </Flex>
        <Inline css={{ gap: '$md', marginBottom: '$md' }}>
          <Select items={selectItems} value={select} onValueChange={setSelect} />
          <Select items={items1} value={select1} onValueChange={setSelect1} />
          {select1 !== 'none' && <Select items={items2} value={select2} onValueChange={setSelect2} />}
        </Inline>
        <Grid
          css={{
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: '$md',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Card
            css={{
              gridArea: '1 / 1 / 5 / 5',
              width: 'auto',
              height: '100%',
            }}
          >
            <LineChart text="Trabalho Restante (%)" series={series} categories={categories} />
          </Card>

          <Card
            css={{
              gridArea: '1 / 5 / 3 / 6',
              width: 'auto',
              height: '100%',
              alignItems: 'start',
              justifyContent: 'start',
            }}
          >
            <Text css={{ marginLeft: 0 }}>Velocidade Ideal</Text>
            <Title>{Math.floor(Math.random() * 100)} %/dia</Title>
          </Card>
          <Card
            css={{
              gridArea: '3 / 5 / 5 / 6',
              width: 'auto',
              height: '100%',
              alignItems: 'start',
              justifyContent: 'start',
            }}
          >
            <Text css={{ marginLeft: 0 }}>Velocidade Média</Text>
            <Title>{Math.floor(Math.random() * 100)} %/dia</Title>
          </Card>
        </Grid>
      </Stack>
    </DashboardComponent>
  );
}
// Ideal é 100% dividido pelo número de dias
// Real é o cálculo de cada demanda
