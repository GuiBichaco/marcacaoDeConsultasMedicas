/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `RegisterScreen.tsx`
 * * Descrição: Este arquivo define o componente `RegisterScreen`, que é a tela de formulário para o
 * cadastro de novos usuários (pacientes). A tela coleta informações básicas como nome, email e senha.
 *
 * * Funcionalidades Principais:
 * 1. Coleta os dados de registro do novo usuário.
 * 2. Realiza uma validação simples para garantir que todos os campos foram preenchidos.
 * 3. Integra-se com o `AuthContext` para executar a função de `register`.
 * 4. Gerencia estados de carregamento (`loading`) e erro (`error`) para fornecer feedback visual ao usuário.
 * 5. Navega o usuário para a tela de Login após um cadastro bem-sucedido.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa hooks e tipos essenciais do React e React Native.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Input, Button, Text } from 'react-native-elements';

// Importa hooks customizados para autenticação e navegação.
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Importa tipos de navegação.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importa o tema da aplicação.
import theme from '../styles/theme';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const RegisterScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E ESTADOS DO FORMULÁRIO
  // ----------------------------------------------------------------------

  // Obtém a função `register` do contexto de autenticação global.
  const { register } = useAuth();
  // Obtém o objeto de navegação para permitir a transição entre telas.
  const navigation = useNavigation<RegisterScreenProps['navigation']>();
  
  // Estados para controlar os valores dos campos do formulário.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para controlar o processo de submissão do formulário.
  const [loading, setLoading] = useState(false); // Para o indicador de carregamento do botão.
  const [error, setError] = useState(''); // Para exibir mensagens de erro.

  // ----------------------------------------------------------------------
  // 3.2. FUNÇÃO DE REGISTRO
  // ----------------------------------------------------------------------

  // Função assíncrona para lidar com a tentativa de registro do usuário.
  const handleRegister = async () => {
    try {
      // Inicia o estado de carregamento e limpa erros anteriores.
      setLoading(true);
      setError('');

      // 1. Validação: Verifica se todos os campos foram preenchidos.
      if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos');
        return; // Interrompe a execução se a validação falhar.
      }

      // 2. Ação de Registro: Chama a função `register` do AuthContext, passando os dados do formulário.
      // O `AuthContext` é responsável pela lógica de criar a conta.
      await register({
        name,
        email,
        password,
      });

      // 3. Navegação: Após o registro bem-sucedido, navega o usuário para a tela de Login para que ele possa entrar.
      navigation.navigate('Login');
    } catch (err) {
      // Se a função `register` lançar um erro (ex: email já existe), o `catch` é ativado.
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      // O bloco `finally` garante que o estado de carregamento seja desativado ao final do processo.
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 3.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner principal que centraliza o conteúdo)
    <Container>
      <Title>Cadastro de Paciente</Title>
      
      {/* Campo de entrada para o nome completo. */}
      <Input
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words" // Capitaliza a primeira letra de cada palavra.
        containerStyle={styles.input}
      />

      {/* Campo de entrada para o email. */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none" // Desativa a capitalização automática.
        keyboardType="email-address" // Usa o teclado otimizado para emails.
        containerStyle={styles.input}
      />

      {/* Campo de entrada para a senha. */}
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Oculta os caracteres digitados.
        containerStyle={styles.input}
      />

      {/* Exibe a mensagem de erro somente se o estado `error` não estiver vazio. */}
      {error ? <ErrorText>{error}</ErrorText> : null}

      {/* Botão principal para submeter o formulário de cadastro. */}
      <Button
        title="Cadastrar"
        onPress={handleRegister}
        loading={loading} // Mostra um indicador de carregamento durante a tentativa de cadastro.
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      {/* Botão secundário para retornar à tela de login. */}
      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')}
        containerStyle={styles.backButton as ViewStyle}
        buttonStyle={styles.backButtonStyle}
      />
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLES E STYLED COMPONENTS)
// ========================================================================

// Objeto de estilos para componentes que não são `styled-components`.
const styles = {
  input: { marginBottom: 15, },
  button: { marginTop: 10, width: '100%', },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12, },
  backButton: { marginTop: 10, width: '100%', },
  backButtonStyle: { backgroundColor: theme.colors.secondary, paddingVertical: 12, },
};

// --- Styled Components ---

// Contêiner principal da tela, com flexbox para centralizar o conteúdo.
const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

// Título principal da tela.
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.text};
`;

// Texto para exibir mensagens de erro de cadastro.
const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default RegisterScreen;