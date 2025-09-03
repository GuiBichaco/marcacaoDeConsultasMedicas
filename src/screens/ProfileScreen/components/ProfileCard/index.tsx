/**
 * @file Componente de UI que exibe as informações de perfil do usuário em um card.
 */
import React from 'react';
import { User } from '../../../../contexts/AuthContext'; // Ajustar caminho
import {
  ProfileCardContainer,
  Avatar,
  Name,
  Email,
  RoleBadge,
  RoleText,
  SpecialtyText,
} from '../../styles'; // Importa estilos do pai

interface ProfileCardProps {
  user: User | null;
}

/**
 * Função auxiliar para traduzir a 'role' (ex: 'admin') para um texto legível (ex: 'Administrador').
 */
const getRoleText = (role: string | undefined) => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'doctor': return 'Médico';
    case 'patient': return 'Paciente';
    default: return role || '';
  }
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  if (!user) {
    return null; // Não renderiza nada se não houver usuário
  }

  return (
    <ProfileCardContainer>
      <Avatar source={{ uri: user.image || 'https://via.placeholder.com/150' }} />
      <Name>{user.name}</Name>
      <Email>{user.email}</Email>
      <RoleBadge role={user.role}>
        <RoleText>{getRoleText(user.role)}</RoleText>
      </RoleBadge>

      {user.role === 'doctor' && user.specialty && (
        <SpecialtyText>Especialidade: {user.specialty}</SpecialtyText>
      )}
    </ProfileCardContainer>
  );
};

export default ProfileCard;