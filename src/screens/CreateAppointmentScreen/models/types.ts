/**
 * @file Define os modelos de dados (tipos e interfaces)
 * relacionados à tela de criação de agendamento.
 */

/**
 * Interface para o objeto de Médico.
 */
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

/**
 * Interface para o objeto de Consulta.
 */
export interface Appointment {
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