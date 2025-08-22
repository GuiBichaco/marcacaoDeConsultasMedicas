/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `DoctorDashboardScreen.tsx`
 * * Descrição: Este arquivo define o componente `DoctorDashboardScreen`, a tela principal para usuários do tipo "médico".
 * A tela funciona como um painel central, exibindo estatísticas de desempenho do médico e uma lista de suas
 * consultas agendadas. O médico pode confirmar ou cancelar consultas pendentes através de um modal de ação.
 *
 * * Funcionalidades Principais:
 * 1. Busca e exibe dados do armazenamento local (`AsyncStorage`), filtrando para mostrar apenas as consultas do médico logado.
 * 2. Carrega e exibe estatísticas específicas do médico a partir de um serviço.
 * 3. Utiliza um modal (`AppointmentActionModal`) para confirmar ou cancelar consultas, melhorando a experiência do usuário.
 * 4. Notifica o paciente sobre a confirmação ou cancelamento de sua consulta.
 * 5. Atualiza os dados da tela automaticamente sempre que ela ganha foco.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa hooks e tipos essenciais do React e React Native.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Button, ListItem, Text } from 'react-native-elements';

// Importa hooks customizados para autenticação e navegação.
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Importa tipos de navegação.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importa o tema, componentes customizados, serviços e AsyncStorage.
import theme from '../styles/theme';
import Header from '../components/Header';
import StatisticsCard from '../components/StatisticsCard';
import AppointmentActionModal from '../components/AppointmentActionModal';
import { statisticsService, Statistics } from '../services/statistics';
import { notificationService } from '../services/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS E INTERFACES LOCAIS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type DoctorDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorDashboard'>;
};

// Interface para o objeto de Consulta.
interface Appointment { /* ... */ }
// Interface para as props de estilo dos `styled-components`.
interface StyledProps { status: string; }

// ========================================================================
// 3. FUNÇÕES AUXILIARES (HELPERS)
// ========================================================================

// Função auxiliar para retornar uma cor baseada no status da consulta.
const getStatusColor = (status: string) => { /* ... */ };
// Função auxiliar para retornar um texto formatado baseado no status da consulta.
const getStatusText = (status: string) => { /* ... */ };

// ========================================================================
// 4. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const DoctorDashboardScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 4.1. HOOKS E ESTADOS
  // ----------------------------------------------------------------------

  const { user, signOut } = useAuth();
  const navigation = useNavigation<DoctorDashboardScreenProps['navigation']>();
  
  // Estados para os dados da tela.
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statistics, setStatistics] = useState<Partial<Statistics> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar o modal de confirmação/cancelamento.
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'cancel'>('confirm');

  // ----------------------------------------------------------------------
  // 4.2. FUNÇÕES DE DADOS E MANIPULAÇÃO DO MODAL
  // ----------------------------------------------------------------------

  // Função para carregar os dados específicos do médico.
  const loadAppointments = async () => {
    try {
      // Carrega todas as consultas do AsyncStorage.
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        // Filtra para obter apenas as consultas do médico logado.
        const doctorAppointments = allAppointments.filter(app => app.doctorId === user?.id);
        setAppointments(doctorAppointments);
      }

      // Carrega as estatísticas específicas deste médico através do serviço.
      if (user?.id) {
        const stats = await statisticsService.getDoctorStatistics(user.id);
        setStatistics(stats);
      }
    } catch (error) {
      console.error('Erro ao carregar consultas do médico:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir o modal de ação.
  const handleOpenModal = (appointment: Appointment, action: 'confirm' | 'cancel') => {
    setSelectedAppointment(appointment); // Define qual consulta está sendo manipulada.
    setActionType(action); // Define o tipo de ação (confirmar ou cancelar).
    setModalVisible(true); // Torna o modal visível.
  };

  // Função para fechar o modal.
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null); // Limpa a consulta selecionada.
  };

  // Função executada quando a ação no modal é confirmada.
  const handleConfirmAction = async (reason?: string) => {
    if (!selectedAppointment) return;

    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        let allAppointments: Appointment[] = JSON.parse(storedAppointments);
        // Atualiza a lista de consultas com o novo status.
        const updatedAppointments = allAppointments.map(app => {
          if (app.id === selectedAppointment.id) {
            return { 
              ...app, 
              status: actionType === 'confirm' ? 'confirmed' : 'cancelled',
              ...(reason && { cancelReason: reason }) // Adiciona o motivo do cancelamento se existir.
            };
          }
          return app;
        });
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));

        // Envia notificação para o paciente sobre a mudança de status.
        if (actionType === 'confirm') {
          await notificationService.notifyAppointmentConfirmed(selectedAppointment.patientId, selectedAppointment);
        } else {
          await notificationService.notifyAppointmentCancelled(selectedAppointment.patientId, selectedAppointment, reason);
        }

        loadAppointments(); // Recarrega os dados da tela.
      }
    } catch (error) {
      console.error('Erro ao confirmar ação da consulta:', error);
    }
  };

  // Hook `useFocusEffect` para recarregar os dados sempre que a tela ganhar foco.
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [user?.id]) // Dependência do user.id para recarregar se o usuário mudar.
  );

  // ----------------------------------------------------------------------
  // 4.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Painel do Médico</Title>

        {/* Botões de navegação para outras telas */}
        <Button title="Meu Perfil" onPress={() => navigation.navigate('Profile')} /* ... */ />
        <Button title="Configurações" onPress={() => navigation.navigate('Settings')} /* ... */ />

        {/* Seção de Estatísticas do Médico */}
        <SectionTitle>Minhas Estatísticas</SectionTitle>
        {statistics && (
          <StatisticsGrid>
            <StatisticsCard title="Total de Consultas" value={statistics.totalAppointments || 0} /* ... */ />
            <StatisticsCard title="Consultas Confirmadas" value={statistics.confirmedAppointments || 0} /* ... */ />
            <StatisticsCard title="Pacientes Atendidos" value={statistics.totalPatients || 0} /* ... */ />
            <StatisticsCard title="Pendentes" value={statistics.pendingAppointments || 0} /* ... */ />
          </StatisticsGrid>
        )}

        {/* Seção da Lista de Consultas */}
        <SectionTitle>Minhas Consultas</SectionTitle>
        {loading ? (
          <LoadingText>Carregando consultas...</LoadingText>
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          // Mapeia e renderiza a lista de consultas do médico.
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.patientName as TextStyle}>Paciente: {appointment.patientName}</ListItem.Title>
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>{appointment.date} às {appointment.time}</ListItem.Subtitle>
                {/* ... outros detalhes da consulta ... */}
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>{getStatusText(appointment.status)}</StatusText>
                </StatusBadge>
                {/* Botões de ação para consultas pendentes, que agora abrem o modal. */}
                {appointment.status === 'pending' && (
                  <ButtonContainer>
                    <Button title="Confirmar" onPress={() => handleOpenModal(appointment, 'confirm')} /* ... */ />
                    <Button title="Cancelar" onPress={() => handleOpenModal(appointment, 'cancel')} /* ... */ />
                  </ButtonContainer>
                )}
              </ListItem.Content>
            </AppointmentCard>
          ))
        )}

        {/* Botão de Logout */}
        <Button title="Sair" onPress={signOut} /* ... */ />

        {/* Renderização Condicional do Modal de Ação */}
        {/* O modal só é renderizado no DOM se houver uma consulta selecionada. */}
        {selectedAppointment && (
          <AppointmentActionModal
            visible={modalVisible} // Controla a visibilidade do modal.
            onClose={handleCloseModal} // Função para fechar o modal.
            onConfirm={handleConfirmAction} // Função para confirmar a ação.
            actionType={actionType} // Define se o modal é de 'confirm' ou 'cancel'.
            appointmentDetails={{ // Passa os detalhes da consulta selecionada para o modal.
              patientName: selectedAppointment.patientName,
              doctorName: selectedAppointment.doctorName,
              date: selectedAppointment.date,
              time: selectedAppointment.time,
              specialty: selectedAppointment.specialty,
            }}
          />
        )}
      </ScrollView>
    </Container>
  );
};


// ========================================================================
// 5. ESTILIZAÇÃO (STYLES E STYLED COMPONENTS)
// ========================================================================

// Objeto de estilos para componentes que não são `styled-components`.
const styles = {
  scrollContent: { padding: 20, },
  button: { marginBottom: 20, width: '100%', },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12, },
  logoutButton: { backgroundColor: theme.colors.error, paddingVertical: 12, },
  settingsButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12, },
  actionButton: { marginTop: 8, width: '48%', },
  confirmButton: { backgroundColor: theme.colors.success, paddingVertical: 8, },
  cancelButton: { backgroundColor: theme.colors.error, paddingVertical: 8, },
  dateTime: { fontSize: 16, fontWeight: '700', color: theme.colors.text, },
  patientName: { fontSize: 16, fontWeight: '700', color: theme.colors.text, },
  specialty: { fontSize: 14, fontWeight: '500', color: theme.colors.text, },
};

// --- Styled Components ---

// Contêiner principal da tela.
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Título principal da tela.
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Título para cada seção do dashboard.
const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 15px;
  margin-top: 10px;
`;

// Card para exibir uma consulta.
const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

// Texto exibido durante o carregamento.
const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

// Texto exibido quando uma lista está vazia.
const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

// Etiqueta (badge) para o status da consulta, com cor de fundo dinâmica.
const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

// Texto dentro da etiqueta de status, com cor dinâmica.
const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;

// Contêiner para os botões de ação (Confirmar/Cancelar).
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

// Grade para organizar os cards de estatísticas.
const StatisticsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default DoctorDashboardScreen;