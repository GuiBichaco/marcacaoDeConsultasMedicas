/**
 * @file Gerencia as operações de dados para agendamentos.
 * Em uma aplicação real, aqui estariam as chamadas para uma API.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../../../services/notifications'; // Caminho ajustado
import { Appointment, Doctor } from '../models/types';
import { User } from '../../../contexts/AuthContext'; // Supondo que o tipo User venha do contexto

// Array de médicos mockados.
const availableDoctors: Doctor[] = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Dra. Maria Santos', specialty: 'Pediatria', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Ortopedia', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  // ... outros médicos
];

/**
 * Busca a lista de médicos disponíveis.
 * @returns Uma Promise que resolve em um array de Doutores.
 */
export const getAvailableDoctors = async (): Promise<Doctor[]> => {
  // Simula uma chamada de API
  return Promise.resolve(availableDoctors);
};

/**
 * Cria uma nova consulta, salva no armazenamento local e notifica o médico.
 * @param appointmentData - Os dados da nova consulta.
 * @param user - O usuário logado que está criando a consulta.
 * @returns Uma Promise que resolve quando a operação é concluída.
 * @throws Lança um erro se a operação falhar.
 */
export const createAppointment = async (
  appointmentData: {
    date: string;
    selectedTime: string;
    selectedDoctor: Doctor;
  },
  user: User | null
): Promise<void> => {
  const { date, selectedTime, selectedDoctor } = appointmentData;

  // 1. Recupera as consultas existentes
  const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
  const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

  // 2. Monta o novo objeto de consulta
  const newAppointment: Appointment = {
    id: Date.now().toString(),
    patientId: user?.id || '',
    patientName: user?.name || '',
    doctorId: selectedDoctor.id,
    doctorName: selectedDoctor.name,
    date,
    time: selectedTime,
    specialty: selectedDoctor.specialty,
    status: 'pending',
  };

  // 3. Adiciona a nova consulta à lista
  appointments.push(newAppointment);

  // 4. Salva a lista atualizada no AsyncStorage
  await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

  // 5. Notifica o médico
  await notificationService.notifyNewAppointment(selectedDoctor.id, newAppointment);
};