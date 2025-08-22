/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `LoginScreen.tsx`
 * * Descrição: Este arquivo define o componente `LoginScreen`, que é a tela de entrada para o aplicativo.
 * Ele apresenta um formulário para que os usuários insiram suas credenciais (email e senha).
 * A tela gerencia o estado do formulário, exibe feedback de carregamento e erro, e utiliza o
 * `AuthContext` para realizar a autenticação.
 *
 * * Funcionalidades Principais:
 * 1. Coleta de credenciais de login do usuário.
 * 2. Integração com o `AuthContext` para executar a função `signIn`.
 * 3. Gerenciamento de estados de carregamento (`loading`) e erro (`error`) para feedback visual.
 * 4. Navegação para a tela de registro (`RegisterScreen`) para novos usuários.
 * 5. Exibição de credenciais de exemplo para facilitar testes e demonstrações.
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

// Importa hooks customizados e de navegação.
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
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const LoginScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E ESTADOS DO FORMULÁRIO
  // ----------------------------------------------------------------------

  // Obtém a função `signIn` do contexto de autenticação global.
  const { signIn } = useAuth();
  // Obtém o objeto de navegação para permitir a transição entre telas.
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  
  // Estados para controlar os valores dos campos do formulário.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para controlar o processo de submissão do formulário.
  const [loading, setLoading] = useState(false); // Para o indicador de carregamento do botão.
  const [error, setError] = useState(''); // Para exibir mensagens de erro.

  // ----------------------------------------------------------------------
  // 3.2. FUNÇÃO DE LOGIN
  // ----------------------------------------------------------------------

  // Função assíncrona para lidar com a tentativa de login do usuário.
  const handleLogin = async () => {
    try {
      // Inicia o estado de carregamento e limpa erros anteriores.
      setLoading(true);
      setError('');
      
      // Chama a função `signIn` do AuthContext, passando as credenciais.
      // O `AuthContext` cuidará da lógica de autenticação e da atualização do estado global.
      await signIn({ email, password });
      // Se o login for bem-sucedido, o AppNavigator irá automaticamente renderizar as rotas protegidas.
    } catch (err) {
      // Se `signIn` lançar um erro, o `catch` é ativado.
      setError('Email ou senha inválidos');
    } finally {
      // O bloco `finally` garante que o estado de carregamento seja desativado,
      // independentemente de o login ter sucesso ou falha.
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 3.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner principal que centraliza o conteúdo)
    <Container>
      {/* Título da tela de login. */}
      <Title>App Marcação de Consultas</Title>
      
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

      {/* Botão principal para submeter o formulário de login. */}
      <Button
        title="Entrar"
        onPress={handleLogin}
        loading={loading} // Mostra um indicador de carregamento durante a tentativa de login.
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      {/* Botão secundário para navegar para a tela de registro. */}
      <Button
        title="Cadastrar Novo Paciente"
        onPress={() => navigation.navigate('Register')}
        containerStyle={styles.registerButton as ViewStyle}
        buttonStyle={styles.registerButtonStyle}
      />
      
      {/* Textos de ajuda com credenciais de exemplo para facilitar o teste. */}
      <Text style={styles.hint}>
        Use as credenciais de exemplo:
      </Text>
      <Text style={styles.credentials}>
        Admin: admin@example.com / 123456{'\n'}
        Médicos: joao@example.com, maria@example.com, pedro@example.com / 123456
      </Text>
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
  registerButton: { marginTop: 10, width: '100%', },
  registerButtonStyle: { backgroundColor: theme.colors.secondary, paddingVertical: 12, },
  hint: { marginTop: 20, textAlign: 'center' as const, color: theme.colors.text, },
  credentials: { marginTop: 10, textAlign: 'center' as const, color: theme.colors.text, fontSize: 12, },
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

// Texto para exibir mensagens de erro de login.
const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default LoginScreen;