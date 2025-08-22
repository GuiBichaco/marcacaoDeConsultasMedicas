/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente `Header`.
 * É um cabeçalho reutilizável, projetado para ser exibido no topo das telas do aplicativo.
 * Ele mostra uma saudação personalizada com o nome e a foto do usuário logado,
 * além de um ícone de notificações. Os dados do usuário são obtidos de um contexto
 * de autenticação (`AuthContext`).
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS
// ========================================================================

// Importa a biblioteca React, essencial para a criação de componentes.
import React from 'react';

// Importa a biblioteca 'styled-components' para React Native, para criar componentes estilizados.
import styled from 'styled-components/native';

// Importa o componente 'Avatar' da biblioteca 'react-native-elements' para exibir a foto do usuário.
import { Avatar } from 'react-native-elements';

// Importa o hook 'useAuth' do contexto de autenticação. Este hook fornece acesso às informações do usuário logado.
import { useAuth } from '../contexts/AuthContext';

// Importa o componente 'NotificationBell', que provavelmente é um ícone de sino com indicador de notificações.
import NotificationBell from './NotificationBell';

// Importa o objeto de tema (cores, fontes, etc.) para manter a consistência visual.
import theme from '../styles/theme';

// ========================================================================
// 2. DEFINIÇÃO DO COMPONENTE
// ========================================================================

// Declaração do componente funcional 'Header'. Este componente não recebe propriedades (props) diretamente.
const Header: React.FC = () => {
  // ----------------------------------------------------------------------
  // 2.1. LÓGICA E DADOS DO COMPONENTE
  // ----------------------------------------------------------------------

  // Usa o hook 'useAuth' para obter o objeto 'user' do contexto de autenticação global.
  // Isso evita a necessidade de passar os dados do usuário por props em toda a árvore de componentes.
  const { user } = useAuth();

  // Verificação de segurança: se não houver um usuário logado (user for nulo ou indefinido),
  // o componente não renderiza nada (retorna null).
  if (!user) return null;

  // ----------------------------------------------------------------------
  // 2.2. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner Principal do Cabeçalho)
    // Representa a barra do cabeçalho com cor de fundo, preenchimento e alinhamento dos itens.
    <Container>
      {/* Componente: UserInfo (Seção de Informações do Usuário) */}
      {/* Representa o bloco que agrupa a foto e os textos de boas-vindas. */}
      <UserInfo>
        {/* Componente: Avatar (Foto do Usuário) */}
        {/* Representa a imagem de perfil circular do usuário. */}
        <Avatar
          size="medium" // Define o tamanho do avatar.
          rounded // Deixa o avatar com formato circular.
          source={{ uri: user.image }} // A URL da imagem vem do objeto 'user' do contexto.
          containerStyle={styles.avatar}
        />
        {/* Componente: TextContainer (Contêiner dos Textos) */}
        {/* Agrupa os textos de boas-vindas e o nome do usuário verticalmente. */}
        <TextContainer>
          {/* Componente: WelcomeText (Texto de Boas-vindas) */}
          {/* Representa o texto "Bem-vindo(a)," com um estilo mais suave. */}
          <WelcomeText>Bem-vindo(a),</WelcomeText>
          {/* Componente: UserName (Nome do Usuário) */}
          {/* Representa o nome do usuário com um estilo de maior destaque (negrito e maior). */}
          <UserName>{user.name}</UserName>
        </TextContainer>
      </UserInfo>
      {/* Componente: NotificationBell (Ícone de Notificações) */}
      {/* Renderiza o componente importado que mostra o sino de notificações. */}
      <NotificationBell />
    </Container>
  );
};

// ========================================================================
// 3. ESTILIZAÇÃO
// ========================================================================

// Objeto de estilos para componentes que não são 'styled-components' (neste caso, o Avatar).
const styles = {
  // Estilo para o contêiner do Avatar, definindo uma cor de fundo caso a imagem não carregue.
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

// Cria um <View> que serve como o contêiner principal do cabeçalho.
const Container = styled.View`
  background-color: ${theme.colors.primary};
  padding: 16px;
  flex-direction: row; /* Alinha os filhos horizontalmente. */
  justify-content: space-between; /* Coloca espaço entre a info do usuário e o sino. */
  align-items: center; /* Centraliza os filhos verticalmente. */
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

// Cria um <View> para agrupar o avatar e os textos, permitindo que cresçam para preencher o espaço.
const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1; /* Permite que este contêiner ocupe o espaço disponível. */
`;

// Cria um <View> para agrupar os textos, adicionando uma margem à esquerda para separá-los do avatar.
const TextContainer = styled.View`
  margin-left: 12px;
`;

// Cria um <Text> para a mensagem de boas-vindas, com texto branco e levemente transparente.
const WelcomeText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
  opacity: 0.9;
`;

// Cria um <Text> para o nome do usuário, com fonte maior, em negrito e cor branca.
const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.white};
`;

// ========================================================================
// 4. EXPORTAÇÃO DO COMPONENTE
// ========================================================================

// Exporta o componente `Header` para que ele possa ser usado em outras telas do aplicativo.
export default Header;