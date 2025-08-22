/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `ProfileScreen.tsx`
 * * Descrição: Este arquivo define o componente `ProfileScreen`, que é a tela responsável por
 * exibir as informações do perfil do usuário logado. A tela é primariamente de visualização,
 * mostrando dados como foto, nome, email e função (role). Ela também serve como um ponto
 * de partida para ações relacionadas ao perfil, como editar as informações ou fazer logout.
 *
 * * Funcionalidades Principais:
 * 1. Exibe os dados do usuário logado, obtidos a partir do `AuthContext`.
 * 2. Mostra informações adicionais condicionalmente, como a especialidade para usuários médicos.
 * 3. Fornece botões de navegação para a tela de edição de perfil (`EditProfileScreen`).
 * 4. Permite que o usuário encerre sua sessão (logout) através de um botão dedicado.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa a biblioteca React.
import React from 'react';

// Importa a biblioteca 'styled-components' para React Native.
import styled from 'styled-components/native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Button, ListItem } from 'react-native-elements';

// Importa hooks customizados para autenticação e navegação.
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Importa tipos de navegação.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importa o tema da aplicação, componentes e tipos.
import theme from '../styles/theme';
import Header from '../components/Header';
import { ViewStyle } from 'react-native';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const ProfileScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E FUNÇÕES AUXILIARES
  // ----------------------------------------------------------------------

  // Obtém o objeto 'user' e a função 'signOut' do contexto de autenticação.
  const { user, signOut } = useAuth();
  // Obtém o objeto de navegação para permitir a transição entre telas.
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

  // Função auxiliar para traduzir a 'role' (ex: 'admin') para um texto legível (ex: 'Administrador').
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'doctor': return 'Médico';
      case 'patient': return 'Paciente';
      default: return role;
    }
  };

  // ----------------------------------------------------------------------
  // 3.2. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner principal da tela)
    <Container>
      {/* Componente: Header (Cabeçalho customizado) */}
      <Header />
      {/* Componente: ScrollView (Permite a rolagem do conteúdo) */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Meu Perfil</Title>

        {/* Componente: ProfileCard (Card que agrupa as informações do perfil) */}
        <ProfileCard>
          {/* Avatar (foto) do usuário. */}
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
          {/* Nome do usuário. */}
          <Name>{user?.name}</Name>
          {/* Email do usuário. */}
          <Email>{user?.email}</Email>
          {/* Etiqueta (badge) que exibe a função do usuário com cor de fundo dinâmica. */}
          <RoleBadge role={user?.role || ''}>
            <RoleText>{getRoleText(user?.role || '')}</RoleText>
          </RoleBadge>
          
          {/* Renderização Condicional: A especialidade só é exibida se o usuário for um médico. */}
          {user?.role === 'doctor' && (
            <SpecialtyText>Especialidade: {user?.specialty}</SpecialtyText>
          )}
        </ProfileCard>

        {/* Botão para navegar para a tela de edição de perfil. */}
        <Button
          title="Editar Perfil"
          onPress={() => navigation.navigate('EditProfile' as any)}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.editButton}
        />

        {/* Botão para voltar à tela anterior na pilha de navegação. */}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão para executar a função de logout do AuthContext. */}
        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLES E STYLED COMPONENTS)
// ========================================================================

// Objeto de estilos para componentes que não são `styled-components`.
const styles = {
  scrollContent: { padding: 20, },
  button: { marginBottom: 20, width: '100%', },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12, },
  editButton: { backgroundColor: theme.colors.success, paddingVertical: 12, },
  logoutButton: { backgroundColor: theme.colors.error, paddingVertical: 12, },
};

// --- Styled Components ---

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Card principal para exibir as informações do perfil.
const ProfileCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center; /* Centraliza o conteúdo do card. */
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

// Componente de imagem para o avatar do usuário.
const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

// Texto para o nome do usuário.
const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

// Texto para o email do usuário.
const Email = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

// Etiqueta (badge) para a função do usuário, com cor de fundo dinâmica baseada na `role`.
const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: { role: string }) => {
    switch (props.role) {
      case 'admin': return theme.colors.primary + '20'; // Adiciona transparência à cor.
      case 'doctor': return theme.colors.success + '20';
      default: return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

// Texto dentro da etiqueta de função.
const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

// Texto para exibir a especialidade do médico.
const SpecialtyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default ProfileScreen;