/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `statistics.ts`
 * * Descrição: Este arquivo define o `statisticsService`, um serviço responsável por
 * calcular e agregar dados estatísticos a partir dos dados brutos da aplicação
 * (consultas e usuários) armazenados no `AsyncStorage`.
 *
 * * Funcionalidades Principais:
 * 1.  **Abstração de Lógica de Negócio:** Centraliza toda a lógica de cálculo de estatísticas,
 * tornando o código dos componentes de tela mais limpo e focado na exibição.
 * 2.  **Processamento de Dados:** Lê os dados do armazenamento local e os transforma em
 * informações significativas, como contagens, distribuições e porcentagens.
 * 3.  **Visões de Dados Específicas:** Fornece funções distintas para gerar estatísticas
 * gerais (para administradores), estatísticas por médico e estatísticas por paciente,
 * garantindo que cada "função" (role) no sistema veja os dados relevantes para ela.
 * 4.  **Simulação de Analytics:** Atua como uma camada de análise de dados mockada, simulando
 * o que um backend faria ao processar dados de um banco de dados.
 */

// ========================================================================
// 1. IMPORTAÇÕES E TIPOS
// ========================================================================

// Importa a API de armazenamento local do React Native.
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface para o objeto de Consulta, usada para tipar os dados lidos do armazenamento.
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

// Define a interface para o objeto de Estatísticas, que é o "produto final" deste serviço.
// Exportada para que os componentes que consomem o serviço saibam a estrutura dos dados que receberão.
export interface Statistics {
  totalAppointments: number; // Total de consultas.
  confirmedAppointments: number; // Consultas confirmadas.
  pendingAppointments: number; // Consultas pendentes.
  cancelledAppointments: number; // Consultas canceladas.
  totalPatients: number; // Total de pacientes únicos.
  totalDoctors: number; // Total de médicos únicos.
  specialties: { [key: string]: number }; // Contagem de consultas por especialidade.
  appointmentsByMonth: { [key: string]: number }; // Contagem de consultas por mês.
  statusPercentages: { // Porcentagem de cada status de consulta.
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

// ========================================================================
// 2. DEFINIÇÃO DO SERVIÇO DE ESTATÍSTICAS
// ========================================================================

// `statisticsService` é um objeto que agrupa todas as funções de cálculo.
export const statisticsService = {
  /**
   * Calcula as estatísticas gerais de toda a aplicação. Ideal para painéis de administrador.
   * @returns Uma Promise que resolve com um objeto `Statistics` completo.
   * @throws Um erro se ocorrer um problema ao ler ou processar os dados.
   */
  async getGeneralStatistics(): Promise<Statistics> {
    try {
      // 1. Carrega os dados brutos do AsyncStorage.
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      const registeredUsersData = await AsyncStorage.getItem('@MedicalApp:registeredUsers');
      const registeredUsers = registeredUsersData ? JSON.parse(registeredUsersData) : [];

      // 2. Calcula contagens básicas de consultas por status.
      const totalAppointments = appointments.length;
      const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

      // 3. Calcula o número de pacientes e médicos únicos usando um `Set` para remover duplicatas.
      const uniquePatients = new Set(appointments.map(a => a.patientId));
      const totalPatients = uniquePatients.size;
      const uniqueDoctors = new Set(appointments.map(a => a.doctorId));
      const totalDoctors = uniqueDoctors.size;

      // 4. Calcula a distribuição de consultas por especialidade.
      const specialties: { [key: string]: number } = {};
      appointments.forEach(appointment => {
        specialties[appointment.specialty] = (specialties[appointment.specialty] || 0) + 1;
      });

      // 5. Calcula a distribuição de consultas por mês/ano.
      const appointmentsByMonth: { [key: string]: number } = {};
      appointments.forEach(appointment => {
        try {
          const [day, month, year] = appointment.date.split('/');
          const monthKey = `${month}/${year}`;
          appointmentsByMonth[monthKey] = (appointmentsByMonth[monthKey] || 0) + 1;
        } catch (error) {
          console.warn('Data em formato inválido encontrada e ignorada:', appointment.date);
        }
      });

      // 6. Calcula a porcentagem de cada status.
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      // 7. Retorna o objeto de estatísticas completo.
      return {
        totalAppointments, confirmedAppointments, pendingAppointments, cancelledAppointments,
        totalPatients, totalDoctors, specialties, appointmentsByMonth, statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas gerais:', error);
      throw error;
    }
  },

  /**
   * Calcula as estatísticas para um médico específico.
   * @param doctorId - O ID do médico para o qual as estatísticas serão calculadas.
   * @returns Uma Promise que resolve com um objeto `Partial<Statistics>`, contendo apenas as métricas relevantes para um médico.
   */
  async getDoctorStatistics(doctorId: string): Promise<Partial<Statistics>> {
    try {
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const allAppointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // 1. Filtra as consultas para obter apenas as do médico especificado.
      const doctorAppointments = allAppointments.filter(a => a.doctorId === doctorId);

      // 2. Calcula as métricas sobre o subconjunto de dados filtrado.
      const totalAppointments = doctorAppointments.length;
      const confirmedAppointments = doctorAppointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = doctorAppointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = doctorAppointments.filter(a => a.status === 'cancelled').length;
      const uniquePatients = new Set(doctorAppointments.map(a => a.patientId));
      const totalPatients = uniquePatients.size;
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      // 3. Retorna apenas as estatísticas relevantes para o médico.
      return {
        totalAppointments, confirmedAppointments, pendingAppointments,
        cancelledAppointments, totalPatients, statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas do médico:', error);
      throw error;
    }
  },

  /**
   * Calcula as estatísticas para um paciente específico.
   * @param patientId - O ID do paciente para o qual as estatísticas serão calculadas.
   * @returns Uma Promise que resolve com um objeto `Partial<Statistics>`, contendo apenas as métricas relevantes para um paciente.
   */
  async getPatientStatistics(patientId: string): Promise<Partial<Statistics>> {
    try {
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const allAppointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // 1. Filtra as consultas para obter apenas as do paciente especificado.
      const patientAppointments = allAppointments.filter(a => a.patientId === patientId);

      // 2. Calcula as métricas sobre o subconjunto de dados filtrado.
      const totalAppointments = patientAppointments.length;
      const confirmedAppointments = patientAppointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = patientAppointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = patientAppointments.filter(a => a.status === 'cancelled').length;

      const specialties: { [key: string]: number } = {};
      patientAppointments.forEach(appointment => {
        specialties[appointment.specialty] = (specialties[appointment.specialty] || 0) + 1;
      });

      const uniqueDoctors = new Set(patientAppointments.map(a => a.doctorId));
      const totalDoctors = uniqueDoctors.size;
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      // 3. Retorna apenas as estatísticas relevantes para o paciente.
      return {
        totalAppointments, confirmedAppointments, pendingAppointments, cancelledAppointments,
        totalDoctors, specialties, statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas do paciente:', error);
      throw error;
    }
  },
};