/**
 * @file Hook customizado para gerenciar a lógica da tela de Perfil.
 * @description Ele obtém dados do contexto de autenticação e fornece
 * handlers para as ações de navegação e logout.
 */

import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';

// Tipagem para a navegação
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export const useProfileScreen = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NavigationProps>();

  /**
   * Navega para a tela de edição de perfil.
   */
  const handleNavigateToEdit = () => {
    // O 'as any' foi removido para uma tipagem mais segura,
    // garantindo que 'EditProfile' existe em RootStackParamList.
    navigation.navigate('EditProfile');
  };

  /**
   * Volta para a tela anterior na pilha de navegação.
   */
  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    user,
    handleNavigateToEdit,
    handleGoBack,
    handleSignOut: signOut, // Expõe a função signOut diretamente.
  };
};