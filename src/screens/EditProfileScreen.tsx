/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `EditProfileScreen.tsx`
 * * Descrição: Este arquivo define o componente `EditProfileScreen`, que é a tela de formulário
 * onde os usuários podem editar suas informações de perfil, como nome e email. Para usuários
 * com a função 'médico', um campo adicional para 'especialidade' é exibido.
 *
 * * Funcionalidades Principais:
 * 1. Pré-preenche os campos do formulário com os dados do usuário atual, obtidos do `AuthContext`.
 * 2. Permite a edição dos dados do perfil.
 * 3. Valida os campos obrigatórios antes de salvar.
 * 4. Atualiza as informações do usuário tanto no estado global (via `AuthContext`) quanto no
 * armazenamento local (`AsyncStorage`) para garantir a persistência dos dados.
 * 5. Fornece feedback ao usuário sobre o sucesso ou falha da operação através de alertas nativos.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa hooks e tipos essenciais do React e React Native.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, Alert } from 'react-native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Button, Input } from 'react-native-elements';

// Importa hooks customizados para autenticação e navegação.
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Importa tipos de navegação.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importa o tema da aplicação, componentes e AsyncStorage.
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const EditProfileScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E ESTADOS DO FORMULÁRIO
  // ----------------------------------------------------------------------

  // Obtém o usuário atual e a função `updateUser` do contexto de autenticação.
  const { user, updateUser } = useAuth();
  // Obtém o objeto de navegação.
  const navigation = useNavigation<EditProfileScreenProps['navigation']>();
  
  // Estados para controlar os valores dos campos do formulário.
  // Os valores iniciais são pré-preenchidos com os dados do usuário logado.
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  
  // Estado para controlar o indicador de carregamento do botão de salvar.
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------------------------
  // 3.2. FUNÇÃO DE SALVAMENTO DO PERFIL
  // ----------------------------------------------------------------------

  // Função assíncrona para lidar com o salvamento das alterações do perfil.
  const handleSaveProfile = async () => {
    try {
      setLoading(true); // Ativa o indicador de carregamento.

      // 1. Validação: Verifica se os campos de nome e email não estão vazios.
      if (!name.trim() || !email.trim()) {
        Alert.alert('Erro', 'Nome e email são obrigatórios');
        return; // Interrompe a função se a validação falhar.
      }

      // 2. Criação do Objeto Atualizado: Monta o novo objeto de usuário.
      const updatedUser = {
        ...user!, // Copia todas as propriedades existentes do usuário. O '!' assume que `user` não é nulo.
        name: name.trim(), // Atualiza o nome, removendo espaços extras.
        email: email.trim(), // Atualiza o email.
        // Adiciona a especialidade condicionalmente, apenas se o usuário for um médico.
        ...(user?.role === 'doctor' && { specialty: specialty.trim() }),
      };

      // 3. Atualização do Contexto: Chama a função `updateUser` do AuthContext para atualizar o estado global.
      await updateUser(updatedUser);

      // 4. Persistência: Salva o objeto de usuário atualizado no AsyncStorage para manter a sessão.
      await AsyncStorage.setItem('@MedicalApp:user', JSON.stringify(updatedUser));

      // 5. Feedback e Navegação: Exibe um alerta de sucesso e, ao clicar em "OK", retorna à tela anterior.
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      // Tratamento de erro: exibe um alerta genérico de falha.
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      // Garante que o indicador de carregamento seja desativado ao final do processo.
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 3.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Editar Perfil</Title>

        {/* Componente: ProfileCard (Card que agrupa os campos do formulário) */}
        <ProfileCard>
          {/* Avatar (foto) do usuário. */}
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
          
          {/* Campo de entrada para o nome. */}
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            containerStyle={styles.input}
            placeholder="Digite seu nome"
          />

          {/* Campo de entrada para o email. */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.input}
            placeholder="Digite seu email"
            keyboardType="email-address" // Define o teclado apropriado.
            autoCapitalize="none" // Desativa a capitalização automática.
          />

          {/* Renderização Condicional: O campo "Especialidade" só aparece se o usuário for um médico. */}
          {user?.role === 'doctor' && (
            <Input
              label="Especialidade"
              value={specialty}
              onChangeText={setSpecialty}
              containerStyle={styles.input}
              placeholder="Digite sua especialidade"
            />
          )}

          {/* Componente: RoleBadge (Etiqueta que exibe a função do usuário) */}
          <RoleBadge role={user?.role || ''}>
            <RoleText>{user?.role === 'admin' ? 'Administrador' : user?.role === 'doctor' ? 'Médico' : 'Paciente'}</RoleText>
          </RoleBadge>
        </ProfileCard>

        {/* Botão para salvar as alterações, que exibe um loading durante o processo. */}
        <Button
          title="Salvar Alterações"
          onPress={handleSaveProfile}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.saveButton}
        />

        {/* Botão para cancelar a edição e voltar para a tela anterior. */}
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
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
  input: { marginBottom: 15, },
  button: { marginBottom: 15, width: '100%', },
  saveButton: { backgroundColor: theme.colors.success, paddingVertical: 12, },
  cancelButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12, },
};

// --- Styled Components ---

// Contêiner principal da tela.
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Título principal da tela.
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Card que agrupa os elementos do formulário.
const ProfileCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center; /* Centraliza o avatar e a etiqueta de função. */
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

// Etiqueta (badge) para a função do usuário, com cor de fundo dinâmica baseada na `role`.
const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: { role: string }) => {
    switch (props.role) {
      case 'admin': return theme.colors.primary + '20';
      case 'doctor': return theme.colors.success + '20';
      default: return theme.colors.secondary + '20';
    }
  }};
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
`;

// Texto dentro da etiqueta de função.
const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default EditProfileScreen;