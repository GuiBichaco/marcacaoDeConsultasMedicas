/**
 * @file Contém os estilos para a tela EditProfileScreen.
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

export const ProfileFormContainer = styled.View`
  background-color: ${theme.colors.card};
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

export const RoleBadge = styled.View<{ role: string }>`
  background-color: ${({ role }) => {
    switch (role) {
      case 'admin': return theme.colors.primary + '30';
      case 'doctor': return theme.colors.success + '30';
      default: return theme.colors.secondary + '30';
    }
  }};
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
`;

export const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

// --- StyleSheet Object ---
export const styles = {
  input: { marginBottom: 15 },
  button: { marginBottom: 15, width: '100%' } as ViewStyle,
  saveButton: { backgroundColor: theme.colors.success, paddingVertical: 12 },
  cancelButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
};