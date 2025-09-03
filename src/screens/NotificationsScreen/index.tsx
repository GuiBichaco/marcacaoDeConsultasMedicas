/**
 * @file Componente da tela de Notificações.
 * @description Esta é a camada de visualização, que utiliza o hook `useNotifications`
 * para a lógica e o componente `NotificationItem` para renderizar a lista.
 */

import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Badge } from 'react-native-elements';
import Header from '../../../components/Header';
import theme from '../../../styles/theme';

// Importações locais
import { useNotifications } from './hooks/useNotifications';
import NotificationItem from './components/NotificationItem';
import {
  Container,
  ScrollView,
  TitleContainer,
  Title,
  LoadingText,
  EmptyText,
  styles,
} from './styles';

const NotificationsScreen: React.FC = () => {
  const {
    loading,
    notifications,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleGoBack,
  } = useNotifications();

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />;
    }
    if (notifications.length === 0) {
      return <EmptyText>Nenhuma notificação encontrada</EmptyText>;
    }
    return notifications.map((item) => (
      <NotificationItem
        key={item.id}
        item={item}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    ));
  };

  return (
    <Container>
      <Header />
      <ScrollView>
        <TitleContainer>
          <Title>Notificações</Title>
          {unreadCount > 0 && (
            <Badge value={unreadCount} status="error" containerStyle={styles.badge} />
          )}
        </TitleContainer>

        {unreadCount > 0 && (
          <Button
            title="Marcar todas como lidas"
            onPress={handleMarkAllAsRead}
            containerStyle={styles.markAllButton}
            buttonStyle={styles.markAllButtonStyle}
          />
        )}
        <Button
          title="Voltar"
          onPress={handleGoBack}
          containerStyle={styles.button}
          buttonStyle={styles.buttonStyle}
        />
        
        {renderContent()}

      </ScrollView>
    </Container>
  );
};

export default NotificationsScreen;