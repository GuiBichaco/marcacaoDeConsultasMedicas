/**
 * @file Contém os estilos para a tela NotificationsScreen e seus componentes.
 */
import styled from 'styled-components/native';
import theme from '../../../styles/theme';
import { ViewStyle } from 'react-native';

// --- Styled Components para a tela principal ---

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 20,
    paddingBottom: 40,
  },
})``;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

export const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  opacity: 0.7;
  margin-top: 40px;
`;

// --- Styled Components para o NotificationItem ---

export const NotificationCardContainer = styled.View<{ isRead: boolean }>`
  background-color: ${({ isRead }) => isRead ? theme.colors.card : theme.colors.primary + '10'};
  border-radius: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${({ isRead }) => isRead ? theme.colors.border : theme.colors.primary + '30'};
  overflow: hidden; /* Garante que o ListItem não ultrapasse as bordas arredondadas */
`;

export const NotificationIcon = styled.Text`
  font-size: 20px;
`;

export const NotificationHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${theme.colors.error};
  margin-left: 8px;
`;

export const DateText = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: 4px;
`;

// --- StyleSheet Object ---
export const styles = {
  badge: { marginLeft: 8 },
  markAllButton: { marginBottom: 15, width: '100%' } as ViewStyle,
  markAllButtonStyle: { backgroundColor: theme.colors.success, paddingVertical: 10 },
  button: { marginBottom: 20, width: '100%' } as ViewStyle,
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
  
  // Estilos para o ListItem dentro do NotificationItem
  listItemContainer: { backgroundColor: 'transparent' },
  listItemTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
  listItemMessage: { fontSize: 14, color: theme.colors.text, marginTop: 4, lineHeight: 20 },
};