/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `AdminDashboardScreen.tsx`
 * * Descrição: Este arquivo define o componente `AdminDashboardScreen`, que serve como a tela principal
 * para usuários administradores. A tela exibe um painel completo com estatísticas gerais,
 * as especialidades médicas mais procuradas, e uma lista das últimas consultas agendadas,
 * permitindo ao administrador confirmar ou cancelar consultas pendentes.
 *
 * * Funcionalidades Principais:
 * 1. Busca e exibe dados agregados (estatísticas) de um serviço.
 * 2. Carrega e exibe listas de consultas e usuários a partir do armazenamento local (`AsyncStorage`).
 * 3. Atualiza os dados automaticamente sempre que a tela entra em foco, garantindo que as informações sejam atuais.
 * 4. Permite a manipulação de dados, como a atualização do status de uma consulta.
 * 5. Fornece navegação para outras seções administrativas, como gerenciamento de usuários e perfil.
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

// Importa tipos de navegação para garantir a segurança de tipos nas rotas.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importa o tema da aplicação, componentes customizados, serviços e AsyncStorage.
import theme from '../styles/theme';
import Header from '../components/Header';
import StatisticsCard from '../components/StatisticsCard';
import { statisticsService, Statistics } from '../services/statistics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS E INTERFACES LOCAIS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type AdminDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

// Interface para o objeto de Consulta.
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Interface para o objeto de Usuário.
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

// Interface para as props de estilo dos componentes `styled-components`.
interface StyledProps {
  status: string;
}

// ========================================================================
// 3. FUNÇÕES AUXILIARES (HELPERS)
// ========================================================================

// Função auxiliar para retornar uma cor específica baseada no status da consulta.
// Centraliza a lógica de cores, facilitando a manutenção.
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return theme.colors.success;
    case 'cancelled': return theme.colors.error;
    default: return theme.colors.warning;
  }
};

// Função auxiliar para retornar um texto legível para o usuário baseado no status da consulta.
const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmada';
    case 'cancelled': return 'Cancelada';
    default: return 'Pendente';
  }
};

// ========================================================================
// 4. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const AdminDashboardScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 4.1. HOOKS E ESTADOS
  // ----------------------------------------------------------------------

  // Obtém dados (usuário) e funções (signOut) do contexto de autenticação global.
  const { user, signOut } = useAuth();
  // Obtém o objeto de navegação para permitir a transição entre telas.
  const navigation = useNavigation<AdminDashboardScreenProps['navigation']>();
  
  // Estados para armazenar os dados que serão exibidos na tela.
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true); // Controla a exibição de indicadores de carregamento.

  // ----------------------------------------------------------------------
  // 4.2. FUNÇÕES DE DADOS E EFEITOS (LIFECYCLE)
  // ----------------------------------------------------------------------

  // Função principal para carregar todos os dados necessários para o dashboard.
  // Busca informações do AsyncStorage e de serviços externos.
  const loadData = async () => {
    try {
      // Carrega a lista completa de consultas do armazenamento local.
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) setAppointments(JSON.parse(storedAppointments));

      // Carrega a lista completa de usuários do armazenamento local.
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));

      // Busca as estatísticas gerais através do 'statisticsService'.
      const stats = await statisticsService.getGeneralStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      // Garante que o estado de carregamento seja desativado, mesmo se ocorrer um erro.
      setLoading(false);
    }
  };

  // Hook `useFocusEffect`: É um hook do React Navigation que executa uma função
  // toda vez que a tela entra em foco (seja na primeira vez ou ao navegar de volta para ela).
  // `React.useCallback` otimiza a função para que ela não seja recriada a cada renderização.
  useFocusEffect(
    React.useCallback(() => {
      loadData(); // Chama a função para carregar/atualizar os dados da tela.
    }, [])
  );

  // Função para atualizar o status de uma consulta (confirmar ou cancelar).
  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        let allAppointments: Appointment[] = JSON.parse(storedAppointments);
        // Usa `map` para criar uma nova lista com a consulta alvo atualizada.
        const updatedAppointments = allAppointments.map(app => 
          app.id === appointmentId ? { ...app, status: newStatus } : app
        );
        // Salva a lista atualizada de volta no AsyncStorage.
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));
        // Recarrega os dados na tela para refletir a mudança imediatamente.
        loadData();
      }
    } catch (error) {
      console.error('Erro ao atualizar status da consulta:', error);
    }
  };

  // ----------------------------------------------------------------------
  // 4.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner principal que ocupa toda a tela)
    <Container>
      {/* Componente: Header (Cabeçalho customizado com informações do usuário) */}
      <Header />
      {/* Componente: ScrollView (Permite a rolagem do conteúdo caso ele exceda a altura da tela) */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título principal da página. */}
        <Title>Painel Administrativo</Title>

        {/* Botão de navegação para a tela de gerenciamento de usuários. */}
        <Button
          title="Gerenciar Usuários"
          onPress={() => navigation.navigate('UserManagement')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão de navegação para a tela de perfil do administrador. */}
        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Seção: Estatísticas Gerais */}
        <SectionTitle>Estatísticas Gerais</SectionTitle>
        {/* Renderiza a grade de estatísticas somente após os dados serem carregados. */}
        {statistics && (
          <StatisticsGrid>
            <StatisticsCard title="Total de Consultas" value={statistics.totalAppointments} color={theme.colors.primary} subtitle="Todas as consultas" />
            <StatisticsCard title="Consultas Confirmadas" value={statistics.confirmedAppointments} color={theme.colors.success} subtitle={`${statistics.statusPercentages.confirmed.toFixed(1)}% do total`} />
            <StatisticsCard title="Pacientes Ativos" value={statistics.totalPatients} color={theme.colors.secondary} subtitle="Pacientes únicos" />
            <StatisticsCard title="Médicos Ativos" value={statistics.totalDoctors} color={theme.colors.warning} subtitle="Médicos com consultas" />
          </StatisticsGrid>
        )}

        {/* Seção: Especialidades Mais Procuradas */}
        <SectionTitle>Especialidades Mais Procuradas</SectionTitle>
        {/* Renderiza a lista somente se houver dados de estatísticas e especialidades. */}
        {statistics && Object.entries(statistics.specialties).length > 0 && (
          <SpecialtyContainer>
            {/* Processa o objeto de especialidades para exibir as 3 mais populares, em ordem decrescente. */}
            {Object.entries(statistics.specialties)
              .sort(([,a], [,b]) => b - a) // Ordena pela contagem (valor).
              .slice(0, 3) // Pega apenas os 3 primeiros resultados.
              .map(([specialty, count]) => ( // Mapeia para renderizar cada item.
                <SpecialtyItem key={specialty}>
                  <SpecialtyName>{specialty}</SpecialtyName>
                  <SpecialtyCount>{count} consultas</SpecialtyCount>
                </SpecialtyItem>
              ))
            }
          </SpecialtyContainer>
        )}

        {/* Seção: Últimas Consultas */}
        <SectionTitle>Últimas Consultas</SectionTitle>
        {/* Lógica de renderização condicional para a lista de consultas. */}
        {loading ? (
          // Exibe enquanto os dados estão sendo carregados.
          <LoadingText>Carregando dados...</LoadingText>
        ) : appointments.length === 0 ? (
          // Exibe se não houver nenhuma consulta.
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          // Renderiza a lista de cards de consulta se houver dados.
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.doctorName as TextStyle}>{appointment.doctorName}</ListItem.Title>
                <ListItem.Subtitle style={styles.specialty as TextStyle}>{appointment.specialty}</ListItem.Subtitle>
                <Text style={styles.dateTime as TextStyle}>{appointment.date} às {appointment.time}</Text>
                {/* Badge (etiqueta) com cor e texto dinâmicos baseados no status. */}
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>{getStatusText(appointment.status)}</StatusText>
                </StatusBadge>
                {/* Renderiza os botões de ação "Confirmar" e "Cancelar" apenas para consultas pendentes. */}
                {appointment.status === 'pending' && (
                  <ButtonContainer>
                    <Button title="Confirmar" onPress={() => handleUpdateStatus(appointment.id, 'confirmed')} containerStyle={styles.actionButton as ViewStyle} buttonStyle={styles.confirmButton} />
                    <Button title="Cancelar" onPress={() => handleUpdateStatus(appointment.id, 'cancelled')} containerStyle={styles.actionButton as ViewStyle} buttonStyle={styles.cancelButton} />
                  </ButtonContainer>
                )}
              </ListItem.Content>
            </AppointmentCard>
          ))
        )}

        {/* Botão para realizar o logout do usuário. */}
        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

// ========================================================================
// 5. ESTILIZAÇÃO (STYLES E STYLED COMPONENTS)
// ========================================================================

// Objeto de estilos para componentes que não são `styled-components` (ex: `react-native-elements`)
// e para estilos de conteúdo que não necessitam de props dinâmicas.
const styles = {
  scrollContent: { padding: 20 },
  button: { marginBottom: 20, width: '100%' },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
  logoutButton: { backgroundColor: theme.colors.error, paddingVertical: 12 },
  actionButton: { marginTop: 8, width: '48%' },
  confirmButton: { backgroundColor: theme.colors.success, paddingVertical: 8 },
  cancelButton: { backgroundColor: theme.colors.error, paddingVertical: 8 },
  doctorName: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  specialty: { fontSize: 14, color: theme.colors.text, marginTop: 4 },
  dateTime: { fontSize: 14, color: theme.colors.text, marginTop: 4 },
};

// --- Styled Components ---
// Definição de componentes com estilos encapsulados, permitindo estilos dinâmicos baseados em props.

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
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'}; /* Cor com transparência */
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

// Contêiner para a lista de especialidades mais procuradas.
const SpecialtyContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

// Item individual na lista de especialidades.
const SpecialtyItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border}20; /* Borda com transparência */
`;

// Texto para o nome da especialidade.
const SpecialtyName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text};
`;

// Texto para a contagem de consultas da especialidade.
const SpecialtyCount = styled.Text`
  font-size: 14px;
  color: ${theme.colors.primary};
  font-weight: 600;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default AdminDashboardScreen;