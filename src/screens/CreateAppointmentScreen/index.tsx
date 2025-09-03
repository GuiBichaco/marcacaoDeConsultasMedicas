/**
 * @file Componente de tela para criação de um novo agendamento.
 * @description Esta é a camada de visualização (View), responsável apenas por renderizar
 * a interface do usuário. Toda a lógica de estado e manipulação de dados é
 * abstraída pelo hook `useCreateAppointment`.
 */

import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';

// Importa componentes de UI globais
import Header from '../../../components/Header'; // Caminho ajustado
import DoctorList from '../../../components/DoctorList'; // Caminho ajustado
import TimeSlotList from '../../../components/TimeSlotList'; // Caminho ajustado

// Importa o hook de lógica e os estilos
import { useCreateAppointment } from './hooks/useCreateAppointment';
import { Container, Title, SectionTitle, ErrorText, styles } from './styles';

const CreateAppointmentScreen: React.FC = () => {
  // O hook provê todo o estado e as funções necessárias.
  const {
    date,
    setDate,
    selectedTime,
    setSelectedTime,
    selectedDoctor,
    setSelectedDoctor,
    doctors,
    loading,
    error,
    handleCreateAppointment,
    handleCancel,
  } = useCreateAppointment();

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList onSelectTime={setSelectedTime} selectedTime={selectedTime} />

        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={doctors}
          onSelectDoctor={setSelectedDoctor}
          selectedDoctorId={selectedDoctor?.id}
        />

        {error ? <ErrorText>{error}</ErrorText> : null}

        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Cancelar"
          onPress={handleCancel}
          containerStyle={styles.button}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

export default CreateAppointmentScreen;