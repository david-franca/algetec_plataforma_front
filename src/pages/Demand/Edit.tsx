import { useFormik } from 'formik';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SelectComponent from 'react-select';
import { toast } from 'react-toastify';

import { Button, Center, DashboardComponent, Inline, Title } from '../../components';
import { Card } from '../../components/Card';
import { DatePicker } from '../../components/Datepicker';
import { Form } from '../../components/Form';
import { Select } from '../../components/Select';
import { Separator } from '../../components/Separator';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { DemandUpdateForm, IDemand } from '../../models/demands.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import { useGetDemandByIdQuery, useGetExperimentsQuery, useUpdateDemandMutation } from '../../services/demands.service';
import { useGetInstitutionsQuery } from '../../services/institution.service';
import { useGetUsersQuery } from '../../services/user.service';
import { FormContainer, Input, Label } from '../Dashboard/styles';

export function EditDemandPage() {
  const params = useParams();
  const id = useMemo(() => (params.id ? Number(params.id) : 0), [params.id]);
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: demandData, isLoading } = useGetDemandByIdQuery(id, {
    skip: id === 0,
  });
  const { data: institutions, isLoading: institutionsLoading } = useGetInstitutionsQuery();
  const { data: experiments, isLoading: experimentsLoading } = useGetExperimentsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();

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
    modeling_finishedAt: new Date(),
    scripting_finishedAt: new Date(),
    testing_finishedAt: new Date(),
    ualab_finishedAt: new Date(),
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const post = IDemand.toPut(values, currentUser ? currentUser.id : 0);
      updateDemand(post);
    },
  });
  const statusOptions = useMemo(
    () => [
      { value: DemandStatus.DEVELOPMENT, label: 'Desenvolvimento' },
      { value: DemandStatus.CORRECTION, label: 'Correção' },
      { value: DemandStatus.READY, label: 'Pronto' },
      { value: DemandStatus.REVALIDATION, label: 'Revalidação' },
      { value: DemandStatus.VALIDATION, label: 'Validação' },
    ],
    [DemandStatus],
  );
  const institutionOptions = useMemo(
    () =>
      institutions
        ? [
            { value: '0', label: 'Selecione uma instituição' },
            ...institutions.map((institution) => ({
              value: institution.id.toString(),
              label: institution.name,
            })),
          ]
        : [],
    [institutions],
  );
  const experimentOptions = useMemo(
    () =>
      experiments
        ? [
            { value: '0', label: 'Selecione uma prática' },
            ...experiments.map((experiment) => ({
              value: experiment.id.toString(),
              label: `${experiment.id} - ${experiment.name}`,
            })),
          ]
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

  useEffect(() => {
    if (demandData && currentUser && id !== 0) {
      const demand = new IDemand(demandData).toUpdate();
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
        <Title size="extraLarge">Editar Demanda</Title>
        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Informações da demanda</Title>
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
              <Select
                value={formik.values.status}
                onValueChange={(value) => {
                  formik.setFieldValue('status', value);
                }}
                items={statusOptions}
              />
            </FormContainer>

            <FormContainer>
              <Label htmlFor="institution_id">Instituição</Label>
              <Select
                disabled={institutionsLoading}
                value={formik.values.institution_id.toString()}
                onValueChange={(value) => {
                  formik.setFieldValue('institution_id', value);
                }}
                items={institutionOptions}
              />
            </FormContainer>

            <FormContainer>
              <Label htmlFor="experiment_id">Prática</Label>
              <Select
                disabled={experimentsLoading}
                value={formik.values.experiment_id.toString()}
                onValueChange={(value) => {
                  formik.setFieldValue('experiment_id', value);
                }}
                items={experimentOptions}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Programação</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="coding_developers">Responsáveis</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                isDisabled={usersLoading}
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
                options={users}
                value={formik.values.coding_developers}
                onChange={(value) => {
                  formik.setFieldValue('coding_developers', value);
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="coding">Progresso</Label>
              <Input
                type="number"
                name="coding"
                id="coding"
                value={formik.values.coding}
                onChange={formik.handleChange}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="coding_finishedAt">Data de conclusão</Label>
              <DatePicker
                id="coding_finishedAt"
                dateTime={formik.values.coding_finishedAt}
                getStartDate={(value) => {
                  formik.setFieldValue('coding_finishedAt', value);
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">UALAB</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="ualab_developers">Responsáveis</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                isDisabled={usersLoading}
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
                options={users}
                value={formik.values.ualab_developers}
                onChange={(value) => {
                  formik.setFieldValue('ualab_developers', value);
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="ualab">Progresso</Label>
              <Input type="number" name="ualab" id="ualab" value={formik.values.ualab} onChange={formik.handleChange} />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="ualab_finishedAt">Data de conclusão</Label>
              <DatePicker
                id="ualab_finishedAt"
                dateTime={formik.values.ualab_finishedAt}
                getStartDate={(value) => {
                  formik.setFieldValue('ualab_finishedAt', value);
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Testes</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="testing_developers">Responsáveis</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                isDisabled={usersLoading}
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
                options={users}
                value={formik.values.testing_developers}
                onChange={(value) => {
                  formik.setFieldValue('testing_developers', value);
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="testing">Progresso</Label>
              <Input
                type="number"
                name="testing"
                id="testing"
                value={formik.values.testing}
                onChange={formik.handleChange}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="testing_finishedAt">Data de conclusão</Label>
              <DatePicker
                id="testing_finishedAt"
                dateTime={formik.values.testing_finishedAt}
                getStartDate={(value) => {
                  formik.setFieldValue('testing_finishedAt', value);
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Modelagem</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="modeling_developers">Responsáveis</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                isDisabled={usersLoading}
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
                options={users}
                value={formik.values.modeling_developers}
                onChange={(value) => {
                  formik.setFieldValue('modeling_developers', value);
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="modeling">Progresso</Label>
              <Input
                type="number"
                name="modeling"
                id="modeling"
                value={formik.values.modeling}
                onChange={formik.handleChange}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="modeling_finishedAt">Data de conclusão</Label>
              <DatePicker
                id="modeling_finishedAt"
                dateTime={formik.values.modeling_finishedAt}
                getStartDate={(value) => {
                  formik.setFieldValue('modeling_finishedAt', value);
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Roteirização</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="scripting_developers">Responsáveis</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                isDisabled={usersLoading}
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
                options={users}
                value={formik.values.scripting_developers}
                onChange={(value) => {
                  formik.setFieldValue('scripting_developers', value);
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="scripting">Progresso</Label>
              <Input
                type="number"
                name="scripting"
                id="scripting"
                value={formik.values.scripting}
                onChange={formik.handleChange}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="scripting_finishedAt">Data de conclusão</Label>
              <DatePicker
                id="scripting_finishedAt"
                dateTime={formik.values.scripting_finishedAt}
                getStartDate={(value) => {
                  formik.setFieldValue('scripting_finishedAt', value);
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Center>
          <Button type="submit" color="green" isLoading={updateDemandLoading}>
            <span>Salvar</span>
          </Button>
        </Center>
      </Form>
    </DashboardComponent>
  );
}
