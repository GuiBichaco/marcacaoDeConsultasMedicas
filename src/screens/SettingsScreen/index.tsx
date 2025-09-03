/**
 * @file Componente da tela de Configurações.
 * @description Camada de visualização que compõe a UI, utilizando o hook `useSettings`
 * para a lógica e componentes de seção para renderizar o conteúdo.
 */
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import Header from '../../../components/Header';
import theme from '../../../styles/theme';

// Importações locais
import { useSettings } from './hooks/useSettings';
import PreferencesSection from './components/PreferencesSection';
import DataManagementSection from './components/DataManagementSection';
import { Container, ScrollView, Title, LoadingContainer, styles } from './styles';

const SettingsScreen: React.FC = () => {
  const {
    initialLoading, actionLoading, settings, storageInfo,
    updateSetting, handleCreateBackup, handleClearCache, handleClearAllData, handleGoBack,
  } = useSettings();

  if (initialLoading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <ScrollView>
        <Title>Configurações</Title>

        <PreferencesSection settings={settings} onUpdate={updateSetting} />

        <DataManagementSection
          storageInfo={storageInfo}
          isLoading={actionLoading}
          onBackup={handleCreateBackup}
          onClearCache={handleClearCache}
          onClearAll={handleClearAllData}
        />

        <Button title="Voltar" onPress={handleGoBack} containerStyle={styles.button} buttonStyle={styles.buttonStyle} />
      </ScrollView>
    </Container>
  );
};

export default SettingsScreen;