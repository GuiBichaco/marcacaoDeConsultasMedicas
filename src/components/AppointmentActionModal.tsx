/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente React Native `AppointmentActionModal`.
 * É um modal reutilizável projetado para confirmar ou cancelar uma consulta.
 * A aparência e o comportamento do modal (textos, cores, ações) são controlados
 * pelas propriedades (props) que ele recebe do componente que o chama.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS
// ========================================================================

// Importa a biblioteca React, essencial para a criação de componentes.
import React from 'react';

// Importa a biblioteca 'styled-components' para React Native, permitindo a criação de componentes estilizados com sintaxe de CSS.
import styled from 'styled-components/native';

// Importa o componente 'Modal' e o tipo 'ViewStyle' do React Native.
// 'Modal' é usado para exibir uma tela sobreposta à tela principal.
// 'ViewStyle' é um tipo TypeScript para objetos de estilo.
import { Modal, ViewStyle } from 'react-native';

// Importa os componentes 'Button' (botão) e 'Input' (campo de texto) da biblioteca 'react-native-elements' para criar elementos de UI.
import { Button, Input } from 'react-native-elements';

// Importa o objeto de tema (cores, fontes, etc.) para manter a consistência visual do app.
import theme from '../styles/theme';

// ========================================================================
// 2. DEFINIÇÃO DE TIPOS (TYPESCRIPT)
// ========================================================================

// Define a "interface" (contrato) de propriedades (props) que o componente espera receber.
// Isso garante que o componente seja usado corretamente, com os tipos de dados esperados.
interface AppointmentActionModalProps {
  // `visible`: um booleano que controla se o modal está visível (true) ou oculto (false).
  visible: boolean;
  // `onClose`: uma função a ser chamada quando o modal deve ser fechado (ex: clique no botão "Cancelar" ou no botão de voltar do Android).
  onClose: () => void;
  // `onConfirm`: uma função a ser chamada quando a ação principal é confirmada. Pode receber o motivo do cancelamento como uma string opcional.
  onConfirm: (reason?: string) => void;
  // `actionType`: define o comportamento do modal, podendo ser 'confirm' (para confirmar) ou 'cancel' (para cancelar).
  actionType: 'confirm' | 'cancel';
  // `appointmentDetails`: um objeto com todos os detalhes da consulta a serem exibidos no modal.
  appointmentDetails: {
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    specialty: string;
  };
}

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE
// ========================================================================

// Declaração do componente funcional 'AppointmentActionModal'.
// Ele recebe as propriedades (props) e as desestrutura para uso direto no código.
const AppointmentActionModal: React.FC<AppointmentActionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  actionType,
  appointmentDetails,
}) => {
  // ----------------------------------------------------------------------
  // 3.1. ESTADO E LÓGICA INTERNA
  // ----------------------------------------------------------------------

  // Cria um estado interno chamado 'reason' para armazenar o texto digitado pelo usuário no campo de motivo do cancelamento.
  // `setReason` é a função usada para atualizar esse estado. O valor inicial é uma string vazia.
  const [reason, setReason] = React.useState('');

  // Função para lidar com a confirmação da ação principal (Confirmar ou Confirmar Cancelamento).
  const handleConfirm = () => {
    // Chama a função `onConfirm` passada pelo componente pai, enviando o motivo (sem espaços em branco no início/fim).
    // Se o motivo estiver vazio, envia 'undefined'.
    onConfirm(reason.trim() || undefined);
    // Limpa o campo de motivo após o envio para o modal estar limpo na próxima vez que for aberto.
    setReason('');
    // Fecha o modal chamando a função `onClose`.
    onClose();
  };

  // Função para lidar com o fechamento do modal (ação de cancelar).
  const handleClose = () => {
    // Limpa o campo de motivo para garantir que ele não persista.
    setReason('');
    // Chama a função `onClose` passada pelo componente pai para fechar o modal.
    onClose();
  };

  // Variável auxiliar para verificar se a ação é de cancelamento.
  // Isso torna o código JSX mais legível e evita repetição da lógica 'actionType === 'cancel''.
  const isCancel = actionType === 'cancel';

  // ----------------------------------------------------------------------
  // 3.2. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Modal (Tela Sobreposta)
    // Representa a janela que aparece por cima do conteúdo principal do aplicativo.
    <Modal
      visible={visible} // A visibilidade do modal é controlada pela prop 'visible'.
      transparent // O fundo do modal é transparente para que o 'Overlay' seja visível.
      animationType="slide" // A animação de entrada do modal será um deslize ('slide') de baixo para cima.
      onRequestClose={handleClose} // Define a função a ser chamada quando o usuário aperta o botão de "voltar" no Android.
    >
      {/* Componente: Overlay (Fundo Escurecido) */}
      {/* Representa a camada escura e semitransparente que cobre a tela de fundo, focando a atenção do usuário no modal. */}
      <Overlay>
        {/* Componente: ModalContainer (Caixa Branca do Modal) */}
        {/* Representa o contêiner branco principal onde todo o conteúdo do modal é exibido. */}
        <ModalContainer>
          {/* Componente: Header (Cabeçalho do Modal) */}
          {/* Representa a seção superior do modal, contendo o título. */}
          <Header>
            {/* Componente: Title (Título do Modal) */}
            {/* Representa o texto do título. O texto muda dinamicamente dependendo da ação (cancelar ou confirmar). */}
            <Title>
              {isCancel ? 'Cancelar Consulta' : 'Confirmar Consulta'}
            </Title>
          </Header>

          {/* Componente: Content (Área de Conteúdo do Modal) */}
          {/* Representa a área central do modal com as informações e campos de entrada. */}
          <Content>
            {/* Componente: AppointmentInfo (Box de Informações da Consulta) */}
            {/* Representa o bloco com fundo cinza claro que resume os detalhes da consulta. */}
            <AppointmentInfo>
              {/* Componente: InfoRow (Linha de Informação) - exibe "Paciente: [nome]" */}
              <InfoRow>
                <InfoLabel>Paciente:</InfoLabel>
                <InfoValue>{appointmentDetails.patientName}</InfoValue>
              </InfoRow>
              {/* Componente: InfoRow (Linha de Informação) - exibe "Médico: [nome]" */}
              <InfoRow>
                <InfoLabel>Médico:</InfoLabel>
                <InfoValue>{appointmentDetails.doctorName}</InfoValue>
              </InfoRow>
              {/* Componente: InfoRow (Linha de Informação) - exibe "Especialidade: [nome]" */}
              <InfoRow>
                <InfoLabel>Especialidade:</InfoLabel>
                <InfoValue>{appointmentDetails.specialty}</InfoValue>
              </InfoRow>
              {/* Componente: InfoRow (Linha de Informação) - exibe "Data/Hora: [data] às [hora]" */}
              <InfoRow>
                <InfoLabel>Data/Hora:</InfoLabel>
                <InfoValue>{appointmentDetails.date} às {appointmentDetails.time}</InfoValue>
              </InfoRow>
            </AppointmentInfo>

            {/* Renderização Condicional: Este bloco só aparece se a ação for de cancelamento (`isCancel` for true). */}
            {isCancel && (
              // Componente: ReasonContainer (Contêiner do Campo de Motivo)
              // Representa a área que envolve o campo de texto para o motivo.
              <ReasonContainer>
                {/* Componente: Input (Campo de Texto) da biblioteca react-native-elements */}
                {/* Representa o campo onde o usuário pode digitar o motivo do cancelamento. */}
                <Input
                  label="Motivo do cancelamento (opcional)"
                  placeholder="Digite o motivo..."
                  value={reason} // O valor exibido é controlado pelo estado 'reason'.
                  onChangeText={setReason} // A função 'setReason' é chamada a cada mudança no texto.
                  multiline // Permite que o texto tenha múltiplas linhas.
                  numberOfLines={3} // Define a altura inicial do campo para 3 linhas.
                  containerStyle={styles.reasonInput} // Aplica estilos definidos no objeto 'styles'.
                />
              </ReasonContainer>
            )}

            {/* Componente: ConfirmationText (Texto de Confirmação) */}
            {/* Representa a pergunta de confirmação final (ex: "Tem certeza que deseja...?"). */}
            {/* A cor e o texto mudam com base no valor da prop `isCancel`. */}
            <ConfirmationText isCancel={isCancel}>
              {isCancel 
                ? 'Tem certeza que deseja cancelar esta consulta?'
                : 'Tem certeza que deseja confirmar esta consulta?'
              }
            </ConfirmationText>
          </Content>

          {/* Componente: ButtonContainer (Contêiner dos Botões de Ação) */}
          {/* Representa a seção inferior do modal que alinha os botões horizontalmente. */}
          <ButtonContainer>
            {/* Componente: Button (Botão Secundário - "Cancelar") */}
            {/* Representa o botão que fecha o modal sem executar a ação principal. */}
            <Button
              title="Cancelar"
              onPress={handleClose} // Ao ser pressionado, chama a função para fechar o modal.
              containerStyle={styles.cancelButton as ViewStyle} // Estilo do contêiner do botão.
              buttonStyle={styles.cancelButtonStyle} // Estilo do botão em si.
            />
            {/* Componente: Button (Botão Principal - "Confirmar" ou "Confirmar Cancelamento") */}
            {/* Representa o botão que executa a ação principal. */}
            <Button
              title={isCancel ? 'Confirmar Cancelamento' : 'Confirmar'} // O texto do botão muda dinamicamente.
              onPress={handleConfirm} // Ao ser pressionado, chama a função para confirmar a ação.
              containerStyle={styles.confirmButton as ViewStyle}
              // O estilo do botão é dinâmico: a cor de fundo muda se for uma ação de cancelar (vermelho) ou confirmar (verde).
              buttonStyle={[
                styles.confirmButtonStyle,
                { backgroundColor: isCancel ? theme.colors.error : theme.colors.success }
              ]}
            />
          </ButtonContainer>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO
// ========================================================================

// ----------------------------------------------------------------------
// 4.1. OBJETO DE ESTILOS (PARA COMPONENTES EXTERNOS)
// ----------------------------------------------------------------------

// Objeto de estilos para componentes que não são 'styled-components' (neste caso, da biblioteca 'react-native-elements').
// Esta é uma abordagem de estilização mais tradicional no React Native.
const styles = {
  reasonInput: { marginBottom: 10 },
  cancelButton: { flex: 1, marginRight: 8 },
  confirmButton: { flex: 1, marginLeft: 8 },
  cancelButtonStyle: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
  confirmButtonStyle: { paddingVertical: 12 },
};

// ----------------------------------------------------------------------
// 4.2. STYLED COMPONENTS (PARA COMPONENTES CUSTOMIZADOS)
// ----------------------------------------------------------------------

// Cria um componente <View> que representa o fundo escuro e semitransparente.
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

// Cria um <View> que representa o card branco do modal com bordas arredondadas e sombra.
const ModalContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5; // Sombra para Android
`;

// Cria um <View> para a seção do título com preenchimento e uma linha divisória inferior.
const Header = styled.View`
  padding: 20px 20px 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

// Cria um componente <Text> para o título, com fonte maior, negrito e centralizado.
const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
`;

// Cria um <View> que envolve o conteúdo principal, adicionando preenchimento interno.
const Content = styled.View`
  padding: 20px;
`;

// Cria um <View> para a caixa de informações, com cor de fundo, bordas arredondadas e preenchimento.
const AppointmentInfo = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

// Cria um <View> que organiza o rótulo e o valor em uma linha, com espaço entre eles.
const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

// Cria um <Text> para o rótulo (ex: "Paciente:") com uma fonte mais destacada.
const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

// Cria um <Text> para o valor da informação (ex: "João da Silva"), alinhado à direita.
const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 400;
  flex: 1;
  text-align: right;
`;

// Cria um <View> que adiciona uma margem inferior ao campo de motivo.
const ReasonContainer = styled.View`
  margin-bottom: 16px;
`;

// Cria um <Text> cujo estilo (a cor) depende de uma prop chamada `isCancel`.
const ConfirmationText = styled.Text<{ isCancel: boolean }>`
  font-size: 16px;
  /* A cor do texto é definida dinamicamente: vermelha para cancelamento, verde para confirmação. */
  color: ${(props: { isCancel: boolean }) => props.isCancel ? theme.colors.error : theme.colors.success};
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;

// Cria um <View> que organiza os botões em uma linha na parte inferior do modal.
const ButtonContainer = styled.View`
  flex-direction: row;
  padding: 0 20px 20px 20px;
`;

// ========================================================================
// 5. EXPORTAÇÃO DO COMPONENTE
// ========================================================================

// Exporta o componente 'AppointmentActionModal' como padrão para que ele possa ser importado e usado em outras partes do aplicativo.
export default AppointmentActionModal;