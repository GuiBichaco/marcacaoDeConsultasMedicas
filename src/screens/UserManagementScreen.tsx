/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `UserManagementScreen.tsx`
 * * Descrição: Este arquivo define o componente `UserManagementScreen`, que é uma tela administrativa
 * para o gerenciamento de usuários do sistema. A tela exibe uma lista de todos os usuários
 * cadastrados (exceto o próprio administrador logado) e fornece funcionalidades para
 * editar e excluir usuários.
 *
 * * Funcionalidades Principais:
 * 1. Carrega e exibe a lista de todos os usuários a partir do armazenamento local (`AsyncStorage`).
 * 2. Permite a exclusão de usuários da lista, atualizando o armazenamento local.
 * 3. Atualiza a lista de usuários automaticamente sempre que a tela ganha foco.
 * 4. Fornece uma interface clara com botões para ações futuras, como adicionar e editar usuários.
 * 5. Diferencia visualmente os usuários por sua função (admin, médico, paciente) através de etiquetas coloridas.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa hooks e tipos essenciais do React e React Native.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Button, ListItem, Text } from 'react-native-elements';

// Importa hooks customizados para autenticação e navegação.
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Importa tipos de navegação.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

// Importa o tema da aplicação, componentes e AsyncStorage.
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS E INTERFACES LOCAIS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type UserManagementScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;
};

// Interface para o objeto de Usuário.
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

// Interface para as props de estilo dos `styled-components`.
interface StyledProps {
  role: string;
}

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const UserManagementScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E ESTADOS
  // ----------------------------------------------------------------------

  const { user } = useAuth(); // Obtém o usuário administrador logado.
  const navigation = useNavigation<UserManagementScreenProps['navigation']>();
  
  // Estado para armazenar a lista de usuários a serem exibidos.
  const [users, setUsers] = useState<User[]>([]);
  // Estado para controlar a exibição do indicador de carregamento.
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------
  // 3.2. FUNÇÕES DE DADOS E AÇÕES
  // ----------------------------------------------------------------------

  // Função assíncrona para carregar a lista de usuários do armazenamento.
  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        // Filtra a lista para não exibir o próprio administrador logado.
        const filteredUsers = allUsers.filter(u => u.id !== user?.id);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar um usuário específico.
  const handleDeleteUser = async (userId: string) => {
    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        // Cria uma nova lista sem o usuário que tem o `userId` correspondente.
        const updatedUsers = allUsers.filter(u => u.id !== userId);
        // Salva a lista atualizada de volta no AsyncStorage.
        await AsyncStorage.setItem('@MedicalApp:users', JSON.stringify(updatedUsers));
        loadUsers(); // Recarrega a lista na tela para refletir a exclusão.
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  // Hook `useFocusEffect` para recarregar os usuários sempre que a tela ganhar foco.
  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

  // Função auxiliar para traduzir a 'role' para um texto legível.
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'doctor': return 'Médico';
      case 'patient': return 'Paciente';
      default: return role;
    }
  };

  // ----------------------------------------------------------------------
  // 3.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Gerenciar Usuários</Title>

        {/* Botão para adicionar um novo usuário (funcionalidade a ser implementada). */}
        <Button
          title="Adicionar Novo Usuário"
          onPress={() => {}} // Placeholder para a função de adicionar.
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Lógica de renderização condicional para a lista de usuários. */}
        {loading ? (
          <LoadingText>Carregando usuários...</LoadingText>
        ) : users.length === 0 ? (
          <EmptyText>Nenhum outro usuário cadastrado</EmptyText>
        ) : (
          // Mapeia a lista de usuários para renderizar um card para cada um.
          users.map((userItem) => (
            <UserCard key={userItem.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.userName as TextStyle}>{userItem.name}</ListItem.Title>
                <ListItem.Subtitle style={styles.userEmail as TextStyle}>{userItem.email}</ListItem.Subtitle>
                {/* Etiqueta (badge) com cor e texto dinâmicos para a função do usuário. */}
                <RoleBadge role={userItem.role}>
                  <RoleText role={userItem.role}>{getRoleText(userItem.role)}</RoleText>
                </RoleBadge>
                {/* Contêiner para os botões de ação. */}
                <ButtonContainer>
                  <Button
                    title="Editar"
                    onPress={() => {}} // Placeholder para a função de editar.
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.editButton}
                  />
                  <Button
                    title="Excluir"
                    onPress={() => handleDeleteUser(userItem.id)}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.deleteButton}
                  />
                </ButtonContainer>
              </ListItem.Content>
            </UserCard>
          ))
        )}

        {/* Botão para voltar à tela anterior. */}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.backButton}
        />
      </ScrollView>
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLES E STYLED COMPONENTS)
// ========================================================================

const styles = {
  scrollContent: { padding: 20 },
  button: { marginBottom: 20, width: '100%' },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
  backButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
  actionButton: { marginTop: 8, width: '48%' },
  editButton: { backgroundColor: theme.colors.primary, paddingVertical: 8 },
  deleteButton: { backgroundColor: theme.colors.error, paddingVertical: 8 },
  userName: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  userEmail: { fontSize: 14, color: theme.colors.text, marginTop: 4 },
};

// --- Styled Components ---
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Card para exibir os detalhes de um usuário.
const UserCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

// Etiqueta (badge) para a função do usuário, com cor de fundo dinâmica.
const RoleBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin': return theme.colors.primary + '20';
      case 'doctor': return theme.colors.success + '20';
      default: return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

// Texto dentro da etiqueta de função, com cor dinâmica.
const RoleText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin': return theme.colors.primary;
      case 'doctor': return theme.colors.success;
      default: return theme.colors.secondary;
    }
  }};
  font-size: 12px;
  font-weight: 500;
`;

// Contêiner para os botões de ação (Editar/Excluir).
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default UserManagementScreen;