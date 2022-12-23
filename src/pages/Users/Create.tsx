import { useFormik } from 'formik';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Button, Flex } from '../../components';
import { Fieldset, Input, Label } from '../../components/Dialog';
import { UserCreate } from '../../models/user.model';
import { useStoreUserMutation } from '../../services/user.service';

interface CreateUserPageProps {
  onClose: (open: boolean) => void;
}

export default function CreateUserPage({ onClose }: CreateUserPageProps) {
  const [storeUser, { isError, isLoading, isSuccess }] = useStoreUserMutation();
  const initialValues: UserCreate = {
    name: '',
    email: '',
    password: '',
    department_id: 0,
    role_id: 0,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      storeUser(values);
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao criar usuário');
    }
    if (isSuccess) {
      formik.resetForm();
      toast.success('Usuário criado com sucesso');
      onClose(true);
    }
  }, [isError, isSuccess]);

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
        <Button color="green" isLoading={isLoading}>
          Salvar
        </Button>
      </Flex>
    </form>
  );
}
