/**
 * DOCUMENTAÇÃO DO CÓdigo
 * * Este arquivo define o componente `AppointmentCard`.
 * É um "card" reutilizável que exibe um resumo das informações de uma consulta médica.
 * Ele é projetado para ser usado em uma lista de agendamentos, mostrando detalhes como
 * nome do médico, data, hora e o status da consulta (pendente, confirmada ou cancelada).
 */


// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS
// ========================================================================

// Importa a biblioteca React, essencial para a criação de componentes.
import React from 'react';

// Importa a biblioteca 'styled-components' para React Native, que permite criar componentes com estilos CSS-in-JS.
import styled from 'styled-components/native';

// Importa o tipo 'ViewStyle' do React Native, usado para garantir a tipagem correta de objetos de estilo.
import { ViewStyle } from 'react-native';

// Importa os componentes 'Card', 'Text', e 'Avatar' da biblioteca 'react-native-elements'.
// Card: Um contêiner com estilo de cartão (sombra, bordas, etc.).
// Text: Um componente para exibir textos.
// Avatar: Um componente para exibir imagens de perfil ou iniciais.
import { Card, Text, Avatar } from 'react-native-elements';

// Importa o objeto de tema (cores, fontes, etc.) para manter a consistência visual do app.
import theme from '../styles/theme';

// ========================================================================
// 2. DEFINIÇÃO DE TIPOS (TYPESCRIPT)
// ========================================================================

// Define a interface de propriedades (props) que o componente `AppointmentCard` espera receber.
interface AppointmentCardProps {
  // `doctorName`: o nome do médico (string).
  doctorName: string;
  // `date`: a data da consulta (string).
  date: string;
  // `time`: o horário da consulta (string).
  time: string;
  // `specialty`: a especialidade do médico (string).
  specialty: string;
  // `status`: o status da consulta, que só pode ser um dos três valores: 'pending', 'confirmed', ou 'cancelled'.
  status: 'pending' | 'confirmed' | 'cancelled';
  // `onPress`: uma função opcional que será chamada quando o card for pressionado.
  onPress?: () => void;
  // `style`: um objeto de estilo opcional para customizar o contêiner do card.
  style?: ViewStyle;
}

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE
// ========================================================================

// Declaração do componente funcional 'AppointmentCard'.
// Ele recebe as propriedades definidas na interface `AppointmentCardProps` e as desestrutura.
const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  date,
  time,
  specialty,
  status,
  onPress,
  style,
}) => {
  // ----------------------------------------------------------------------
  // 3.1. LÓGICA INTERNA E FUNÇÕES AUXILIARES
  // ----------------------------------------------------------------------

  // Função auxiliar para determinar a cor do status com base no valor da prop `status`.
  // Isso centraliza a lógica de cores e torna o JSX mais limpo.
  const getStatusColor = () => {
    switch (status) {
      // Se o status for 'confirmed', retorna a cor de sucesso (verde).
      case 'confirmed':
        return theme.colors.success;
      // Se o status for 'cancelled', retorna a cor de erro (vermelho).
      case 'cancelled':
        return theme.colors.error;
      // Para qualquer outro caso ('pending'), retorna a cor primária (azul/padrão).
      default:
        return theme.colors.primary;
    }
  };

  // ----------------------------------------------------------------------
  // 3.2. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Card (Contêiner Principal) da biblioteca react-native-elements.
    // Representa o card completo que agrupa todas as informações da consulta.
    // Os estilos são combinados: o estilo base `styles.card` e um estilo customizado opcional `style`.
    <Card containerStyle={[styles.card, style]}>
      {/* Componente: CardContent (Área de Conteúdo Interno) */}
      {/* Representa a área interna do card, com um preenchimento (padding) para afastar o conteúdo das bordas. */}
      <CardContent>
        {/* Componente: DoctorInfo (Seção de Informações do Médico) */}
        {/* Representa o bloco superior do card, contendo o avatar, nome e especialidade do médico. */}
        <DoctorInfo>
          {/* Componente: Avatar (Foto do Médico) da biblioteca react-native-elements. */}
          {/* Representa a imagem de perfil do médico. */}
          <Avatar
            size="medium" // Define o tamanho do avatar.
            rounded // Deixa o avatar com formato circular.
            // A URL da imagem é gerada aleatoriamente a partir da API 'randomuser.me' para fins de placeholder.
            source={{ uri: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 10)}.jpg` }}
            containerStyle={styles.avatar} // Aplica estilos ao contêiner do avatar.
          />
          {/* Componente: TextContainer (Contêiner dos Textos do Médico) */}
          {/* Organiza o nome e a especialidade do médico verticalmente. */}
          <TextContainer>
            {/* Componente: DoctorName (Texto do Nome do Médico) */}
            {/* Representa o nome do médico com texto em negrito e maior. */}
            <DoctorName>{doctorName}</DoctorName>
            {/* Componente: Specialty (Texto da Especialidade) */}
            {/* Representa a especialidade do médico com texto menor e mais claro. */}
            <Specialty>{specialty}</Specialty>
          </TextContainer>
        </DoctorInfo>

        {/* Componente: AppointmentInfo (Seção de Informações da Consulta) */}
        {/* Representa o bloco central com os detalhes de data e hora. */}
        <AppointmentInfo>
          {/* Componente: InfoRow (Linha de Informação) - exibe "Data: [data]" */}
          <InfoRow>
            <InfoLabel>Data:</InfoLabel>
            <InfoValue>{date}</InfoValue>
          </InfoRow>
          {/* Componente: InfoRow (Linha de Informação) - exibe "Horário: [horário]" */}
          <InfoRow>
            <InfoLabel>Horário:</InfoLabel>
            <InfoValue>{time}</InfoValue>
          </InfoRow>
        </AppointmentInfo>

        {/* Componente: StatusContainer (Seção do Status da Consulta) */}
        {/* Representa o bloco inferior que exibe o status da consulta (ex: "Confirmada"). */}
        <StatusContainer>
          {/* Componente: StatusDot (Ponto Colorido do Status) */}
          {/* Representa a pequena bolinha colorida que indica visualmente o status. A cor é definida dinamicamente. */}
          <StatusDot color={getStatusColor()} />
          {/* Componente: StatusText (Texto do Status) */}
          {/* Representa o texto do status (ex: "Confirmada", "Cancelada"). A cor do texto também é dinâmica. */}
          <StatusText color={getStatusColor()}>
            {status === 'confirmed' ? 'Confirmada' : status === 'cancelled' ? 'Cancelada' : 'Pendente'}
          </StatusText>
        </StatusContainer>
      </CardContent>
    </Card>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO
// ========================================================================

// ----------------------------------------------------------------------
// 4.1. OBJETO DE ESTILOS (PARA COMPONENTES EXTERNOS)
// ----------------------------------------------------------------------

// Objeto de estilos para componentes da biblioteca `react-native-elements`.
const styles = {
  // Estilo principal para o componente `Card`. Define bordas arredondadas, margens, preenchimento e sombra.
  card: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 15,
    elevation: 3, // Sombra para Android.
    shadowColor: '#000', // Sombra para iOS.
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Estilo para o contêiner do `Avatar`. Define uma cor de fundo que aparece enquanto a imagem está carregando.
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

// ----------------------------------------------------------------------
// 4.2. STYLED COMPONENTS (PARA COMPONENTES CUSTOMIZADOS)
// ----------------------------------------------------------------------

// Cria um <View> para o conteúdo interno do card, com padding.
const CardContent = styled.View`
  padding: 10px;
`;

// Cria um <View> para alinhar o avatar e as informações do médico horizontalmente.
const DoctorInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

// Cria um <View> para agrupar os textos (nome e especialidade) do médico.
const TextContainer = styled.View`
  margin-left: 15px;
`;

// Cria um <Text> para o nome do médico com fonte maior e em negrito.
const DoctorName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

// Cria um <Text> para a especialidade com fonte menor e mais clara.
const Specialty = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

// Cria um <View> para a seção de data e hora.
const AppointmentInfo = styled.View`
  margin-bottom: 15px;
`;

// Cria um <View> que alinha um rótulo e seu valor em uma linha, com espaço entre eles.
const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

// Cria um <Text> para os rótulos "Data:" e "Horário:", com uma cor mais suave.
const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

// Cria um <Text> para os valores da data e do horário, com fonte levemente destacada.
const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

// Cria um <View> para alinhar o ponto e o texto do status.
const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

// Cria um <View> que representa a bolinha colorida. A cor de fundo é recebida via prop `color`.
const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

// Cria um <Text> para o texto do status. A cor do texto é recebida via prop `color`.
const StatusText = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${props => props.color};
  font-weight: 500;
`;


// ========================================================================
// 5. EXPORTAÇÃO DO COMPONENTE
// ========================================================================

// Exporta o componente `AppointmentCard` para que ele possa ser importado e usado em outras partes do aplicativo.
export default AppointmentCard;