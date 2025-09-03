/**
 * @file Hook customizado para gerenciar a lógica da tela de edição de perfil.
 */
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { saveUserProfile } from '../services/profileService';

export const useEditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();

  // Estados do formulário, inicializados com os dados do usuário
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [loading, setLoading] = useState(false);

  /**
   * Lida com o salvamento das alterações do perfil.
   */
  const handleSave = async () => {
    // 1. Validação
    if (!name.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      // 2. Monta o objeto de usuário atualizado
      const updatedUser = {
        ...user!,
        name: name.trim(),
        email: email.trim(),
        ...(user?.role === 'doctor' && { specialty: specialty.trim() }),
      };

      // 3. Chama o serviço para salvar os dados
      await saveUserProfile(updatedUser, updateUser);

      // 4. Feedback e navegação
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lida com o cancelamento da edição.
   */
  const handleCancel = () => {
    navigation.goBack();
  };

  return {
    user,
    name,
    setName,
    email,
    setEmail,
    specialty,
    setSpecialty,
    loading,
    handleSave,
    handleCancel,
  };
};