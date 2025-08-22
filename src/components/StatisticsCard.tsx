/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente `StatisticsCard`.
 * É um "card" de UI reutilizável, projetado para exibir um dado estatístico
 * de forma clara e visualmente atraente. Ele é flexível e pode ser customizado
 * com um título, valor, subtítulo, ícone e cor de destaque.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS
// ========================================================================

// Importa a biblioteca React, essencial para a criação de componentes.
import React from 'react';

// Importa a biblioteca 'styled-components' para React Native, para criar componentes estilizados.
import styled from 'styled-components/native';

// Importa o tipo 'ViewStyle' do React Native para a tipagem de objetos de estilo.
import { ViewStyle } from 'react-native';

// Importa o objeto de tema (cores, fontes, etc.) para manter a consistência visual.
import theme from '../styles/theme';

// ========================================================================
// 2. DEFINIÇÃO DE TIPOS (TYPESCRIPT)
// ========================================================================

// Define a interface das propriedades (props) que o componente `StatisticsCard` espera receber.
interface StatisticsCardProps {
  // `title`: o título ou rótulo da estatística (ex: "Consultas Concluídas").
  title: string;
  // `value`: o valor numérico ou textual da estatística a ser exibido em destaque.
  value: string | number;
  // `subtitle`: um texto opcional para fornecer contexto adicional (ex: "no último mês").
  subtitle?: string;
  // `color`: uma cor opcional para a borda e o texto do valor. Se não for fornecida, usa a cor primária do tema.
  color?: string;
  // `icon`: um nó React opcional (pode ser um componente de ícone) a ser exibido ao lado do título.
  icon?: React.ReactNode;
  // `style`: um objeto de estilo opcional para customizar o contêiner principal do card.
  style?: ViewStyle;
}

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE
// ========================================================================

// Declaração do componente funcional 'StatisticsCard'.
// Ele recebe as props e define um valor padrão para a prop `color`.
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  color = theme.colors.primary, // Define a cor primária como padrão se nenhuma cor for passada.
  icon,
  style,
}) => {
  // ----------------------------------------------------------------------
  // 3.1. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner Principal do Card)
    // Representa o card branco com sombra e uma borda colorida à esquerda.
    <Container style={style} color={color}>
      {/* Componente: Header (Cabeçalho do Card) */}
      {/* Representa a seção superior que agrupa o ícone e o título. */}
      <Header>
        {/* Renderização Condicional: O ícone só é exibido se a prop `icon` for fornecida. */}
        {icon && <IconContainer>{icon}</IconContainer>}
        {/* Componente: Title (Título da Estatística) */}
        {/* Representa o texto do título. */}
        <Title>{title}</Title>
      </Header>
      {/* Componente: Value (Valor da Estatística) */}
      {/* Representa o número ou texto principal em destaque, com cor dinâmica. */}
      <Value color={color}>{value}</Value>
      {/* Renderização Condicional: O subtítulo só é exibido se a prop `subtitle` for fornecida. */}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLED COMPONENTS)
// ========================================================================

// Cria um <View> que representa o contêiner do card.
// A cor da borda esquerda (`border-left-color`) é definida dinamicamente pela prop `color`.
const Container = styled.View<{ color: string }>`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin: 8px;
  min-height: 120px;
  justify-content: space-between; /* Distribui o espaço verticalmente entre os itens. */
  border-left-width: 4px;
  border-left-color: ${(props) => props.color}; /* Cor da borda dinâmica. */
  shadow-color: ${theme.colors.text}; /* Sombra para iOS. */
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3; /* Sombra para Android. */
`;

// Cria um <View> para o cabeçalho, alinhando o ícone e o título horizontalmente.
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

// Cria um <View> que envolve o ícone, adicionando uma margem à direita para separá-lo do título.
const IconContainer = styled.View`
  margin-right: 8px;
`;

// Cria um <Text> para o título, com uma fonte de peso médio e levemente transparente.
const Title = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
  opacity: 0.8;
`;

// Cria um <Text> para o valor principal.
// A cor do texto (`color`) é definida dinamicamente pela prop `color`.
const Value = styled.Text<{ color: string }>`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.color}; /* Cor do texto dinâmica. */
  margin-bottom: 4px;
`;

// Cria um <Text> para o subtítulo, com uma fonte menor e mais transparente para menor destaque.
const Subtitle = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
`;

// ========================================================================
// 5. EXPORTAÇÃO DO COMPONENTE
// ========================================================================

// Exporta o componente `StatisticsCard` para que ele possa ser usado em outras partes do aplicativo.
export default StatisticsCard;