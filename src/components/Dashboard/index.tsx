/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { BackpackIcon, ExternalLinkIcon, HomeIcon, PersonIcon, RocketIcon } from '@radix-ui/react-icons';
import { ComponentProps } from '@stitches/react';
import { forwardRef, ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';

import logo from '../../assets/logo.png';
import { useAppSelector } from '../../config/hooks';
import { Flex } from '../box';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Spinner } from '../spinner';
import {
  Icon,
  Image,
  Logo,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  Sidebar,
  StyledAnchor,
  StyledLink,
  StyledTrigger,
} from './styles';

interface DashboardContainerProps {
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  isLoading?: boolean;
}

interface TriggerProps extends ComponentProps<typeof StyledTrigger> {
  icon?: ReactNode;
}

const NavigationMenuTrigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ children, icon, ...props }, forwardedRef) => (
    <StyledTrigger {...props} ref={forwardedRef}>
      <span>{children}</span>
      <Icon>{icon}</Icon>
    </StyledTrigger>
  ),
);

NavigationMenuTrigger.displayName = 'Trigger';

export function DashboardComponent({ children, isLoading = false }: DashboardContainerProps) {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <Flex css={{ flexDirection: 'column', width: 'calc(100vw - 17px)' }}>
      <Flex css={{ width: '100%' }}>
        <Sidebar>
          <Logo>
            <Link to="/">
              <Image src={logo} alt="Logo Algetec" />
            </Link>
          </Logo>
          <NavigationMenu orientation="vertical">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger icon={<HomeIcon />}>
                  <StyledLink to="/dashboard">Dashboard</StyledLink>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger icon={<ExternalLinkIcon />}>
                  <StyledAnchor href="https://catalogoalgetec.grupoa.education/login" target="_blank">
                    Catálogo
                  </StyledAnchor>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger icon={<BackpackIcon />}>
                  <StyledLink to="/dashboard/clients">Clientes</StyledLink>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger icon={<PersonIcon />}>
                  <StyledLink to="/dashboard/users">Usuários</StyledLink>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger icon={<RocketIcon />}>
                  <StyledLink to="/dashboard/issues">Entregas</StyledLink>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Sidebar>
        <Flex
          css={{
            flexDirection: 'column',
            width: 'calc(85vw - 17px)',
          }}
        >
          <Header />
          <Flex
            css={{
              padding: '$md',
              backgroundColor: '$gray3',
            }}
          >
            {isLoading ? (
              <Flex
                css={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Flex>
            ) : (
              children
            )}
          </Flex>
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  );
}
