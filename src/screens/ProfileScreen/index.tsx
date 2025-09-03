/**
 * @file Componente da tela de Perfil do Usuário.
 * @description Esta é a camada de visualização, responsável por montar a UI
 * da tela de perfil, consumindo a lógica do hook `useProfileScreen` e
 * utilizando componentes de UI reutilizáveis.
 */

import React from 'react';
import { Button } from 'react-native-elements';
import Header from '../../../components/Header'; // Ajustar caminho

// Importações locais
import { useProfileScreen } from './hooks/useProfileScreen';
import ProfileCard from './components/ProfileCard';
import { Container, ScrollView, Title, styles } from './styles';

const ProfileScreen: React.FC = () => {
  const { user, handleNavigateToEdit, handleGoBack, handleSignOut } = useProfileScreen();

  return (
    <Container>
      <Header />
      <ScrollView>
        <Title>Meu Perfil</Title>

        {/* Componente de card de perfil extraído */}
        <ProfileCard user={user} />

        <Button
          title="Editar Perfil"
          onPress={handleNavigateToEdit}
          containerStyle={styles.button}
          buttonStyle={styles.editButton}
        />

        <Button
          title="Voltar"
          onPress={handleGoBack}
          containerStyle={styles.button}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Sair"
          onPress={handleSignOut}
          containerStyle={styles.button}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

export default ProfileScreen;