/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente `TimeSlotList`.
 * É um componente de UI que renderiza uma grade de horários selecionáveis.
 * Ele gera internamente uma lista de horários disponíveis e permite que o usuário
 * selecione um deles, fornecendo um feedback visual claro para a seleção e
 * notificando o componente pai sobre a escolha.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS
// ========================================================================

// Importa a biblioteca React, essencial para a criação de componentes.
import React from 'react';

// Importa a biblioteca 'styled-components' para React Native, para criar componentes estilizados.
import styled from 'styled-components/native';

// Importa tipos 'ViewStyle' e o componente 'TouchableOpacity' do React Native.
import { ViewStyle, TouchableOpacity } from 'react-native';

// Importa o objeto de tema (cores, fontes, etc.) para manter a consistência visual.
import theme from '../styles/theme';

// ========================================================================
// 2. DEFINIÇÃO DE TIPOS (TYPESCRIPT)
// ========================================================================

// Define a interface das propriedades (props) que o componente `TimeSlotList` espera receber.
interface TimeSlotListProps {
  // `onSelectTime`: uma função de callback que é chamada quando um horário é selecionado, passando o horário (string) como argumento.
  onSelectTime: (time: string) => void;
  // `selectedTime`: o horário atualmente selecionado (opcional). Usado para aplicar o estilo de destaque.
  selectedTime?: string;
  // `style`: um objeto de estilo opcional para customizar o contêiner principal da lista.
  style?: ViewStyle;
}

// Define uma interface para as props de estilo usadas nos styled-components.
// Isso ajuda na tipagem e autocompletar ao definir estilos dinâmicos.
interface StyledProps {
  isSelected: boolean;
}

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE
// ========================================================================

// Declaração do componente funcional 'TimeSlotList'.
const TimeSlotList: React.FC<TimeSlotListProps> = ({
  onSelectTime,
  selectedTime,
  style,
}) => {
  // ----------------------------------------------------------------------
  // 3.1. LÓGICA INTERNA E GERAÇÃO DE DADOS
  // ----------------------------------------------------------------------

  // Função auxiliar para gerar uma lista de horários (slots) de 30 em 30 minutos.
  const generateTimeSlots = () => {
    const slots: string[] = [];
    // Loop que vai das 9h às 17h.
    for (let hour = 9; hour < 18; hour++) {
      // Adiciona o horário cheio (ex: "09:00"). `padStart` garante que sempre tenha dois dígitos.
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      // Adiciona o horário de meia hora (ex: "09:30").
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  // Chama a função para gerar e armazenar a lista de horários.
  const timeSlots = generateTimeSlots();

  // ----------------------------------------------------------------------
  // 3.2. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner Principal)
    // Representa a área que envolve toda a grade de horários.
    <Container style={style}>
      {/* Componente: TimeGrid (Grade de Horários) */}
      {/* Organiza os cards de horário em uma grade com quebra de linha. */}
      <TimeGrid>
        {/* Itera sobre o array 'timeSlots' e renderiza um 'TimeCard' para cada horário. */}
        {timeSlots.map((time) => (
          // Componente: TimeCard (Card de Horário Selecionável)
          // Representa um único botão de horário na grade.
          <TimeCard
            key={time} // Chave única para cada item da lista.
            onPress={() => onSelectTime(time)} // Chama a função `onSelectTime` ao ser pressionado.
            // A prop `isSelected` é passada para o styled-component para controlar o estilo dinâmico.
            isSelected={selectedTime === time}
          >
            {/* Componente: TimeText (Texto do Horário) */}
            {/* Exibe o texto do horário (ex: "14:30"). */}
            <TimeText isSelected={selectedTime === time}>{time}</TimeText>
          </TimeCard>
        ))}
      </TimeGrid>
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLED COMPONENTS)
// ========================================================================

// Cria um <View> que serve como o contêiner principal da lista de horários.
const Container = styled.View`
  margin-bottom: 15px;
`;

// Cria um <View> que organiza os horários em uma grade.
const TimeGrid = styled.View`
  flex-direction: row; /* Alinha os itens horizontalmente. */
  flex-wrap: wrap; /* Permite que os itens quebrem para a próxima linha. */
  justify-content: space-between; /* Distribui o espaço extra entre os itens (ajuda a alinhar). */
  gap: 6px; /* Define um espaçamento (gap) entre os itens da grade. */
`;

// Cria um <TouchableOpacity> que representa o card de um horário.
// Os estilos de `background-color` e `border-color` mudam dinamicamente com base na prop `isSelected`.
const TimeCard = styled(TouchableOpacity)<StyledProps>`
  width: 23%; /* Define a largura para ter aproximadamente 4 itens por linha. */
  padding: 8px;
  border-radius: 6px;
  background-color: ${(props: StyledProps) =>
    props.isSelected ? theme.colors.primary + '20' : theme.colors.background};
  border-width: 1px;
  border-color: ${(props: StyledProps) =>
    props.isSelected ? theme.colors.primary : theme.colors.border};
  align-items: center; /* Centraliza o texto horizontalmente. */
  justify-content: center; /* Centraliza o texto verticalmente. */
`;

// Cria um <Text> para exibir o horário.
// A cor do texto (`color`) muda dinamicamente com base na prop `isSelected`.
const TimeText = styled.Text<StyledProps>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props: StyledProps) =>
    props.isSelected ? theme.colors.primary : theme.colors.text};
`;

// ========================================================================
// 5. EXPORTAÇÃO DO COMPONENTE
// ========================================================================

// Exporta o componente `TimeSlotList` para que ele possa ser usado em outras partes do aplicativo.
export default TimeSlotList;