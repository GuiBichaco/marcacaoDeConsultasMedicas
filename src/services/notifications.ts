/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `notificationService.ts`
 * * Descrição: Este arquivo define o `notificationService`, um serviço **mockado (simulado)** responsável
 * por gerenciar todas as operações relacionadas a notificações no aplicativo. Ele utiliza o
 * armazenamento local (`AsyncStorage`) para simular um banco de dados de notificações.
 *
 * * Funcionalidades Principais:
 * 1.  **CRUD completo:** Fornece funções para Criar, Ler, Atualizar e Deletar notificações.
 * 2.  **Gerenciamento de Estado:** Mantém o estado de "lido" e "não lido" das notificações.
 * 3.  **Abstração de Lógica:** Oferece métodos de alto nível para criar notificações para eventos
 * específicos do sistema (ex: consulta confirmada, cancelada, etc.), mantendo a
 * lógica de formatação de mensagens centralizada.
 * 4.  **Simulação de Backend:** Permite o desenvolvimento e teste da funcionalidade de notificações
 * sem a necessidade de um servidor de backend real.
 */

// ========================================================================
// 1. IMPORTAÇÕES E TIPOS
// ========================================================================

// Importa a API de armazenamento local do React Native.
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a interface (o "contrato") para um objeto de Notificação.
export interface Notification {
  id: string; // Identificador único da notificação.
  userId: string; // ID do usuário que deve receber a notificação.
  title: string; // Título da notificação.
  message: string; // Mensagem principal.
  type: 'appointment_confirmed' | 'appointment_cancelled' | 'appointment_reminder' | 'general'; // Tipo para categorização.
  read: boolean; // Status que indica se a notificação foi lida.
  createdAt: string; // Data e hora de criação no formato ISO.
  appointmentId?: string; // ID opcional da consulta relacionada.
}

// Define a chave padronizada para o AsyncStorage onde todas as notificações serão salvas.
const STORAGE_KEY = '@MedicalApp:notifications';

// ========================================================================
// 2. DEFINIÇÃO DO SERVIÇO DE NOTIFICAÇÕES
// ========================================================================

// `notificationService` é um objeto que agrupa todas as funções relacionadas a notificações.
export const notificationService = {
  /**
   * Busca todas as notificações de um usuário específico.
   * @param userId - O ID do usuário para o qual as notificações serão buscadas.
   * @returns Uma Promise que resolve com um array de notificações do usuário, ordenadas da mais recente para a mais antiga.
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      // Lê todas as notificações salvas; se não houver, inicia com um array vazio.
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      // Filtra para retornar apenas as notificações do usuário especificado e as ordena pela data de criação.
      return allNotifications.filter(n => n.userId === userId).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      return []; // Retorna um array vazio em caso de erro.
    }
  },

  /**
   * Cria e salva uma nova notificação.
   * @param notification - Um objeto contendo os dados da notificação a ser criada (sem id, createdAt e read).
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      // Cria o objeto completo da nova notificação com dados gerados automaticamente.
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(), // ID único baseado no timestamp.
        createdAt: new Date().toISOString(), // Data atual no formato ISO.
        read: false, // Toda nova notificação começa como "não lida".
      };

      allNotifications.push(newNotification);
      // Salva a lista atualizada de volta no AsyncStorage.
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifications));
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  },

  /**
   * Marca uma notificação específica como lida.
   * @param notificationId - O ID da notificação a ser atualizada.
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      // Usa `map` para criar uma nova lista, atualizando a propriedade `read` da notificação correspondente.
      const updatedNotifications = allNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  /**
   * Marca todas as notificações de um usuário como lidas.
   * @param userId - O ID do usuário cujas notificações serão marcadas como lidas.
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      // Mapeia a lista e atualiza todas as notificações que pertencem ao usuário.
      const updatedNotifications = allNotifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  },

  /**
   * Deleta uma notificação específica.
   * @param notificationId - O ID da notificação a ser deletada.
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      // Usa `filter` para criar uma nova lista sem a notificação a ser deletada.
      const filteredNotifications = allNotifications.filter(n => n.id !== notificationId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  },

  /**
   * Calcula e retorna o número de notificações não lidas de um usuário.
   * @param userId - O ID do usuário.
   * @returns Uma Promise que resolve com o número de notificações não lidas.
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }
  },

  // --- Funções de alto nível para eventos específicos do sistema ---
  // Estas funções abstraem a criação de notificações, tornando o código mais legível e fácil de manter.

  /**
   * Cria e envia uma notificação para o paciente quando sua consulta é confirmada.
   */
  async notifyAppointmentConfirmed(patientId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: patientId,
      type: 'appointment_confirmed',
      title: 'Consulta Confirmada',
      message: `Sua consulta com ${appointmentDetails.doctorName} foi confirmada para ${appointmentDetails.date} às ${appointmentDetails.time}.`,
      appointmentId: appointmentDetails.id,
    });
  },

  /**
   * Cria e envia uma notificação para o paciente quando sua consulta é cancelada.
   */
  async notifyAppointmentCancelled(patientId: string, appointmentDetails: any, reason?: string): Promise<void> {
    await this.createNotification({
      userId: patientId,
      type: 'appointment_cancelled',
      title: 'Consulta Cancelada',
      message: `Sua consulta com ${appointmentDetails.doctorName} foi cancelada.${reason ? ` Motivo: ${reason}` : ''}`,
      appointmentId: appointmentDetails.id,
    });
  },

  /**
   * Cria e envia uma notificação para o médico quando um novo agendamento é feito.
   */
  async notifyNewAppointment(doctorId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: doctorId,
      type: 'general',
      title: 'Nova Consulta Agendada',
      message: `${appointmentDetails.patientName} agendou uma consulta para ${appointmentDetails.date} às ${appointmentDetails.time}.`,
      appointmentId: appointmentDetails.id,
    });
  },

  /**
   * Cria e envia uma notificação de lembrete de consulta.
   */
  async notifyAppointmentReminder(userId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: userId,
      type: 'appointment_reminder',
      title: 'Lembrete de Consulta',
      message: `Você tem uma consulta agendada para amanhã às ${appointmentDetails.time} com ${appointmentDetails.doctorName || appointmentDetails.patientName}.`,
      appointmentId: appointmentDetails.id,
    });
  },
};