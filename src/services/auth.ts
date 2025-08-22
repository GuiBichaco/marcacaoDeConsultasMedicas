/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `authService.ts`
 * * Descrição: Este arquivo define o `authService`, um serviço de autenticação **mockado (simulado)**.
 * Em vez de fazer chamadas a uma API de um backend real, este serviço simula o comportamento de
 * um servidor de autenticação usando dados locais (mock data) e o armazenamento do dispositivo (`AsyncStorage`).
 * Ele é responsável por toda a lógica de login, registro, logout e gerenciamento de dados de usuários.
 *
 * * Propósito: Facilitar o desenvolvimento e teste do frontend da aplicação sem a necessidade de um backend ativo.
 */

// ========================================================================
// 1. IMPORTAÇÕES E TIPOS
// ========================================================================

// Importa a API de armazenamento local do React Native.
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importa as interfaces de tipos para garantir a consistência dos dados de autenticação.
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

// ========================================================================
// 2. CONSTANTES E DADOS MOCKADOS
// ========================================================================

// Define chaves padronizadas para o AsyncStorage para evitar erros de digitação ("magic strings").
const STORAGE_KEYS = {
  USER: '@MedicalApp:user', // Chave para o usuário logado.
  TOKEN: '@MedicalApp:token', // Chave para o token de autenticação.
  REGISTERED_USERS: '@MedicalApp:registeredUsers', // Chave para a lista de pacientes registrados.
};

// Array de médicos mockados com credenciais fixas para login.
const mockDoctors = [
  { id: '1', name: 'Dr. João Silva', email: 'joao@example.com', role: 'doctor' as const, specialty: 'Cardiologia', image: '...' },
  { id: '2', name: 'Dra. Maria Santos', email: 'maria@example.com', role: 'doctor' as const, specialty: 'Pediatria', image: '...' },
  { id: '3', name: 'Dr. Pedro Oliveira', email: 'pedro@example.com', role: 'doctor' as const, specialty: 'Ortopedia', image: '...' },
];

// Objeto para o administrador mockado com credenciais fixas.
const mockAdmin = {
  id: 'admin',
  name: 'Administrador',
  email: 'admin@example.com',
  role: 'admin' as const,
  image: 'https://randomuser.me/api/portraits/men/3.jpg',
};

// Array em memória para armazenar os usuários pacientes registrados durante a execução do app.
// Ele é "hidratado" (preenchido) com dados do AsyncStorage no início da aplicação.
let registeredUsers: (User & { password: string })[] = [];

// ========================================================================
// 3. DEFINIÇÃO DO SERVIÇO DE AUTENTICAÇÃO
// ========================================================================

// `authService` é um objeto que agrupa todas as funções relacionadas à autenticação.
export const authService = {

  /**
   * Simula o processo de login.
   * Verifica as credenciais em uma ordem específica: admin, médicos, pacientes.
   * @param credentials - Objeto com email e senha.
   * @returns Uma Promise que resolve com a resposta de autenticação (usuário e token).
   * @throws Um erro se as credenciais forem inválidas.
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    // 1. Verifica se é o admin.
    if (credentials.email === mockAdmin.email && credentials.password === '123456') {
      return { user: mockAdmin, token: 'admin-token' };
    }

    // 2. Verifica se é um dos médicos mockados.
    const doctor = mockDoctors.find(d => d.email === credentials.email && credentials.password === '123456');
    if (doctor) {
      return { user: doctor, token: `doctor-token-${doctor.id}` };
    }

    // 3. Verifica se é um paciente registrado.
    const patient = registeredUsers.find(p => p.email === credentials.email);
    if (patient) {
      // Se o paciente existe, verifica a senha.
      if (credentials.password === patient.password) {
        // Remove a senha do objeto de usuário antes de retorná-lo por segurança.
        const { password, ...patientWithoutPassword } = patient;
        return { user: patientWithoutPassword, token: `patient-token-${patient.id}` };
      }
    }

    // Se nenhuma credencial corresponder, lança um erro.
    throw new Error('Email ou senha inválidos');
  },

  /**
   * Simula o processo de registro de um novo paciente.
   * @param data - Objeto com nome, email e senha do novo usuário.
   * @returns Uma Promise que resolve com a resposta de autenticação do novo usuário.
   * @throws Um erro se o email já estiver em uso.
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Verifica se o email já está em uso por qualquer tipo de usuário.
    if (
      mockDoctors.some((d) => d.email === data.email) ||
      mockAdmin.email === data.email ||
      registeredUsers.some((u) => u.email === data.email)
    ) {
      throw new Error('Email já está em uso');
    }

    // Cria o objeto para o novo paciente.
    const newPatient: User & { password: string } = {
      id: `patient-${registeredUsers.length + 1}`,
      name: data.name,
      email: data.email,
      role: 'patient' as const,
      image: `https://randomuser.me/api/portraits/${registeredUsers.length % 2 === 0 ? 'men' : 'women'}/${registeredUsers.length + 1}.jpg`,
      password: data.password,
    };

    // Adiciona o novo paciente à lista em memória.
    registeredUsers.push(newPatient);

    // Salva a lista atualizada de usuários no AsyncStorage para persistência.
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));

    // Remove a senha do objeto antes de retorná-lo.
    const { password, ...patientWithoutPassword } = newPatient;
    return { user: patientWithoutPassword, token: `patient-token-${newPatient.id}` };
  },

  /**
   * Simula o processo de logout.
   * Limpa os dados da sessão do usuário do armazenamento local.
   */
  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Obtém os dados do usuário logado do armazenamento local.
   * Usado para restaurar a sessão quando o aplicativo é iniciado.
   * @returns Uma Promise que resolve com o objeto User ou null se não houver sessão.
   */
  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Erro ao obter usuário armazenado:', error);
      return null;
    }
  },

  // --- Funções para o Painel de Administração ---

  /**
   * Retorna uma lista combinada de todos os usuários (médicos e pacientes).
   */
  async getAllUsers(): Promise<User[]> {
    return [...mockDoctors, ...registeredUsers];
  },

  /**
   * Retorna a lista de médicos.
   */
  async getAllDoctors(): Promise<User[]> {
    return mockDoctors;
  },

  /**
   * Retorna a lista de pacientes.
   */
  async getPatients(): Promise<User[]> {
    return registeredUsers;
  },

  /**
   * Carrega a lista de pacientes registrados do AsyncStorage para a variável em memória.
   * Esta função é essencial e deve ser chamada na inicialização do aplicativo
   * para "hidratar" o serviço com os dados persistidos.
   */
  async loadRegisteredUsers(): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (usersJson) {
        registeredUsers = JSON.parse(usersJson);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  },
};