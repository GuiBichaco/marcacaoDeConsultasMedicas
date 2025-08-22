/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente `AppNavigator`, que é o roteador principal do aplicativo.
 * Utilizando a biblioteca React Navigation, ele gerencia toda a estrutura de navegação
 * e decide quais telas o usuário pode acessar com base em seu estado de autenticação
 * (logado ou não) e em sua função (ex: admin, médico, paciente).
 *
 * É aqui que a lógica de rotas públicas vs. rotas protegidas é implementada.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS E TELAS
// ========================================================================

// Importa a biblioteca React.
import React from 'react';

// Importa os componentes essenciais da biblioteca React Navigation.
// NavigationContainer: O componente raiz que envolve toda a estrutura de navegação.
// createNativeStackNavigator: Um tipo de navegador que empilha as telas, permitindo navegar para frente e para trás.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa o hook 'useAuth' para acessar o estado de autenticação (usuário logado, estado de carregamento).
import { useAuth } from '../contexts/AuthContext';

// Importa os tipos de navegação para garantir a segurança de tipos nas rotas e parâmetros.
import { RootStackParamList } from '../types/navigation';

// Importa todos os componentes de tela que serão usados no navegador.
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';
import PatientDashboardScreen from '../screens/PatientDashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// ========================================================================
// 2. INICIALIZAÇÃO DO NAVEGADOR
// ========================================================================

// Cria uma instância do Stack Navigator, tipada com `RootStackParamList` para autocompletar e verificação de tipos.
const Stack = createNativeStackNavigator<RootStackParamList>();

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE NAVEGAÇÃO
// ========================================================================

// Declaração do componente `AppNavigator` que conterá toda a lógica de roteamento.
export const AppNavigator: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. LÓGICA DE CONTROLE DE ACESSO
  // ----------------------------------------------------------------------

  // Obtém o estado de 'user' (usuário logado) e 'loading' do contexto de autenticação.
  const { user, loading } = useAuth();

  // Durante o carregamento inicial (enquanto o app verifica o AsyncStorage por um usuário salvo),
  // não renderiza nada. Isso evita um "flash" da tela de login antes da autenticação ser confirmada.
  // Em uma aplicação real, aqui poderia ser exibida uma tela de splash/loading.
  if (loading) {
    return null;
  }

  // ----------------------------------------------------------------------
  // 3.2. RENDERIZAÇÃO DA ESTRUTURA DE NAVEGAÇÃO
  // ----------------------------------------------------------------------
  return (
    // O NavigationContainer é o componente de mais alto nível que gerencia o estado da navegação.
    <NavigationContainer>
      {/* Stack.Navigator define o grupo de telas que pertencem a esta pilha de navegação. */}
      <Stack.Navigator
        // Opções padrão para todas as telas neste navegador.
        screenOptions={{
          // `headerShown: false` desabilita o cabeçalho padrão em todas as telas.
          // Isso indica que cada tela provavelmente implementa seu próprio cabeçalho customizado.
          headerShown: false,
        }}
      >
        {/* Renderização Condicional de Rotas: A estrutura principal da navegação. */}
        {!user ? (
          // ---- ROTAS PÚBLICAS ----
          // Se NÃO houver um usuário logado, renderiza apenas as telas de Login e Registro.
          // O <></> (React.Fragment) é usado para agrupar múltiplos componentes sem adicionar um nó extra na árvore.
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // ---- ROTAS PROTEGIDAS ----
          // Se HOUVER um usuário logado, renderiza as telas internas do aplicativo.
          <>
            {/* Renderização Condicional por Função (Role-Based Routing) */}
            {/* A tela do painel administrativo só é registrada se a função do usuário for 'admin'. */}
            {user.role === 'admin' && (
              <Stack.Screen 
                name="AdminDashboard" 
                component={AdminDashboardScreen}
                options={{ title: 'Painel Administrativo' }}
              />
            )}
            
            {/* A tela do painel do médico só é registrada se a função do usuário for 'doctor'. */}
            {user.role === 'doctor' && (
              <Stack.Screen 
                name="DoctorDashboard" 
                component={DoctorDashboardScreen}
                options={{ title: 'Painel do Médico' }}
              />
            )}
            
            {/* A tela do painel do paciente só é registrada se a função do usuário for 'patient'. */}
            {user.role === 'patient' && (
              <Stack.Screen 
                name="PatientDashboard" 
                component={PatientDashboardScreen}
                options={{ title: 'Painel do Paciente' }}
              />
            )}

            {/* ---- Rotas Comuns para todos os usuários autenticados ---- */}
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Início' }}
            />
            <Stack.Screen 
              name="CreateAppointment" 
              component={CreateAppointmentScreen}
              options={{ title: 'Agendar Consulta' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Perfil' }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ title: 'Editar Perfil' }}
            />
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen}
              options={{ title: 'Notificações' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Configurações' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};