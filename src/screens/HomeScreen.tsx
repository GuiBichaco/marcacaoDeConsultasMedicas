/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `HomeScreen.tsx`
 * * Descrição: Este arquivo define o componente `HomeScreen`, que serve como a tela inicial principal
 * para um usuário logado. A tela exibe uma lista de suas consultas agendadas e oferece um
 * botão de acesso rápido para agendar uma nova consulta.
 *
 * * Funcionalidades Principais:
 * 1. Carrega e exibe a lista de consultas do usuário a partir do armazenamento local (`AsyncStorage`).
 * 2. Utiliza `FlatList` para uma renderização otimizada da lista de consultas.
 * 3. Implementa a funcionalidade "puxar para atualizar" (`pull-to-refresh`) para recarregar os dados.
 * 4. Atualiza a lista de consultas automaticamente sempre que a tela ganha foco.
 * 5. Exibe um estado vazio caso o usuário não tenha nenhuma consulta agendada.
 * 6. Fornece navegação para a tela de criação de consultas.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa hooks e tipos essenciais do React e React Native.
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';

// Importa componentes de UI da biblioteca 'react-native-elements' e ícones.
import { Button, Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

// Importa componentes customizados, tema, tipos e hooks de navegação.
import { HeaderContainer, HeaderTitle } from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../types/appointments';
import { Doctor } from '../types/doctors';
import { RootStackParamList } from '../types/navigation';
import { useFocusEffect } from '@react-navigation/native';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS E DADOS MOCKADOS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// Array de médicos mockados (dados de exemplo). Em uma aplicação real, viriam de uma API.
const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologista',
    image: 'https://mighty.tools/mockmind-api/content/human/91.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologista',
    image: 'https://mighty.tools/mockmind-api/content/human/97.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Oftalmologista',
    image: 'https://mighty.tools/mockmind-api/content/human/79.jpg',
  },
];

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E ESTADOS
  // ----------------------------------------------------------------------
  
  // Estado para armazenar a lista de consultas a serem exibidas.
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado para controlar o indicador de carregamento da funcionalidade "puxar para atualizar".
  const [refreshing, setRefreshing] = useState(false);

  // ----------------------------------------------------------------------
  // 3.2. FUNÇÕES DE DADOS E EFEITOS
  // ----------------------------------------------------------------------

  // Função assíncrona para carregar as consultas salvas no AsyncStorage.
  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  };

  // Hook `useFocusEffect`: Executa uma função toda vez que a tela entra em foco.
  // Garante que a lista de consultas seja sempre a mais recente.
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  // Função para lidar com a ação de "puxar para atualizar".
  const onRefresh = async () => {
    setRefreshing(true); // Ativa o indicador de carregamento.
    await loadAppointments(); // Recarrega os dados.
    setRefreshing(false); // Desativa o indicador de carregamento.
  };

  // Função auxiliar para encontrar as informações de um médico com base no seu ID.
  // Simula uma "junção" (join) de dados entre consultas e médicos.
  const getDoctorInfo = (doctorId: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  // ----------------------------------------------------------------------
  // 3.3. FUNÇÃO DE RENDERIZAÇÃO DO ITEM DA LISTA
  // ----------------------------------------------------------------------

  // Função que define como cada item individual da lista de consultas será renderizado.
  // Recebe um objeto com a propriedade `item`, que é uma consulta individual.
  const renderAppointment = ({ item }: { item: Appointment }) => {
    // Busca as informações do médico correspondente à consulta.
    const doctor = getDoctorInfo(item.doctorId);
    
    return (
      // Componente: AppointmentCard (Card que exibe os detalhes da consulta)
      <AppointmentCard>
        <DoctorImage source={{ uri: doctor?.image || 'https://via.placeholder.com/100' }} />
        <InfoContainer>
          <DoctorName>{doctor?.name || 'Médico não encontrado'}</DoctorName>
          <DoctorSpecialty>{doctor?.specialty || 'Especialidade não encontrada'}</DoctorSpecialty>
          <DateTime>{new Date(item.date).toLocaleDateString()} - {item.time}</DateTime>
          <Description>{item.description}</Description>
          {/* O status da consulta tem cor dinâmica. */}
          <Status status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Confirmado'}
          </Status>
          {/* Botões de ação para editar ou deletar a consulta. */}
          <ActionButtons>
            <ActionButton>
              <Icon name="edit" type="material" size={20} color={theme.colors.primary} />
            </ActionButton>
            <ActionButton>
              <Icon name="delete" type="material" size={20} color={theme.colors.error} />
            </ActionButton>
          </ActionButtons>
        </InfoContainer>
      </AppointmentCard>
    );
  };

  // ----------------------------------------------------------------------
  // 3.4. RENDERIZAÇÃO DA INTERFACE DA TELA (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner principal da tela)
    <Container>
      {/* Componente: HeaderContainer (Cabeçalho da tela) */}
      <HeaderContainer>
        <HeaderTitle>Minhas Consultas</HeaderTitle>
      </HeaderContainer>

      {/* Componente: Content (Área de conteúdo principal da tela) */}
      <Content>
        {/* Botão principal para navegar para a tela de agendamento. */}
        <Button
          title="Agendar Nova Consulta"
          icon={
            <FontAwesome
              name="calendar-plus-o"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: theme.spacing.medium
          }}
          onPress={() => navigation.navigate('CreateAppointment')}
        />

        {/* Componente: AppointmentList (Lista de Consultas) */}
        {/* Usa `FlatList` para performance otimizada em listas longas. */}
        <AppointmentList
          data={appointments} // A fonte de dados para a lista.
          keyExtractor={(item: Appointment) => item.id} // Função para extrair uma chave única para cada item.
          renderItem={renderAppointment} // Função que renderiza cada item.
          // Habilita a funcionalidade "puxar para atualizar".
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // Componente a ser exibido se a lista de dados estiver vazia.
          ListEmptyComponent={
            <EmptyText>Nenhuma consulta agendada</EmptyText>
          }
        />
      </Content>
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLED COMPONENTS)
// ========================================================================

// Contêiner principal da tela, ocupa todo o espaço disponível.
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Contêiner para o conteúdo principal, com padding para afastar das bordas.
const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

// Componente `FlatList` estilizado, garantindo que ele ocupe o espaço restante.
const AppointmentList = styled(FlatList as new () => FlatList<Appointment>)`
  flex: 1;
`;

// Card para exibir os detalhes de uma consulta, com sombra e bordas arredondadas.
const AppointmentCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: ${theme.spacing.medium}px;
  margin-bottom: ${theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

// Imagem do médico com formato circular.
const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

// Contêiner para as informações textuais dentro do card.
const InfoContainer = styled.View`
  flex: 1;
`;

// Texto para o nome do médico, com maior destaque.
const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

// Texto para a especialidade do médico.
const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-bottom: 4px;
`;

// Texto para a data e hora da consulta.
const DateTime = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;

// Texto para a descrição/motivo da consulta.
const Description = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-top: 4px;
`;

// Texto para o status da consulta, com cor dinâmica (vermelho para pendente, verde para confirmado).
const Status = styled.Text<{ status: string }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { status: string }) => props.status === 'pending' ? theme.colors.error : theme.colors.success};
  margin-top: 4px;
  font-weight: bold;
`;

// Contêiner para alinhar os botões de ação (editar/deletar) à direita.
const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${theme.spacing.small}px;
`;

// Botão de ação individual (área clicável).
const ActionButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  margin-left: ${theme.spacing.small}px;
`;

// Texto exibido quando a lista de consultas está vazia.
const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: ${theme.spacing.large}px;
`;

// Exporta o componente para ser usado no navegador de rotas.
export default HomeScreen;