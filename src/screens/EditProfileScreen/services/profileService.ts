/**
 * @file Serviço para gerenciar as operações de dados do perfil do usuário.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../../contexts/AuthContext'; // Ajustar caminho

/**
 * Atualiza os dados do usuário no estado global e no armazenamento local.
 * @param updatedUser O objeto de usuário com as informações atualizadas.
 * @param updateUserFn A função `updateUser` do AuthContext para atualizar o estado global.
 * @throws Lança um erro se a operação de salvamento falhar.
 */
export const saveUserProfile = async (
  updatedUser: User,
  updateUserFn: (user: User) => Promise<void>
): Promise<void> => {
  // 1. Atualiza o estado global através da função do contexto
  await updateUserFn(updatedUser);

  // 2. Persiste o usuário atualizado no AsyncStorage
  await AsyncStorage.setItem('@MedicalApp:user', JSON.stringify(updatedUser));
};