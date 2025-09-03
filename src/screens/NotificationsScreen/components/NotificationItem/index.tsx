/**
 * @file Componente para exibir um único item da lista de notificações.
 */
import React from 'react';
import { ListItem } from 'react-native-elements';
import { Notification } from '../../../../services/notifications';
import {
  NotificationCardContainer,
  NotificationIcon,
  NotificationHeader,
  UnreadDot,
  DateText,
  styles,
} from '../../styles';

interface NotificationItemProps {
  item: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

// Funções auxiliares de formatação, pertencentes à apresentação deste componente.
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'appointment_confirmed': return '✅';
    case 'appointment_cancelled': return '❌';
    case 'appointment_reminder': return '⏰';
    default: return '📩';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onMarkAsRead, onDelete }) => {
  return (
    <NotificationCardContainer isRead={item.read}>
      <ListItem
        containerStyle={styles.listItemContainer}
        onPress={() => !item.read && onMarkAsRead(item.id)}
        onLongPress={() => onDelete(item.id)}
      >
        <NotificationIcon>{getNotificationIcon(item.type)}</NotificationIcon>
        <ListItem.Content>
          <NotificationHeader>
            <ListItem.Title style={styles.listItemTitle}>{item.title}</ListItem.Title>
            {!item.read && <UnreadDot />}
          </NotificationHeader>
          <ListItem.Subtitle style={styles.listItemMessage}>{item.message}</ListItem.Subtitle>
          <DateText>{formatDate(item.createdAt)}</DateText>
        </ListItem.Content>
      </ListItem>
    </NotificationCardContainer>
  );
};

export default NotificationItem;