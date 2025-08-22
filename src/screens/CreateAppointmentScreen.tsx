/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `CreateAppointmentScreen.tsx`
 * * Descrição: Este arquivo define o componente `CreateAppointmentScreen`, que é a tela de formulário
 * para que um paciente possa agendar uma nova consulta. A tela é composta por campos para
 * data, uma lista de seleção de horários e uma lista de seleção de médicos.
 *
 * * Funcionalidades Principais:
 * 1. Coleta de dados do usuário para o agendamento.
 * 2. Validação para garantir que todos os campos necessários sejam preenchidos.
 * 3. Persistência da nova consulta no armazenamento local (`AsyncStorage`).
 * 4. Interação com um serviço de notificação para avisar o médico sobre o novo agendamento.
 * 5. Reutilização de componentes customizados como `Header`, `DoctorList` e `TimeSlotList`.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa hooks e tipos essenciais do React e React Native.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle } from 'react-native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Button, Input } from 'react-native-elements';

// Importa hooks customizados para autenticação e navegação.
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Importa tipos de navegação para garantir a segurança de tipos.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importa o tema da aplicação, componentes customizados, serviços e AsyncStorage.
import theme from '../styles/theme';
import Header from '../components/Header';
import DoctorList from '../components/DoctorList';
import TimeSlotList from '../components/TimeSlotList';
import { notificationService } from '../services/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS E DADOS MOCKADOS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
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

// Interface para o objeto de Médico.
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Array de médicos mockados (dados de exemplo). Em uma aplicação real, estes dados viriam de uma API.
const availableDoctors: Doctor[] = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Dra. Maria Santos', specialty: 'Pediatria', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Ortopedia', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: '4', name: 'Dra. Ana Costa', specialty: 'Dermatologia', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '5', name: 'Dr. Carlos Mendes', specialty: 'Oftalmologia', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const CreateAppointmentScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E ESTADOS DO FORMULÁRIO
  // ----------------------------------------------------------------------

  // Obtém o usuário logado do contexto de autenticação.
  const { user } = useAuth();
  // Obtém o objeto de navegação.
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();
  
  // Estados para controlar os valores dos campos do formulário.
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Estados para controlar o processo de submissão do formulário.
  const [loading, setLoading] = useState(false); // Para o indicador de carregamento do botão.
  const [error, setError] = useState(''); // Para exibir mensagens de erro de validação.

  // ----------------------------------------------------------------------
  // 3.2. FUNÇÃO DE CRIAÇÃO DA CONSULTA
  // ----------------------------------------------------------------------

  // Função assíncrona para lidar com a submissão do formulário de agendamento.
  const handleCreateAppointment = async () => {
    try {
      // Inicia o estado de carregamento e limpa erros anteriores.
      setLoading(true);
      setError('');

      // 1. Validação: Verifica se todos os campos obrigatórios foram preenchidos.
      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return; // Interrompe a execução se a validação falhar.
      }

      // 2. Leitura: Recupera as consultas já existentes no AsyncStorage.
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

      // 3. Criação: Monta o objeto da nova consulta com os dados do formulário e do usuário logado.
      const newAppointment: Appointment = {
        id: Date.now().toString(), // Gera um ID único baseado no timestamp atual.
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        status: 'pending', // Novas consultas começam com status pendente.
      };

      // 4. Atualização: Adiciona a nova consulta à lista existente.
      appointments.push(newAppointment);

      // 5. Persistência: Salva a lista completa e atualizada de volta no AsyncStorage.
      await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

      // 6. Notificação: Chama o serviço para notificar o médico sobre o novo agendamento.
      await notificationService.notifyNewAppointment(selectedDoctor.id, newAppointment);

      // 7. Feedback e Navegação: Informa o usuário do sucesso e o redireciona para a tela anterior.
      alert('Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (err) {
      // Tratamento de erro caso algo falhe no processo.
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      // Garante que o estado de carregamento seja desativado, independentemente do resultado.
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 3.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner principal da tela)
    <Container>
      {/* Componente: Header (Cabeçalho customizado) */}
      <Header />
      {/* Componente: ScrollView (Permite a rolagem do formulário em telas menores) */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        {/* Campo de entrada para a data da consulta. */}
        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        {/* Seção para seleção de horário, utilizando o componente reutilizável `TimeSlotList`. */}
        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        {/* Seção para seleção de médico, utilizando o componente reutilizável `DoctorList`. */}
        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors}
          onSelectDoctor={setSelectedDoctor}
          selectedDoctorId={selectedDoctor?.id}
        />

        {/* Exibe a mensagem de erro se o estado `error` não estiver vazio. */}
        {error ? <ErrorText>{error}</ErrorText> : null}

        {/* Botão principal para submeter o formulário e criar a consulta. */}
        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading} // Mostra um indicador de carregamento durante a submissão.
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão secundário para cancelar a operação e voltar para a tela anterior. */}
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLES E STYLED COMPONENTS)
// ========================================================================

// Objeto de estilos para componentes que não são `styled-components`.
const styles = {
  scrollContent: { padding: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, width: '100%' },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
  cancelButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
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

// Título para cada seção do formulário.
const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;

// Texto para exibir mensagens de erro.
const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default CreateAppointmentScreen;