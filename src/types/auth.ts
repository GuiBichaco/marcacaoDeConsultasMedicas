/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `auth.ts` (ou similar, dentro de uma pasta `types`)
 * * Descrição: Este arquivo centraliza todas as definições de tipos e interfaces do TypeScript
 * relacionadas ao domínio de "Autenticação e Autorização". Ele estabelece um contrato claro
 * para a estrutura de dados de usuários, credenciais, respostas de API e para o próprio
 * Contexto de Autenticação.
 *
 * * Vantagens:
 * 1.  **Clareza e Organização:** Agrupa todos os tipos relacionados à autenticação em um único local.
 * 2.  **Segurança de Tipos:** Garante que toda a aplicação (componentes, serviços, etc.)
 * utilize os mesmos formatos de dados para usuários, evitando bugs e facilitando o
 * desenvolvimento com autocompletar e verificação de erros.
 * 3.  **Herança e Reutilização:** Utiliza herança (`extends`) para criar tipos de usuários
 * específicos a partir de uma base comum, evitando a repetição de código.
 * 4.  **Uniões Discriminadas:** Usa o campo `role` como um "discriminante" para que o
 * TypeScript possa inferir inteligentemente se um objeto `User` é um `Admin`, `Doctor` ou `Patient`.
 */

// ========================================================================
// 1. FUNÇÕES (ROLES) E TIPOS BASE DE USUÁRIO
// ========================================================================

/**
 * Define os perfis (funções) de usuário disponíveis no sistema.
 * Usar uma união de literais de string garante que apenas estes valores possam ser atribuídos à propriedade `role`.
 */
export type UserRole = 'admin' | 'doctor' | 'patient';

/**
 * Define a estrutura base compartilhada por todos os tipos de usuários no sistema.
 * Outras interfaces de usuário (Doctor, Patient, Admin) irão herdar estas propriedades.
 */
export interface BaseUser {
  // Identificador único do usuário (ex: UUID).
  id: string;
  // Nome completo do usuário.
  name: string;
  // Endereço de email do usuário, usado para login.
  email: string;
  // A função do usuário no sistema, definida pelo tipo `UserRole`.
  role: UserRole;
  // URL para a imagem de avatar do usuário.
  image: string;
}

// ========================================================================
// 2. TIPOS DE USUÁRIO ESPECÍFICOS
// ========================================================================

/**
 * Representa um usuário com o perfil de Médico.
 * Herda todas as propriedades de `BaseUser` e adiciona campos específicos para médicos.
 */
export interface Doctor extends BaseUser {
  // "Estreita" (narrows) a propriedade `role` para ser exclusivamente 'doctor'. Isso é parte da união discriminada.
  role: 'doctor';
  // A especialidade médica do doutor.
  specialty: string;
}

/**
 * Representa um usuário com o perfil de Paciente.
 * Herda todas as propriedades de `BaseUser`.
 */
export interface Patient extends BaseUser {
  // Estreita a propriedade `role` para ser exclusivamente 'patient'.
  role: 'patient';
}

/**
 * Representa um usuário com o perfil de Administrador.
 * Herda todas as propriedades de `BaseUser`.
 */
export interface Admin extends BaseUser {
  // Estreita a propriedade `role` para ser exclusivamente 'admin'.
  role: 'admin';
}

/**
 * Define o tipo `User` como uma união dos três tipos específicos.
 * Um objeto do tipo `User` pode ser um `Admin`, um `Doctor` ou um `Patient`.
 * O TypeScript usará a propriedade `role` para determinar qual é o tipo exato em um dado contexto.
 */
export type User = Admin | Doctor | Patient;

// ========================================================================
// 3. ESTRUTURAS DE DADOS DE AUTENTICAÇÃO
// ========================================================================

/**
 * Define a estrutura de dados para as credenciais de login.
 */
export interface LoginCredentials {
  // O email fornecido pelo usuário para tentar o login.
  email: string;
  // A senha fornecida pelo usuário.
  password: string;
}

/**
 * Define a estrutura de dados para o registro de um novo usuário.
 */
export interface RegisterData {
  // O nome completo do novo usuário.
  name: string;
  // O email que será associado à nova conta.
  email: string;
  // A senha escolhida para a nova conta.
  password: string;
}

/**
 * Define a estrutura da resposta esperada do serviço de autenticação após um login ou registro bem-sucedido.
 */
export interface AuthResponse {
  // O objeto completo do usuário autenticado.
  user: User;
  // Um token de autenticação (ex: JWT) que pode ser usado para futuras requisições.
  token: string;
}

// ========================================================================
// 4. ESTRUTURA DO CONTEXTO DE AUTENTICAÇÃO
// ========================================================================

/**
 * Define o "contrato" do `AuthContext`.
 * Especifica quais dados e funções o `AuthProvider` deve fornecer para os componentes
 * que consumirem este contexto através do hook `useAuth`.
 */
export interface AuthContextData {
  // O objeto do usuário atualmente logado, ou `null` se não houver ninguém autenticado.
  user: User | null;
  // Um booleano que indica se o estado de autenticação inicial ainda está sendo carregado (ex: lendo do AsyncStorage).
  loading: boolean;
  // Função para iniciar o processo de login. Recebe as credenciais e retorna uma Promise.
  signIn: (credentials: LoginCredentials) => Promise<void>;
  // Função para registrar um novo usuário. Recebe os dados de registro e retorna uma Promise.
  register: (data: RegisterData) => Promise<void>;
  // Função para fazer logout do usuário atual.
  signOut: () => Promise<void>;
  // Função para atualizar os dados do usuário logado no contexto e no armazenamento.
  updateUser: (user: User) => Promise<void>;
}