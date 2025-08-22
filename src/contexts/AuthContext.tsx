/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o Contexto de Autenticação (AuthContext) para o aplicativo.
 * A sua principal responsabilidade é gerenciar o estado de autenticação do usuário
 * de forma global. Ele provê informações sobre o usuário logado, o estado de
 * carregamento inicial, e funções para realizar login, registro, logout e
 * atualização de dados do usuário.
 *
 * Utiliza o AsyncStorage para persistir a sessão do usuário entre os usos do app.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS E TIPOS
// ========================================================================

// Importa hooks essenciais do React para criar o contexto e gerenciar o estado e ciclo de vida.
import React, { createContext, useContext, useState, useEffect } from 'react';

// Importa o AsyncStorage, a API de armazenamento local do React Native, para persistir os dados da sessão.
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa o 'authService', um módulo que encapsula a lógica de autenticação (ex: chamadas de API, validações).
import { authService } from '../services/auth';

// Importa os tipos TypeScript para garantir a consistência dos dados de autenticação.
import { User, LoginCredentials, RegisterData, AuthContextData } from '../types/auth';

// ========================================================================
// 2. CONSTANTES E CRIAÇÃO DO CONTEXTO
// ========================================================================

// Define chaves padronizadas para o AsyncStorage para evitar erros de digitação ("magic strings").
const STORAGE_KEYS = {
  USER: '@MedicalApp:user',
  TOKEN: '@MedicalApp:token',
};

// Cria o Contexto de Autenticação. Ele será o "túnel" pelo qual os dados de autenticação
// serão passados para os componentes filhos.
// A tipagem `{} as AuthContextData` é um valor inicial que será substituído pelo Provider.
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ========================================================================
// 3. COMPONENTE PROVEDOR (PROVIDER)
// ========================================================================

// O AuthProvider é um componente que "envolve" partes do aplicativo (geralmente toda a aplicação)
// para fornecer a elas o acesso ao contexto de autenticação.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ----------------------------------------------------------------------
  // 3.1. ESTADOS DO CONTEXTO
  // ----------------------------------------------------------------------

  // Estado para armazenar os dados do usuário logado. É `null` se ninguém estiver logado.
  const [user, setUser] = useState<User | null>(null);
  // Estado para controlar o carregamento inicial. Enquanto `true`, o app está verificando se há um usuário armazenado.
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------
  // 3.2. EFEITOS E CARREGAMENTO INICIAL
  // ----------------------------------------------------------------------

  // useEffect que é executado uma vez, quando o AuthProvider é montado.
  // Sua função é verificar se já existe uma sessão de usuário salva no dispositivo.
  useEffect(() => {
    loadStoredUser();
    // (Opcional) Carrega outros dados necessários no início, como a lista de usuários registrados para o serviço mockado.
    loadRegisteredUsers();
  }, []);

  // Função para carregar os dados do usuário que foram salvos localmente.
  const loadStoredUser = async () => {
    try {
      // Chama o serviço para obter o usuário do AsyncStorage.
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        // Se um usuário for encontrado, atualiza o estado.
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do armazenamento:', error);
    } finally {
      // Ao final, independentemente de sucesso ou falha, define o carregamento como concluído.
      setLoading(false);
    }
  };

  // Função para carregar usuários registrados no serviço (útil para simulações).
  const loadRegisteredUsers = async () => {
    try {
      await authService.loadRegisteredUsers();
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  };

  // ----------------------------------------------------------------------
  // 3.3. FUNÇÕES DE AUTENTICAÇÃO
  // ----------------------------------------------------------------------

  // Função para realizar o login do usuário.
  const signIn = async (credentials: LoginCredentials) => {
    try {
      // Delega a lógica de login para o `authService`.
      const response = await authService.signIn(credentials);
      // Atualiza o estado global com os dados do usuário.
      setUser(response.user);
      // Salva os dados do usuário e o token no AsyncStorage para persistir a sessão.
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      // Propaga o erro para que a tela de login possa tratá-lo (ex: mostrar uma mensagem).
      throw error;
    }
  };

  // Função para registrar um novo usuário.
  const register = async (data: RegisterData) => {
    try {
      // Delega a lógica de registro para o `authService`.
      const response = await authService.register(data);
      // Atualiza o estado e salva os dados no AsyncStorage, logando o usuário automaticamente.
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

  // Função para realizar o logout do usuário.
  const signOut = async () => {
    try {
      // Chama o serviço de logout (pode invalidar o token no backend no futuro).
      await authService.signOut();
      // Limpa o estado do usuário, definindo-o como nulo.
      setUser(null);
      // Remove os dados do usuário e o token do AsyncStorage para encerrar a sessão.
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para atualizar os dados do usuário no estado e no armazenamento local.
  const updateUser = async (updatedUser: User) => {
    try {
      // Atualiza o estado com os novos dados do usuário.
      setUser(updatedUser);
      // Salva os dados atualizados no AsyncStorage.
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  };

  // ----------------------------------------------------------------------
  // 3.4. PROVENDO O CONTEXTO
  // ----------------------------------------------------------------------
  return (
    // O componente Provider é o que efetivamente disponibiliza os dados para os seus filhos.
    // O objeto `value` contém todos os estados e funções que os componentes da aplicação poderão acessar.
    <AuthContext.Provider value={{ user, loading, signIn, register, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ========================================================================
// 4. CUSTOM HOOK
// ========================================================================

// O `useAuth` é um hook customizado que simplifica o uso do AuthContext.
// Em vez de importar `useContext` e `AuthContext` em cada componente,
// importamos apenas `useAuth`.
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Verificação de segurança: garante que o hook só seja usado dentro de um AuthProvider.
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};