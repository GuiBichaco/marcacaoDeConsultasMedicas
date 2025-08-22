/**
 * Tipos relacionados à navegação
 * Este arquivo contém todas as definições de tipos necessárias para a navegação entre telas
 */

/**
 * Define as rotas disponíveis na aplicação e seus parâmetros
 * @property Login - Tela de login
 * @property Register - Tela de registro
 * @property Home - Tela inicial da aplicação
 * @property CreateAppointment - Tela de criação de consulta
 * @property Profile - Tela de perfil do usuário
 * @property EditProfile - Tela para editar o perfil do usuário
 * @property AdminDashboard - Tela do painel de administração
 * @property DoctorDashboard - Tela do painel do médico
 * @property PatientDashboard - Tela do painel do paciente
 * @property UserManagement - Tela de gerenciamento de usuários
 * @property Notifications - Tela para exibir as notificações do usuário
 * @property Settings - Tela de configurações do aplicativo
 */
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CreateAppointment: undefined;
  Profile: undefined;
  EditProfile: undefined;
  AdminDashboard: undefined;
  DoctorDashboard: undefined;
  PatientDashboard: undefined;
  UserManagement: undefined;
  Notifications: undefined;
  Settings: undefined;
};