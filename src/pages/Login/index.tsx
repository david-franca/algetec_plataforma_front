import {
  Button,
  Card,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

import logoBranca from '../../assets/logo-branca.png';
import { Text } from '../../components';
import { LoginRequest, useLoginMutation } from '../../services/auth.service';
import { FormStyled, Image, ImageContainer, Sidebar, url } from './style';

export function LoginPage() {
  const [login, { isLoading, isSuccess, isError }] = useLoginMutation();
  const navigate = useNavigate();
  const toast = useToast();
  const initialValues: LoginRequest = {
    email: '',
    password: '',
  };
  const validationSchema = object({
    email: string().email().required('E-mail é obrigatório'),
    password: string().required('Senha é obrigatória'),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: login,
  });

  useEffect(() => {
    if (isSuccess) {
      formik.resetForm();
      toast({
        title: 'Login realizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      navigate('/dashboard');
    } else if (isError) {
      toast({
        title: 'Erro ao realizar login',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [isSuccess, isError]);

  return (
    <Center
      height="calc(100vh)"
      backgroundImage={`linear-gradient(180deg, rgba(187, 36, 62, 0.2) 0%, rgba(255,255,255, 1) 100% ), url("${url}")`}
    >
      <Card direction="row" variant="elevated">
        <Sidebar>
          <ImageContainer>
            <Image src={logoBranca} alt="Logo Branca" />
          </ImageContainer>
          <Text color="white" weight="bold" align="center">
            LOGIN
          </Text>
        </Sidebar>

        <FormStyled noValidate onSubmit={formik.handleSubmit}>
          <FormControl isRequired mb="8">
            <FormLabel fontWeight={400} lineHeight={1.5} textTransform="uppercase" fontSize="sm">
              Email
            </FormLabel>
            <Input
              variant="flushed"
              type="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.email && !!formik.errors.email}
              opacity="0.5"
            />
            <FormErrorMessage>{formik.touched.email && formik.errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired mb="8">
            <FormLabel fontWeight={400} lineHeight={1.5} textTransform="uppercase" fontSize="sm">
              Senha
            </FormLabel>
            <Input
              variant="flushed"
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
              opacity="0.5"
            />
            <FormErrorMessage>{formik.touched.password && formik.errors.password}</FormErrorMessage>
          </FormControl>

          {/* <Helpers>
            <Text color="black" size="normal">
              Esqueceu sua senha?
              <Anchor href="/recover">Clique aqui</Anchor>
            </Text>
          </Helpers> */}
          <Flex
            css={{
              width: '100%',
              justifyContent: 'flex-end',
              margin: '$sm',
            }}
          >
            <Button colorScheme="teal" type="submit" isLoading={isLoading}>
              Login
            </Button>
          </Flex>
          {/* <Helpers>
            <Text color="black" size="normal">
              Não tem conta?
              <Anchor href="/register">Cadastrar</Anchor>
            </Text>
          </Helpers> */}
        </FormStyled>
      </Card>
    </Center>
  );
}
