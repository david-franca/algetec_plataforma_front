import { useFormik } from 'formik';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Button, Center, Flex, Spinner } from '../../components';
import { Fieldset, Input, Label } from '../../components/Dialog';
import { UserUpdate } from '../../models/user.model';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../services/user.service';

interface EditUserProps {
  onClose: (open: boolean) => void;
  id: number;
}

export function EditUser({ onClose, id }: EditUserProps) {
  const { data: userData, isLoading } = useGetUserByIdQuery(id, {
    skip: !id,
  });
  const [updateUser, { isError, isSuccess, isLoading: userUpdateLoading }] = useUpdateUserMutation();
  const initialValues: UserUpdate = {
    id: 0,
    name: '',
    email: '',
    password: '',
    department_id: 0,
    role_id: 0,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      updateUser(values);
    },
  });

  useEffect(() => {
    if (userData) {
      formik.setValues({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: '',
        department_id: userData.department_id,
        role_id: userData.role_id,
      });
    }
  }, [userData]);

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao atualizar usuário');
    }
    if (isSuccess) {
      formik.resetForm();
      toast.success('Usuário atualizado com sucesso');
      onClose(true);
    }
  }, [isError, isSuccess]);

  if (isLoading) {
    return (
      <Center css={{ width: '100%' }}>
        <Spinner />
      </Center>
    );
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Fieldset>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" type="text" onChange={formik.handleChange} value={formik.values.name} />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="department_id">ID do Departamento</Label>
        <Input
          id="department_id"
          name="department_id"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.department_id}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="role_id">ID do Cargo</Label>
        <Input id="role_id" name="role_id" type="number" onChange={formik.handleChange} value={formik.values.role_id} />
      </Fieldset>
      <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
        <Button color="green" isLoading={userUpdateLoading}>
          Salvar
        </Button>
      </Flex>
    </form>
  );
}
