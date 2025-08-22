/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente `AppRoutes`, que configura um grupo de rotas de navegação
 * utilizando um Stack Navigator (navegador de pilha).
 *
 * Este conjunto de rotas provavelmente representa a navegação principal para um usuário
 * autenticado, incluindo a tela inicial, a tela de agendamento e a tela de perfil.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS E TELAS
// ========================================================================

// Importa a função para criar um navegador de pilha nativo da biblioteca React Navigation.
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa os componentes de tela que serão incluídos nesta pilha de navegação.
import HomeScreen from '../screens/HomeScreen';
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
import ProfileScreen from '../screens/ProfileScreen';

// ========================================================================
// 2. INICIALIZAÇÃO DO NAVEGADOR
// ========================================================================

// Cria uma instância do Stack Navigator que será usada para definir as rotas.
const Stack = createNativeStackNavigator();

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE ROTAS
// ========================================================================

// Exporta o componente `AppRoutes` como padrão. Este componente renderiza o navegador de pilha com suas telas.
export default function AppRoutes() {
  // O retorno do componente é a própria estrutura de navegação.
  return (
    // Stack.Navigator é o componente que envolve e gerencia o grupo de telas.
    <Stack.Navigator
      // `screenOptions` define configurações padrão que se aplicam a TODAS as telas dentro deste navegador.
      screenOptions={{
        // `headerShown: false` oculta o cabeçalho padrão em todas as telas.
        headerShown: false,
        // `animation` define a animação de transição padrão ao navegar entre as telas.
        // 'slide_from_right' faz a nova tela deslizar da direita para a esquerda.
        animation: 'slide_from_right',
      }}
    >
      {/* ---- Definição de cada tela (rota) na pilha ---- */}

      {/* Define a rota "Home", associando-a ao componente HomeScreen. */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Define a rota "CreateAppointment", associando-a ao componente CreateAppointmentScreen. */}
      <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />

      {/* Define a rota "Profile", associando-a ao componente ProfileScreen. */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}