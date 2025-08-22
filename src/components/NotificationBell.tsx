/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente `NotificationBell`.
 * É um ícone de sino clicável que exibe um contador de notificações não lidas.
 * O componente busca periodicamente o número de notificações novas, atualiza
 * o contador quando a tela ganha foco e navega para a tela de notificações
 * quando é pressionado.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS
// ========================================================================

// Importa hooks essenciais do React: 'useState' para estado e 'useEffect' para efeitos colaterais.
import React, { useState, useEffect } from 'react';

// Importa a biblioteca 'styled-components' para React Native para criar componentes estilizados.
import styled from 'styled-components/native';

// Importa o componente 'TouchableOpacity' do React Native para criar uma área tocável com feedback visual.
import { TouchableOpacity } from 'react-native';

// Importa o componente 'Badge' da biblioteca 'react-native-elements' para exibir o contador.
import { Badge } from 'react-native-elements';

// Importa o hook 'useAuth' para acessar as informações do usuário logado.
import { useAuth } from '../contexts/AuthContext';

// Importa o hook 'useNavigation' da biblioteca React Navigation para controlar a navegação entre telas.
import { useNavigation } from '@react-navigation/native';

// Importa o 'notificationService', um módulo de serviço responsável pela lógica de notificações (ex: chamadas de API).
import { notificationService } from '../services/notifications';

// Importa o objeto de tema (cores, fontes, etc.) para manter a consistência visual.
import theme from '../styles/theme';

// ========================================================================
// 2. DEFINIÇÃO DO COMPONENTE
// ========================================================================

// Declaração do componente funcional 'NotificationBell'. Ele não recebe props.
const NotificationBell: React.FC = () => {
  // ----------------------------------------------------------------------
  // 2.1. HOOKS E ESTADO DO COMPONENTE
  // ----------------------------------------------------------------------

  // Obtém o objeto 'user' do contexto de autenticação.
  const { user } = useAuth();
  // Obtém o objeto 'navigation' para poder navegar para outras telas.
  const navigation = useNavigation();
  // Cria um estado 'unreadCount' para armazenar o número de notificações não lidas. Inicia com 0.
  const [unreadCount, setUnreadCount] = useState(0);

  // ----------------------------------------------------------------------
  // 2.2. FUNÇÕES E EFEITOS (LIFECYCLE)
  // ----------------------------------------------------------------------

  // Função assíncrona para carregar o número de notificações não lidas a partir do serviço.
  const loadUnreadCount = async () => {
    // Se não houver um ID de usuário, interrompe a execução.
    if (!user?.id) return;
    
    try {
      // Chama o serviço para obter a contagem de notificações não lidas para o usuário atual.
      const count = await notificationService.getUnreadCount(user.id);
      // Atualiza o estado com o valor recebido.
      setUnreadCount(count);
    } catch (error) {
      // Exibe um erro no console caso a busca falhe.
      console.error('Erro ao carregar contador de notificações:', error);
    }
  };

  // Primeiro useEffect: Lida com o carregamento inicial e a atualização periódica (polling).
  useEffect(() => {
    // Carrega a contagem assim que o componente é montado.
    loadUnreadCount();
    
    // Configura um intervalo (setInterval) para chamar a função 'loadUnreadCount' a cada 30 segundos (30000 ms).
    const interval = setInterval(loadUnreadCount, 30000);
    
    // Função de limpeza: será executada quando o componente for desmontado.
    // Isso é crucial para evitar vazamentos de memória (memory leaks).
    return () => clearInterval(interval);
  }, [user?.id]); // O efeito será re-executado se o ID do usuário mudar.

  // Segundo useEffect: Lida com a atualização quando a tela ganha foco.
  useEffect(() => {
    // Adiciona um "ouvinte" (listener) ao evento 'focus' da navegação.
    // Toda vez que a tela que contém este componente voltar a ser o foco, a função 'loadUnreadCount' será chamada.
    const unsubscribe = navigation.addListener('focus', loadUnreadCount);
    
    // Função de limpeza: remove o "ouvinte" quando o componente é desmontado para evitar memory leaks.
    return unsubscribe;
  }, [navigation, user?.id]); // O efeito depende dos objetos 'navigation' e 'user.id'.

  // Função para lidar com o clique no sino.
  const handlePress = () => {
    // Navega para a tela chamada 'Notifications'.
    // O 'as never' é um truque de TypeScript para evitar erros de tipagem em algumas configurações de navegação.
    navigation.navigate('Notifications' as never);
  };

  // ----------------------------------------------------------------------
  // 2.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: TouchableOpacity (Área Clicável)
    // Envolve o ícone, tornando toda a área sensível ao toque.
    <TouchableOpacity onPress={handlePress}>
      {/* Componente: BellContainer (Contêiner do Sino) */}
      {/* Posiciona o sino e serve de referência para o posicionamento absoluto do contador (Badge). */}
      <BellContainer>
        {/* Componente: BellIcon (Ícone do Sino) */}
        {/* Representa o ícone do sino, que aqui é um emoji de texto. */}
        <BellIcon>🔔</BellIcon>
        {/* Renderização Condicional: O contador (Badge) só é exibido se houver mais de 0 notificações não lidas. */}
        {unreadCount > 0 && (
          // Componente: Badge (Contador de Notificações) da biblioteca react-native-elements.
          // Representa a bolinha vermelha com o número.
          <Badge
            // O valor exibido é '99+' se a contagem for maior que 99, senão, mostra o número exato.
            value={unreadCount > 99 ? '99+' : unreadCount.toString()}
            status="error" // Define a cor do badge como vermelha (padrão de erro/alerta).
            containerStyle={styles.badge} // Aplica estilos para o posicionamento.
            textStyle={styles.badgeText} // Aplica estilos para o texto dentro do badge.
          />
        )}
      </BellContainer>
    </TouchableOpacity>
  );
};

// ========================================================================
// 3. ESTILIZAÇÃO
// ========================================================================

// Objeto de estilos para o componente Badge.
const styles = {
  // Estilo do contêiner do Badge.
  badge: {
    // 'position: 'absolute'' permite posicionar o badge em relação ao seu pai mais próximo que tenha 'position: 'relative''.
    position: 'absolute' as const, // 'as const' é para o TypeScript entender o valor literal.
    top: -8, // Move o badge 8 pixels para cima da sua posição original.
    right: -8, // Move o badge 8 pixels para a esquerda da sua posição original.
  },
  // Estilo do texto dentro do Badge.
  badgeText: {
    fontSize: 10, // Define um tamanho de fonte pequeno para o contador.
  },
};

// Cria um <View> que serve como contêiner para o sino, com posicionamento relativo para o badge.
const BellContainer = styled.View`
  position: relative; /* Essencial para que o 'position: absolute' do badge funcione corretamente. */
  padding: 8px;
`;

// Cria um <Text> para o ícone do sino, definindo seu tamanho e cor.
const BellIcon = styled.Text`
  font-size: 24px;
  color: ${theme.colors.white};
`;

// ========================================================================
// 4. EXPORTAÇÃO DO COMPONENTE
// ========================================================================

// Exporta o componente `NotificationBell` para que ele possa ser usado em outras partes do aplicativo.
export default NotificationBell;