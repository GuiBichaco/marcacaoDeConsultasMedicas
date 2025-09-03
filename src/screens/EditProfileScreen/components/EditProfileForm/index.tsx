/**
 * @file Componente de UI para o formulário de edição de perfil.
 */
import React from 'react';
import { Input } from 'react-native-elements';
import { User } from '../../../../contexts/AuthContext'; // Ajustar caminho
import {
  ProfileFormContainer,
  Avatar,
  RoleBadge,
  RoleText,
  styles,
} from '../../styles';

// Tipagem das props do componente
interface EditProfileFormProps {
  user: User | null;
  name: string;
  setName: (text: string) => void;
  email: string;
  setEmail: (text: string) => void;
  specialty: string;
  setSpecialty: (text: string) => void;
}

const getRoleText = (role?: string) => {
  if (role === 'admin') return 'Administrador';
  if (role === 'doctor') return 'Médico';
  return 'Paciente';
};

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user, name, setName, email, setEmail, specialty, setSpecialty
}) => {
  return (
    <ProfileFormContainer>
      <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />

      <Input
        label="Nome"
        value={name}
        onChangeText={setName}
        containerStyle={styles.input}
        placeholder="Digite seu nome"
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        containerStyle={styles.input}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {user?.role === 'doctor' && (
        <Input
          label="Especialidade"
          value={specialty}
          onChangeText={setSpecialty}
          containerStyle={styles.input}
          placeholder="Digite sua especialidade"
        />
      )}

      <RoleBadge role={user?.role || ''}>
        <RoleText>{getRoleText(user?.role)}</RoleText>
      </RoleBadge>
    </ProfileFormContainer>
  );
};

export default EditProfileForm;