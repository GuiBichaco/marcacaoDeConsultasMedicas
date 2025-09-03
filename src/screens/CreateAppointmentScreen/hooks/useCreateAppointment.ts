/**
 * @file Hook customizado para gerenciar o estado e a lógica da tela de criação de agendamento.
 */
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext'; // Caminho ajustado
import { getAvailableDoctors, createAppointment } from '../services/appointmentService';
import { Doctor } from '../models/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation'; // Caminho ajustado

// Tipagem para a navegação
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;

/**
 * Gerencia o formulário de criação de agendamento.
 * @returns Retorna o estado do formulário, handlers e dados necessários para a UI.
 */
export const useCreateAppointment = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProps>();

  // Estados do formulário
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Estados de controle da UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Efeito para carregar os médicos disponíveis ao montar o componente.
  useEffect(() => {
    const fetchDoctors = async () => {
      const availableDoctors = await getAvailableDoctors();
      setDoctors(availableDoctors);
    };
    fetchDoctors();
  }, []);

  /**
   * Lida com a submissão do formulário de agendamento.
   */
  const handleCreateAppointment = async () => {
    // 1. Validação
    if (!date || !selectedTime || !selectedDoctor) {
      setError('Por favor, preencha a data e selecione um médico e horário');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 2. Chama o serviço para criar a consulta
      await createAppointment({ date, selectedTime, selectedDoctor }, user);

      // 3. Feedback e navegação
      alert('Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (err) {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
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
    handleCancel: () => navigation.goBack(),
  };
};