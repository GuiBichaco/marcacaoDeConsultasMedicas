/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `NotificationsScreen.tsx`
 * * Descrição: Este arquivo define o componente `NotificationsScreen`, que é a tela responsável
 * por exibir uma lista de notificações para o usuário logado. A tela permite que o usuário
 * visualize, marque como lida (individualmente ou todas de uma vez) e exclua notificações.
 *
 * * Funcionalidades Principais:
 * 1. Busca e exibe notificações específicas do usuário a partir de um `notificationService`.
 * 2. Atualiza a lista de notificações automaticamente sempre que a tela ganha foco.
 * 3. Permite marcar notificações como lidas individualmente (com um toque) ou em massa.
 * 4. Permite excluir notificações (com um toque longo e um diálogo de confirmação).
 * 5. Exibe um contador de notificações não lidas e diferencia visualmente as notificações lidas das não lidas.
 * 6. Apresenta ícones diferentes para cada tipo de notificação.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa hooks e tipos essenciais do React e React Native.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, Alert } from 'react-native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Button, ListItem, Badge } from 'react-native-elements';

// Importa hooks customizados e de navegação.
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Importa tipos de navegação.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importa o tema, componentes, serviços e tipos.
import theme from '../styles/theme';
import Header from '../components/Header';
import { notificationService, Notification } from '../services/notifications';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notifications'>;
};

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const NotificationsScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E ESTADOS
  // ----------------------------------------------------------------------

  const { user } = useAuth();
  const navigation = useNavigation<NotificationsScreenProps['navigation']>();
  
  // Estado para armazenar a lista de notificações do usuário.
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Estado para controlar a exibição do indicador de carregamento.
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------
  // 3.2. FUNÇÕES DE DADOS E AÇÕES
  // ----------------------------------------------------------------------

  // Função assíncrona para carregar as notificações do usuário a partir do serviço.
  const loadNotifications = async () => {
    if (!user?.id) return; // Garante que há um usuário logado.
    
    try {
      const userNotifications = await notificationService.getNotifications(user.id);
      setNotifications(userNotifications); // Atualiza o estado com as notificações recebidas.
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false); // Desativa o indicador de carregamento.
    }
  };

  // Hook `useFocusEffect` para recarregar as notificações sempre que a tela ganhar foco.
  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, [user?.id])
  );

  // Função para marcar uma notificação específica como lida.
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      loadNotifications(); // Recarrega a lista para refletir a mudança.
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  // Função para marcar todas as notificações do usuário como lidas.
  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      loadNotifications(); // Recarrega a lista.
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  // Função para excluir uma notificação, com um diálogo de confirmação.
  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Excluir Notificação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' }, // Botão de cancelar.
        {
          text: 'Excluir',
          style: 'destructive', // Estilo destrutivo (vermelho no iOS).
          onPress: async () => { // Função executada se o usuário confirmar.
            try {
              await notificationService.deleteNotification(notificationId);
              loadNotifications(); // Recarrega a lista.
            } catch (error) {
              console.error('Erro ao excluir notificação:', error);
            }
          },
        },
      ]
    );
  };

  // ----------------------------------------------------------------------
  // 3.3. FUNÇÕES AUXILIARES (HELPERS) E VALORES COMPUTADOS
  // ----------------------------------------------------------------------

  // Função auxiliar para retornar um ícone (emoji) com base no tipo da notificação.
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed': return '✅';
      case 'appointment_cancelled': return '❌';
      case 'appointment_reminder': return '⏰';
      default: return '📩';
    }
  };

  // Função auxiliar para formatar a data e hora para o padrão brasileiro.
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // Valor computado: calcula o número de notificações não lidas diretamente do estado.
  const unreadCount = notifications.filter(n => !n.read).length;

  // ----------------------------------------------------------------------
  // 3.4. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título da tela com um contador de notificações não lidas. */}
        <TitleContainer>
          <Title>Notificações</Title>
          {unreadCount > 0 && (
            <Badge value={unreadCount} status="error" containerStyle={styles.badge} />
          )}
        </TitleContainer>

        {/* Botão para marcar todas como lidas, visível apenas se houver notificações não lidas. */}
        {unreadCount > 0 && (
          <Button
            title="Marcar todas como lidas"
            onPress={handleMarkAllAsRead}
            containerStyle={styles.markAllButton as ViewStyle}
            buttonStyle={styles.markAllButtonStyle}
          />
        )}

        {/* Botão para voltar à tela anterior. */}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Lógica de renderização condicional para a lista de notificações. */}
        {loading ? (
          <LoadingText>Carregando notificações...</LoadingText>
        ) : notifications.length === 0 ? (
          <EmptyContainer>
            <EmptyText>Nenhuma notificação encontrada</EmptyText>
          </EmptyContainer>
        ) : (
          // Mapeia a lista de notificações para renderizar um card para cada uma.
          notifications.map((notification) => (
            // Componente: NotificationCard (Card que exibe a notificação)
            <NotificationCard key={notification.id} isRead={notification.read}>
              <ListItem
                // Um toque curto em uma notificação não lida a marca como lida.
                onPress={() => !notification.read && handleMarkAsRead(notification.id)}
                // Um toque longo abre o diálogo para excluir a notificação.
                onLongPress={() => handleDeleteNotification(notification.id)}
              >
                <NotificationIcon>{getNotificationIcon(notification.type)}</NotificationIcon>
                <ListItem.Content>
                  <NotificationHeader>
                    <ListItem.Title style={styles.title}>{notification.title}</ListItem.Title>
                    {/* Exibe um ponto vermelho se a notificação não foi lida. */}
                    {!notification.read && <UnreadDot />}
                  </NotificationHeader>
                  <ListItem.Subtitle style={styles.message}>{notification.message}</ListItem.Subtitle>
                  <DateText>{formatDate(notification.createdAt)}</DateText>
                </ListItem.Content>
              </ListItem>
            </NotificationCard>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLES E STYLED COMPONENTS)
// ========================================================================

const styles = {
  scrollContent: { padding: 20, },
  badge: { marginLeft: 8, },
  markAllButton: { marginBottom: 15, width: '100%', },
  markAllButtonStyle: { backgroundColor: theme.colors.success, paddingVertical: 10, },
  button: { marginBottom: 20, width: '100%', },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12, },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, },
  message: { fontSize: 14, color: theme.colors.text, marginTop: 4, lineHeight: 20, },
};

// --- Styled Components ---

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyContainer = styled.View`
  align-items: center;
  margin-top: 40px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  opacity: 0.7;
`;

// Card de notificação com estilo dinâmico (cor de fundo e borda) baseado no estado `isRead`.
const NotificationCard = styled.View<{ isRead: boolean }>`
  background-color: ${(props) => props.isRead ? theme.colors.white : theme.colors.primary + '10'};
  border-radius: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${(props) => props.isRead ? theme.colors.border : theme.colors.primary + '30'};
`;

const NotificationIcon = styled.Text`
  font-size: 20px;
  margin-right: 8px;
`;

// Cabeçalho da notificação para alinhar o título e o ponto de "não lido".
const NotificationHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

// Ponto vermelho para indicar uma notificação não lida.
const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${theme.colors.error};
  margin-left: 8px;
`;

// Texto para a data da notificação.
const DateText = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: 4px;
`;

export default NotificationsScreen;