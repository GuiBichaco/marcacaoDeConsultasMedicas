/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente `AppointmentForm`.
 * É um formulário completo para agendar uma nova consulta. O usuário pode
 * selecionar um médico de uma lista, escolher uma data e um horário disponíveis,
 * e adicionar uma descrição para a consulta.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS
// ========================================================================

// Importa o React e o hook 'useState' para gerenciamento de estado.
import React, { useState } from 'react';

// Importa a biblioteca 'styled-components' para React Native, permitindo a criação de componentes estilizados.
import styled from 'styled-components/native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Button, Input, Text } from 'react-native-elements';

// Importa componentes e APIs nativas do React Native.
import { Platform, View, TouchableOpacity } from 'react-native';

// Importa o objeto de tema (cores, fontes, espaçamentos) para manter a consistência visual.
import theme from '../styles/theme';

// Importa os tipos (interfaces) de 'Doctor' e 'Appointment' de arquivos de definição de tipos.
import { Doctor } from '../types/doctors';
import { Appointment } from '../types/appointments';

// ========================================================================
// 2. DADOS MOCKADOS E CONFIGURAÇÕES
// ========================================================================

// Array de médicos mockados (dados de exemplo) para exibir na lista de seleção.
// Em uma aplicação real, esses dados viriam de uma API.
const doctors: Doctor[] = [
    {
        id: '1',
        name: 'Dr. João Silva',
        specialty: 'Cardiologista',
        image: 'https://mighty.tools/mockmind-api/content/human/91.jpg',
    },
    // ... outros médicos
];

// Define o tipo das propriedades (props) que o componente `AppointmentForm` espera receber.
type AppointmentFormProps = {
    // `onSubmit`: uma função que será chamada quando o formulário for submetido com sucesso.
    // Ela recebe um objeto contendo os detalhes da nova consulta.
    onSubmit: (appointment: {
        doctorId: string;
        date: Date;
        time: string;
        description: string;
    }) => void;
};

// Função auxiliar para gerar uma lista de horários disponíveis (slots) de 30 em 30 minutos.
const generateTimeSlots = () => {
    const slots = [];
    // Loop que vai das 9h às 17h.
    for (let hour = 9; hour < 18; hour++) {
        // Adiciona o horário cheio (ex: "09:00").
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        // Adiciona o horário de meia hora (ex: "09:30").
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
};

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE
// ========================================================================

// Declaração do componente funcional 'AppointmentForm'.
const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
    // ----------------------------------------------------------------------
    // 3.1. ESTADOS DO COMPONENTE
    // ----------------------------------------------------------------------
    
    // Estado para armazenar o ID do médico selecionado.
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    // Estado para armazenar o texto do campo de data (formatado como DD/MM/AAAA).
    const [dateInput, setDateInput] = useState('');
    // Estado para armazenar o horário selecionado.
    const [selectedTime, setSelectedTime] = useState<string>('');
    // Estado para armazenar o texto do campo de descrição.
    const [description, setDescription] = useState('');
    // Gera e armazena a lista de horários disponíveis.
    const timeSlots = generateTimeSlots();

    // ----------------------------------------------------------------------
    // 3.2. FUNÇÕES DE VALIDAÇÃO E MANIPULAÇÃO
    // ----------------------------------------------------------------------

    // Função para validar se a data inserida está no formato correto e dentro de um intervalo válido (hoje até 3 meses no futuro).
    const validateDate = (inputDate: string) => {
        // Expressão regular para verificar o formato DD/MM/AAAA.
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = inputDate.match(dateRegex);

        if (!match) return false; // Retorna falso se o formato não for válido.

        // Extrai dia, mês e ano da data.
        const [, day, month, year] = match;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        // Define as datas de hoje e a data máxima permitida (3 meses a partir de hoje).
        const today = new Date();
        const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

        // Retorna true apenas se a data estiver entre hoje e a data máxima.
        return date >= today && date <= maxDate;
    };

    // Função para formatar automaticamente o texto da data enquanto o usuário digita.
    const handleDateChange = (text: string) => {
        // Remove todos os caracteres que não são números.
        const numbers = text.replace(/\D/g, '');
        let formattedDate = '';
        
        // Aplica as barras (/) nos lugares corretos.
        if (numbers.length > 0) {
            if (numbers.length <= 2) {
                formattedDate = numbers; // ex: 22
            } else if (numbers.length <= 4) {
                formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2)}`; // ex: 22/08
            } else {
                formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`; // ex: 22/08/2025
            }
        }

        // Atualiza o estado com a data formatada.
        setDateInput(formattedDate);
    };

    // Função chamada ao pressionar o botão de agendamento.
    const handleSubmit = () => {
        // Validação para garantir que todos os campos foram preenchidos.
        if (!selectedDoctor || !selectedTime || !description) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        // Validação do campo de data.
        if (!validateDate(dateInput)) {
            alert('Por favor, insira uma data válida (DD/MM/AAAA) e futura.');
            return;
        }

        // Converte a string da data (DD/MM/AAAA) para um objeto Date.
        const [day, month, year] = dateInput.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        // Chama a função `onSubmit` passada via props, enviando os dados da nova consulta.
        onSubmit({
            doctorId: selectedDoctor,
            date,
            time: selectedTime,
            description,
        });
    };

    // Função de placeholder para verificar a disponibilidade de um horário.
    const isTimeSlotAvailable = (time: string) => {
        // Em uma aplicação real, aqui haveria uma lógica para consultar uma API
        // e verificar se o médico já tem uma consulta neste horário.
        return true;
    };

    // ----------------------------------------------------------------------
    // 3.3. RENDERIZAÇÃO DA INTERFACE (JSX)
    // ----------------------------------------------------------------------
    return (
        // Componente: Container (Contêiner Principal do Formulário)
        // Representa a área que envolve todo o formulário, aplicando um espaçamento geral.
        <Container>
            {/* Componente: Title (Título da Seção) - "Selecione o Médico" */}
            <Title>Selecione o Médico</Title>
            {/* Componente: DoctorList (Lista de Médicos) */}
            {/* Representa a lista rolável onde os cards dos médicos são exibidos. */}
            <DoctorList horizontal showsHorizontalScrollIndicator={false}>
                {/* Itera sobre o array de médicos e renderiza um `DoctorCard` para cada um. */}
                {doctors.map((doctor) => (
                    // Componente: DoctorCard (Card de Médico Selecionável)
                    // Representa o card clicável de cada médico.
                    <DoctorCard
                        key={doctor.id}
                        selected={selectedDoctor === doctor.id} // Muda o estilo se estiver selecionado.
                        onPress={() => setSelectedDoctor(doctor.id)} // Atualiza o estado ao ser clicado.
                    >
                        {/* Componente: DoctorImage (Imagem do Médico) */}
                        <DoctorImage source={{ uri: doctor.image }} />
                        {/* Componente: DoctorInfo (Informações do Médico) */}
                        <DoctorInfo>
                            {/* Componente: DoctorName (Nome do Médico) */}
                            <DoctorName>{doctor.name}</DoctorName>
                            {/* Componente: DoctorSpecialty (Especialidade do Médico) */}
                            <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                        </DoctorInfo>
                    </DoctorCard>
                ))}
            </DoctorList>

            {/* Componente: Title (Título da Seção) - "Data e Hora" */}
            <Title>Data e Hora</Title>
            {/* Componente: Input (Campo de Data) da biblioteca react-native-elements */}
            {/* Representa o campo de texto para o usuário digitar a data da consulta. */}
            <Input
                placeholder="Data (DD/MM/AAAA)"
                value={dateInput}
                onChangeText={handleDateChange}
                keyboardType="numeric" // Exibe o teclado numérico.
                maxLength={10} // Limita o número de caracteres.
                containerStyle={InputContainer}
                // Exibe uma mensagem de erro se a data for inválida.
                errorMessage={dateInput && !validateDate(dateInput) ? 'Data inválida ou no passado' : undefined}
            />

            {/* Componente: TimeSlotsContainer (Contêiner dos Horários) */}
            {/* Representa a seção que agrupa o título e a grade de horários. */}
            <TimeSlotsContainer>
                <TimeSlotsTitle>Horários Disponíveis:</TimeSlotsTitle>
                {/* Componente: TimeSlotsGrid (Grade de Horários) */}
                {/* Representa a grade onde os botões de horário são exibidos. */}
                <TimeSlotsGrid>
                    {/* Itera sobre a lista de horários e renderiza um `TimeSlotButton` para cada um. */}
                    {timeSlots.map((time) => {
                        const isAvailable = isTimeSlotAvailable(time);
                        return (
                            // Componente: TimeSlotButton (Botão de Horário)
                            // Representa um botão clicável para selecionar um horário.
                            <TimeSlotButton
                                key={time}
                                selected={selectedTime === time} // Muda o estilo se estiver selecionado.
                                disabled={!isAvailable} // Desabilita o botão se o horário não estiver disponível.
                                onPress={() => isAvailable && setSelectedTime(time)} // Seleciona o horário se estiver disponível.
                            >
                                {/* Componente: TimeSlotText (Texto do Horário) */}
                                <TimeSlotText selected={selectedTime === time} disabled={!isAvailable}>
                                    {time}
                                </TimeSlotText>
                            </TimeSlotButton>
                        );
                    })}
                </TimeSlotsGrid>
            </TimeSlotsContainer>

            {/* Componente: Input (Campo de Descrição) da biblioteca react-native-elements */}
            {/* Representa a área de texto para o usuário descrever o motivo da consulta. */}
            <Input
                placeholder="Descrição (motivo da consulta)"
                value={description}
                onChangeText={setDescription}
                multiline // Permite múltiplas linhas.
                numberOfLines={4} // Define a altura inicial.
                containerStyle={InputContainer}
            />

            {/* Componente: SubmitButton (Botão de Agendamento) */}
            {/* Representa o botão principal para submeter o formulário. */}
            <SubmitButton
                title="Agendar Consulta"
                onPress={handleSubmit} // Chama a função de submissão ao ser clicado.
                buttonStyle={{ /* estilos inline para o botão */ }}
            />
        </Container>
    );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLED COMPONENTS E OBJETOS DE ESTILO)
// ========================================================================

// Cria um <View> que serve como o contêiner principal do formulário, com padding.
const Container = styled.View`
  padding: ${theme.spacing.medium}px;
`;

// Cria um <Text> para os títulos das seções (ex: "Selecione o Médico").
const Title = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  /* ... outros estilos de texto */
`;

// Cria um <ScrollView> para a lista horizontal de médicos.
const DoctorList = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  margin-bottom: ${theme.spacing.large}px;
`;


// Cria um <TouchableOpacity> que representa o card de um médico. A cor de fundo muda se a prop `selected` for true.
const DoctorCard = styled(TouchableOpacity)<{ selected: boolean }>`
  background-color: ${(props) => props.selected ? theme.colors.primary : theme.colors.white};
  /* ... outros estilos de layout e sombra */
`;

// Cria um <Image> para a foto do médico, com formato circular.
const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

// Cria um <View> para agrupar as informações textuais do médico.
const DoctorInfo = styled.View`
  flex: 1;
`;

// Cria um <Text> para o nome do médico.
const DoctorName = styled.Text`
  /* ... estilos de fonte */
`;

// Cria um <Text> para a especialidade do médico.
const DoctorSpecialty = styled.Text`
  /* ... estilos de fonte */
`;

// Cria um <View> para a seção de seleção de horários.
const TimeSlotsContainer = styled.View`
  margin-bottom: ${theme.spacing.large}px;
`;

// Cria um <Text> para o título "Horários Disponíveis:".
const TimeSlotsTitle = styled.Text`
  /* ... estilos de fonte */
`;

// Cria um <View> que organiza os botões de horário em uma grade com quebra de linha.
const TimeSlotsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.spacing.small}px;
`;

// Cria um <TouchableOpacity> que representa um botão de horário. Os estilos (cor de fundo, borda, opacidade) mudam com base nas props `selected` e `disabled`.
const TimeSlotButton = styled(TouchableOpacity)<{ selected: boolean; disabled: boolean }>`
  background-color: ${(props) => 
    props.disabled 
      ? theme.colors.background 
      : props.selected 
        ? theme.colors.primary 
        : theme.colors.white};
  /* ... outros estilos dinâmicos */
`;

// Cria um <Text> para o texto do horário. A cor muda se o botão estiver selecionado ou desabilitado.
const TimeSlotText = styled(Text)<{ selected: boolean; disabled: boolean }>`
  color: ${(props) => 
    props.disabled 
      ? theme.colors.text
      : props.selected 
        ? theme.colors.white 
        : theme.colors.text};
`;

// Objeto de estilo para os contêineres dos componentes <Input>.
const InputContainer = {
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
};

// Cria um componente <Button> estilizado para o botão de submissão.
const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.large}px;
`;

// ========================================================================
// 5. EXPORTAÇÃO DO COMPONENTE
// ========================================================================

// Exporta o componente `AppointmentForm` para que possa ser usado em outras partes do aplicativo.
export default AppointmentForm;