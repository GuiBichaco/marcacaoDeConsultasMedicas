/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `PatientDashboardScreen.tsx`
 * * Descrição: Este arquivo define o componente `PatientDashboardScreen`, que serve como a tela principal
 * para usuários do tipo "paciente". A tela exibe uma lista de todas as suas consultas agendadas
 * (passadas e futuras) e oferece botões de navegação para as principais ações, como agendar uma
 * nova consulta, visualizar o perfil e acessar as configurações.
 *
 * * Funcionalidades Principais:
 * 1. Busca e exibe a lista de consultas do paciente a partir do armazenamento local (`AsyncStorage`).
 * 2. Filtra os dados para mostrar apenas as consultas pertencentes ao usuário logado.
 * 3. Atualiza a lista de consultas automaticamente sempre que a tela ganha foco.
 * 4. Fornece uma interface clara para o paciente visualizar o status de suas consultas.
 * 5. Oferece navegação simplificada para as funcionalidades mais importantes para o paciente.
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

// Importa o tema da aplicação, componentes e AsyncStorage.
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS E INTERFACES LOCAIS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type PatientDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientDashboard'>;
};

// Interface para o objeto de Consulta.
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Interface para as props de estilo dos `styled-components`.
interface StyledProps {
  status: string;
}

// ========================================================================
// 3. FUNÇÕES AUXILIARES (HELPERS)
// ========================================================================

// Função auxiliar para retornar uma cor específica baseada no status da consulta.
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return theme.colors.success;
    case 'cancelled': return theme.colors.error;
    default: return theme.colors.warning;
  }
};

// Função auxiliar para retornar um texto formatado baseado no status da consulta.
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
const PatientDashboardScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 4.1. HOOKS E ESTADOS
  // ----------------------------------------------------------------------

  const { user, signOut } = useAuth();
  const navigation = useNavigation<PatientDashboardScreenProps['navigation']>();
  
  // Estado para armazenar a lista de consultas do paciente.
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado para controlar a exibição do indicador de carregamento.
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------
  // 4.2. FUNÇÕES DE DADOS E EFEITOS
  // ----------------------------------------------------------------------

  // Função para carregar os dados de consultas do paciente.
  const loadAppointments = async () => {
    try {
      // Carrega a lista completa de todas as consultas do armazenamento local.
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        // Filtra a lista para obter apenas as consultas do paciente logado.
        const userAppointments = allAppointments.filter(
          (appointment) => appointment.patientId === user?.id
        );
        // Atualiza o estado com as consultas filtradas.
        setAppointments(userAppointments);
      }
    } catch (error) {
      console.error('Erro ao carregar consultas do paciente:', error);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento.
    }
  };

  // Hook `useFocusEffect`: Executa uma função toda vez que a tela entra em foco.
  // Isso garante que, após agendar uma nova consulta e voltar, a lista seja atualizada.
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [user?.id]) // A dependência `user.id` garante que a função seja recriada se o usuário mudar.
  );

  // ----------------------------------------------------------------------
  // 4.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner principal da tela)
    <Container>
      {/* Componente: Header (Cabeçalho customizado com informações do usuário) */}
      <Header />
      {/* Componente: ScrollView (Permite a rolagem do conteúdo) */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Minhas Consultas</Title>

        {/* Botões de navegação para as principais ações do paciente. */}
        <Button
          title="Agendar Nova Consulta"
          onPress={() => navigation.navigate('CreateAppointment')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />
        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />
        <Button
          title="Configurações"
          onPress={() => navigation.navigate('Settings')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.settingsButton}
        />

        {/* Lógica de renderização condicional para a lista de consultas. */}
        {loading ? (
          // Exibe enquanto os dados estão sendo carregados.
          <LoadingText>Carregando consultas...</LoadingText>
        ) : appointments.length === 0 ? (
          // Exibe se não houver nenhuma consulta agendada.
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          // Renderiza a lista de cards de consulta se houver dados.
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.patientName as TextStyle}>
                  Paciente: {appointment.patientName}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
                </ListItem.Subtitle>
                <Text style={styles.doctorName as TextStyle}>
                  {appointment.doctorName}
                </Text>
                <Text style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </Text>
                {/* Etiqueta (badge) com cor e texto dinâmicos para exibir o status da consulta. */}
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>
                    {getStatusText(appointment.status)}
                  </StatusText>
                </StatusBadge>
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

// Objeto de estilos para componentes que não são `styled-components`.
const styles = {
  scrollContent: { padding: 20, },
  button: { marginBottom: 20, width: '100%', },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12, },
  logoutButton: { backgroundColor: theme.colors.error, paddingVertical: 12, },
  settingsButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12, },
  doctorName: { fontSize: 18, fontWeight: '700', color: theme.colors.text, },
  specialty: { fontSize: 14, color: theme.colors.text, marginTop: 4, },
  dateTime: { fontSize: 14, color: theme.colors.text, marginTop: 4, },
  patientName: { fontSize: 16, fontWeight: '700', color: theme.colors.text, },
};

// --- Styled Components ---

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Card para exibir os detalhes de uma consulta.
const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

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

// Exporta o componente para ser usado no navegador de rotas.
export default PatientDashboardScreen;