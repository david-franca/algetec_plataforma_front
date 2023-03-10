import { amber, green, red } from '@radix-ui/colors';
import { nanoid } from '@reduxjs/toolkit';
import { useFormik } from 'formik';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SelectComponent from 'react-select';
import { toast } from 'react-toastify';

import { Button, Center, DashboardComponent, Inline, Title } from '../../components';
import { Card } from '../../components/Card';
import { DatePicker } from '../../components/Datepicker';
import { Form } from '../../components/Form';
import { Separator } from '../../components/Separator';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { Demand, DemandUpdateForm } from '../../models/demands.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import { useGetDemandByIdQuery, useGetExperimentsQuery, useUpdateDemandMutation } from '../../services/demands.service';
import { useGetInstitutionsQuery } from '../../services/institution.service';
import { useGetUsersQuery } from '../../services/user.service';
import { FormContainer, Input, Label } from '../Dashboard/styles';

type SelectOption = {
  label: string;
  value: string;
};

type ILabel = keyof Pick<
  DemandUpdateForm,
  'coding_developers' | 'modeling_developers' | 'ualab_developers' | 'testing_developers' | 'scripting_developers'
>;
type IValue = keyof Pick<DemandUpdateForm, 'coding' | 'ualab' | 'modeling' | 'testing' | 'scripting'>;

type IDate = keyof Pick<
  DemandUpdateForm,
  | 'coding_finishedAt'
  | 'ualab_finishedAt'
  | 'modeling_finishedAt'
  | 'testing_finishedAt'
  | 'scripting_finishedAt'
  | 'coding_startedAt'
  | 'ualab_startedAt'
  | 'modeling_startedAt'
  | 'testing_startedAt'
  | 'scripting_startedAt'
>;

type IDeadline = keyof Pick<
  DemandUpdateForm,
  'ualab_deadline' | 'coding_deadline' | 'testing_deadline' | 'modeling_deadline' | 'scripting_deadline'
>;

type IIndex = keyof Pick<
  DemandUpdateForm,
  'ualab_percent' | 'coding_percent' | 'testing_percent' | 'modeling_percent' | 'scripting_percent'
>;
interface ICardProps {
  title: string;
  options: {
    responsible: ILabel;
    progress: IValue;
    startedAt: IDate;
    finishedAt: IDate;
    loading: boolean;
    values: { value: number; label: string }[];
    deadline: IDeadline;
    percent: IIndex;
  };
}

export function EditDemandPage() {
  const params = useParams();
  const id = useMemo(() => (params.id ? Number(params.id) : 0), [params.id]);
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: demandData, isLoading } = useGetDemandByIdQuery(id, {
    skip: id === 0,
  });

  const { data: institutions, isLoading: institutionsLoading } = useGetInstitutionsQuery(undefined, {
    skip: !currentUser?.role.admin,
  });
  const { data: experiments, isLoading: experimentsLoading } = useGetExperimentsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery(undefined, {
    skip: !currentUser?.role.admin,
  });

  const [updateDemand, { isLoading: updateDemandLoading, isSuccess: updateDemandSuccess, isError: updateDemandError }] =
    useUpdateDemandMutation();

  const initialValues: DemandUpdateForm = {
    id,
    institution_id: 0,
    experiment_id: 0,
    status: DemandStatus.READY,
    logger_id: 0,
    coding_developers: [],
    modeling_developers: [],
    testing_developers: [],
    scripting_developers: [],
    ualab_developers: [],
    scripting: 0,
    coding: 0,
    testing: 0,
    modeling: 0,
    ualab: 0,
    coding_finishedAt: new Date(),
    coding_startedAt: new Date(),
    modeling_finishedAt: new Date(),
    modeling_startedAt: new Date(),
    scripting_finishedAt: new Date(),
    scripting_startedAt: new Date(),
    testing_finishedAt: new Date(),
    testing_startedAt: new Date(),
    ualab_finishedAt: new Date(),
    ualab_startedAt: new Date(),
    coding_deadline: 0,
    modeling_deadline: 0,
    scripting_deadline: 0,
    testing_deadline: 0,
    ualab_deadline: 0,
    coding_percent: 0,
    modeling_percent: 0,
    scripting_percent: 0,
    testing_percent: 0,
    ualab_percent: 0,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const post = Demand.toPut(values, currentUser ? currentUser.id : 0);
      updateDemand(post);
    },
  });
  const statusOptions = useMemo<SelectOption[]>(
    () => [
      { value: DemandStatus.DEVELOPMENT, label: 'Desenvolvimento' },
      { value: DemandStatus.CORRECTION, label: 'Corre????o' },
      { value: DemandStatus.READY, label: 'Pronto' },
      { value: DemandStatus.REVALIDATION, label: 'Revalida????o' },
      { value: DemandStatus.VALIDATION, label: 'Valida????o' },
    ],
    [DemandStatus],
  );
  const institutionOptions = useMemo<SelectOption[]>(
    () =>
      institutions
        ? [
            { value: '0', label: 'Selecione uma institui????o' },
            ...institutions.map((institution) => ({
              value: institution.id.toString(),
              label: institution.name,
            })),
          ]
        : [],
    [institutions],
  );
  const experimentOptions = useMemo<SelectOption[]>(
    () =>
      experiments
        ? experiments.map((experiment) => ({
            value: experiment.id.toString(),
            label: `${experiment.id} - ${experiment.name}`,
          }))
        : [],
    [experiments],
  );
  const selectComponentsStyles = useMemo(
    () => ({
      minHeight: 40,
      width: '100%',
      borderColor: 'inherit',
      border: '1px solid #aa99ec',
      padding: '0 10px',
      color: '#5746af',
    }),
    [],
  );
  const users = useMemo(() => {
    if (usersData) {
      return usersData.map((user) => ({
        value: user.id,
        label: user.name,
      }));
    }
    return [];
  }, [usersData]);

  const cardOptions = useMemo<ICardProps[]>(
    () => [
      {
        title: 'Programa????o',
        options: {
          responsible: 'coding_developers',
          progress: 'coding',
          finishedAt: 'coding_finishedAt',
          startedAt: 'coding_startedAt',
          loading: usersLoading,
          values: users,
          deadline: 'coding_deadline',
          percent: 'coding_percent',
        },
      },
      {
        title: 'Modelagem',
        options: {
          responsible: 'modeling_developers',
          progress: 'modeling',
          finishedAt: 'modeling_finishedAt',
          startedAt: 'modeling_startedAt',
          loading: usersLoading,
          values: users,
          deadline: 'modeling_deadline',
          percent: 'modeling_percent',
        },
      },
      {
        title: 'Testes',
        options: {
          responsible: 'testing_developers',
          progress: 'testing',
          finishedAt: 'testing_finishedAt',
          startedAt: 'testing_startedAt',
          loading: usersLoading,
          values: users,
          deadline: 'testing_deadline',
          percent: 'testing_percent',
        },
      },
      {
        title: 'Roteiriza????o',
        options: {
          responsible: 'scripting_developers',
          progress: 'scripting',
          finishedAt: 'scripting_finishedAt',
          startedAt: 'scripting_startedAt',
          loading: usersLoading,
          values: users,
          deadline: 'scripting_deadline',
          percent: 'scripting_percent',
        },
      },
      {
        title: 'UALAB',
        options: {
          responsible: 'ualab_developers',
          progress: 'ualab',
          finishedAt: 'ualab_finishedAt',
          startedAt: 'ualab_startedAt',
          loading: usersLoading,
          values: users,
          deadline: 'ualab_deadline',
          percent: 'ualab_percent',
        },
      },
    ],
    [usersLoading, users],
  );

  useEffect(() => {
    if (demandData && currentUser && id !== 0) {
      const demand = new Demand(demandData).toUpdate();
      formik.setValues({
        ...demand,
        id,
      });
    }
  }, [demandData, currentUser, id]);

  useEffect(() => {
    if (updateDemandSuccess) {
      toast.success('Demanda atualizada com sucesso!');
    }
    if (updateDemandError) {
      toast.error('Erro ao atualizar demanda!');
    }
  }, [updateDemandSuccess, updateDemandError]);

  return (
    <DashboardComponent isLoading={isLoading}>
      <Form
        noValidate
        onSubmit={formik.handleSubmit}
        css={{
          gap: '$md',
        }}
      >
        <Title size="extraLarge">Editar Entrega</Title>
        <Card
          css={{
            width: '100%',
            display: currentUser?.role.admin ? 'flex' : 'none',
          }}
        >
          <Title size="large">Informa????es da demanda</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              justifyContent: 'space-between',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="status">Status</Label>
              <SelectComponent
                placeholder="Selecione uma status"
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                    color: '#5746af',
                  }),
                }}
                options={statusOptions}
                onChange={(value) => {
                  formik.setFieldValue('status', value?.value);
                }}
                value={statusOptions.find((option) => option.value === formik.values.status)}
              />
            </FormContainer>

            <FormContainer>
              <Label htmlFor="institution_id">Institui????o</Label>
              <SelectComponent
                placeholder="Selecione uma Institui????o"
                isSearchable
                isDisabled={institutionsLoading}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                    color: '#5746af',
                  }),
                }}
                options={institutionOptions}
                onChange={(value) => {
                  formik.setFieldValue('institution_id', value?.value);
                }}
                value={institutionOptions.find((option) => option.value === formik.values.institution_id.toString())}
              />
            </FormContainer>

            <FormContainer>
              <Label htmlFor="experiment_id">Pr??tica</Label>
              <SelectComponent
                placeholder="Selecione uma Pr??tica"
                isSearchable
                isDisabled={experimentsLoading}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                    color: '#5746af',
                  }),
                }}
                options={experimentOptions}
                onChange={(value) => {
                  formik.setFieldValue('experiment_id', value?.value);
                }}
                value={experimentOptions.find((option) => option.value === formik.values.experiment_id.toString())}
              />
            </FormContainer>
          </Inline>
        </Card>

        {cardOptions.map(({ title, options }) => (
          <Card
            key={nanoid()}
            css={{
              width: '100%',
            }}
          >
            <Title size="large">{title}</Title>
            <Separator />
            <Inline
              css={{
                width: '100%',
                gap: '$md',
              }}
            >
              <FormContainer>
                <Label htmlFor={options.responsible}>Respons??veis</Label>
                <SelectComponent
                  placeholder="Selecione um respons??vel"
                  isMulti
                  isClearable
                  isSearchable
                  isDisabled={options.loading || !currentUser?.role.admin}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      ...selectComponentsStyles,
                    }),
                    container: (provided) => ({
                      ...provided,
                      width: '90%',
                      color: '#5746af',
                    }),
                  }}
                  options={options.values}
                  value={formik.values[options.responsible]}
                  onChange={(value) => {
                    formik.setFieldValue(options.responsible, value);
                  }}
                />
              </FormContainer>
              <FormContainer>
                <Label
                  css={{
                    color:
                      // eslint-disable-next-line no-nested-ternary
                      formik.values[options.progress] < formik.values[options.percent]
                        ? red.red11
                        : formik.values[options.progress] === formik.values[options.percent]
                        ? amber.amber11
                        : green.green11,
                  }}
                  htmlFor={options.progress}
                >
                  Progresso (ideal: {formik.values[options.percent]}%)
                </Label>
                <Input
                  css={{
                    color:
                      // eslint-disable-next-line no-nested-ternary
                      formik.values[options.progress] < formik.values[options.percent]
                        ? red.red11
                        : formik.values[options.progress] === formik.values[options.percent]
                        ? amber.amber11
                        : green.green11,
                  }}
                  type="number"
                  name={options.progress}
                  id={options.progress}
                  value={formik.values[options.progress]}
                  onChange={formik.handleChange}
                />
              </FormContainer>
              <FormContainer>
                <Label>Data de Inicio</Label>
                <DatePicker
                  id={options.startedAt}
                  disabled
                  dateTime={formik.values[options.startedAt]}
                  getStartDate={(value) => {
                    formik.setFieldValue(options.startedAt, value);
                  }}
                />
              </FormContainer>
              <FormContainer>
                <Label htmlFor={options.finishedAt}>Data de conclus??o</Label>
                <DatePicker
                  disabled={!currentUser?.role.admin}
                  id={options.finishedAt}
                  minDate={formik.values[options.startedAt]}
                  dateTime={formik.values[options.finishedAt]}
                  getStartDate={(value) => {
                    formik.setFieldValue(options.finishedAt, value);
                  }}
                />
              </FormContainer>
            </Inline>
          </Card>
        ))}

        <Center>
          <Button type="submit" color="green" isLoading={updateDemandLoading}>
            <span>Salvar</span>
          </Button>
        </Center>
      </Form>
    </DashboardComponent>
  );
}
