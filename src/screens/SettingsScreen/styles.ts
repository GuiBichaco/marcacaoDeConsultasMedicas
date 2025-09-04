/**
 * @file Contém os estilos para a tela SettingsScreen e seus componentes.
 */
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import { ViewStyle } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 20,
    paddingBottom: 40,
  },
})``;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 20px;
`;

export const SettingsCard = styled.View`
  background-color: ${theme.colors.card};
  border-radius: 8px;
  margin-bottom: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden;
`;

export const InfoItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const InfoLabel = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
`;

export const InfoValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

export const styles = {
  button: { marginBottom: 15, width: '100%' } as ViewStyle,
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
  backupButton: { backgroundColor: theme.colors.success, paddingVertical: 12 },
  cacheButton: { backgroundColor: theme.colors.warning, paddingVertical: 12 },
  dangerButton: { backgroundColor: theme.colors.error, paddingVertical: 12 },
};