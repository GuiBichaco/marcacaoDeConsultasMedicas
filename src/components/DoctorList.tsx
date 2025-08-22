/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * * Este arquivo define o componente `DoctorList`.
 * É uma lista visual que exibe uma coleção de médicos, cada um com sua foto,
 * nome e especialidade. O componente permite que o usuário selecione um médico
 * da lista, fornecendo um feedback visual para o item selecionado.
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

// Importa os componentes 'ListItem' e 'Avatar' da biblioteca 'react-native-elements'.
// ListItem: Um componente versátil para criar itens de lista.
// Avatar: Um componente para exibir imagens de perfil.
import { ListItem, Avatar } from 'react-native-elements';

// Importa o objeto de tema (cores, fontes, etc.) para manter a consistência visual.
import theme from '../styles/theme';

// ========================================================================
// 2. DEFINIÇÃO DE TIPOS (TYPESCRIPT)
// ========================================================================

// Define a interface para um objeto 'Doctor', especificando os tipos de dados de suas propriedades.
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Define a interface das propriedades (props) que o componente `DoctorList` espera receber.
interface DoctorListProps {
  // `doctors`: um array de objetos 'Doctor' que será renderizado na lista.
  doctors: Doctor[];
  // `onSelectDoctor`: uma função que será chamada quando um médico for selecionado, passando o objeto do médico como argumento.
  onSelectDoctor: (doctor: Doctor) => void;
  // `selectedDoctorId`: o ID do médico atualmente selecionado (opcional). Usado para aplicar um estilo de destaque.
  selectedDoctorId?: string;
  // `style`: um objeto de estilo opcional para customizar o contêiner principal da lista.
  style?: ViewStyle;
}

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE
// ========================================================================

// Declaração do componente funcional 'DoctorList'.
// Ele recebe as propriedades e as desestrutura para uso no código.
const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
  style,
}) => {
  // ----------------------------------------------------------------------
  // 3.1. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------
  return (
    // Componente: Container (Contêiner Principal da Lista)
    // Representa a área que envolve toda a lista de médicos.
    <Container style={style}>
      {/* Itera sobre o array 'doctors' usando a função .map(). */}
      {/* Para cada objeto 'doctor' no array, renderiza um componente 'ListItem'. */}
      {doctors.map((doctor) => (
        // Componente: ListItem (Item da Lista de Médico) da biblioteca react-native-elements.
        // Representa uma única linha na lista, contendo as informações de um médico.
        <ListItem
          key={doctor.id} // Chave única para cada item da lista, essencial para a performance do React.
          onPress={() => onSelectDoctor(doctor)} // Define a função a ser chamada quando o item for pressionado.
          // Aplica estilos ao contêiner do ListItem.
          containerStyle={[
            styles.listItem, // Estilo base para todos os itens.
            // Estilo condicional: aplica 'styles.selectedItem' apenas se o ID do médico atual for igual ao 'selectedDoctorId'.
            selectedDoctorId === doctor.id && styles.selectedItem,
          ]}
        >
          {/* Componente: Avatar (Foto do Médico) */}
          {/* Representa a imagem de perfil circular do médico. */}
          <Avatar
            size="medium"
            rounded
            source={{ uri: doctor.image }} // URL da imagem do médico.
            containerStyle={styles.avatar}
          />
          {/* Componente: ListItem.Content (Área de Conteúdo do Item) */}
          {/* Agrupa os textos (título e subtítulo) do item da lista. */}
          <ListItem.Content>
            {/* Componente: ListItem.Title (Nome do Médico) */}
            {/* Representa o texto principal (nome do médico) com estilo de destaque. */}
            <ListItem.Title style={styles.name}>{doctor.name}</ListItem.Title>
            {/* Componente: ListItem.Subtitle (Especialidade do Médico) */}
            {/* Representa o texto secundário (especialidade) com estilo mais suave. */}
            <ListItem.Subtitle style={styles.specialty}>
              {doctor.specialty}
            </ListItem.Subtitle>
          </ListItem.Content>
          {/* Componente: ListItem.Chevron (Ícone de Seta) */}
          {/* Adiciona um ícone de seta (>) no final da linha, indicando que o item é clicável. */}
          <ListItem.Chevron />
        </ListItem>
      ))}
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO
// ========================================================================

// Objeto de estilos para os componentes da biblioteca 'react-native-elements'.
const styles = {
  // Estilo base para cada item da lista: bordas arredondadas, margem, cor de fundo e borda.
  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Estilo aplicado a um item quando ele está selecionado: cor de fundo com transparência e cor da borda destacada.
  // O '+ '20'' adiciona um valor alfa hexadecimal, tornando a cor primária semitransparente.
  selectedItem: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  // Estilo para o contêiner do avatar, define uma cor de fundo para ser exibida enquanto a imagem carrega.
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  // Estilo para o texto do nome do médico.
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  // Estilo para o texto da especialidade.
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7, // Deixa o texto levemente transparente para dar menos destaque.
  },
};

// Cria um componente <View> estilizado que serve como o contêiner principal da lista.
const Container = styled.View`
  margin-bottom: 15px;
`;

// ========================================================================
// 5. EXPORTAÇÃO DO COMPONENTE
// ========================================================================

// Exporta o componente `DoctorList` para que ele possa ser importado e usado em outras telas do aplicativo.
export default DoctorList;