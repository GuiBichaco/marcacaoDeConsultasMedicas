/**
 * @file Contém os estilos para a tela ProfileScreen e seus componentes filhos.
 */
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import { ViewStyle } from 'react-native';

// --- Styled Components ---

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 20,
  },
})`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Estilos para o ProfileCard
export const ProfileCardContainer = styled.View`
  background-color: ${theme.colors.card}; /* Cor ajustada para card */
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

export const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

export const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

export const Email = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

export const RoleBadge = styled.View<{ role: string }>`
  background-color: ${({ role }) => {
    switch (role) {
      case 'admin': return theme.colors.primary + '30'; // Transparência ajustada
      case 'doctor': return theme.colors.success + '30';
      default: return theme.colors.secondary + '30';
    }
  }};
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

export const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

export const SpecialtyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

// --- StyleSheet Object ---
export const styles = {
  button: { marginBottom: 15, width: '100%' } as ViewStyle,
  editButton: { backgroundColor: theme.colors.success, paddingVertical: 12 },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
  logoutButton: { backgroundColor: theme.colors.error, paddingVertical: 12 },
};