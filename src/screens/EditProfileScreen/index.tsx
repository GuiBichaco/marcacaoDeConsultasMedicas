/**
 * @file Componente da tela para Edição de Perfil.
 * @description Camada de visualização que compõe a UI, utilizando o hook `useEditProfile`
 * para a lógica e o componente `EditProfileForm` para a renderização do formulário.
 */

import React from 'react';
import { Button } from 'react-native-elements';
import Header from '../../components/Header'; 

// Importações locais
import { useEditProfile } from './hooks/useEditProfile';
import EditProfileForm from './components/EditProfileForm';
import { Container, ScrollView, Title, styles } from './styles';

const EditProfileScreen: React.FC = () => {
  const {
    user,
    name, setName,
    email, setEmail,
    specialty, setSpecialty,
    loading,
    handleSave,
    handleCancel,
  } = useEditProfile();

  return (
    <Container>
      <Header />
      <ScrollView>
        <Title>Editar Perfil</Title>

        <EditProfileForm
          user={user}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          specialty={specialty}
          setSpecialty={setSpecialty}
        />

        <Button
          title="Salvar Alterações"
          onPress={handleSave}
          loading={loading}
          containerStyle={styles.button}
          buttonStyle={styles.saveButton}
        />
        <Button
          title="Cancelar"
          onPress={handleCancel}
          containerStyle={styles.button}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

export default EditProfileScreen;