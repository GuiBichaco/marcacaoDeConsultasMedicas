/**
 * DOCUMENTAÇÃO DO CÓdigo
 * =======================
 *
 * * Arquivo: `SettingsScreen.tsx`
 * * Descrição: Este arquivo define o componente `SettingsScreen`, que serve como a central de
 * configurações do aplicativo. A tela permite que o usuário gerencie preferências pessoais
 * (como notificações e backups automáticos) e execute ações de gerenciamento de dados,
 * como criar backups manuais, limpar o cache e apagar todos os dados do aplicativo.
 *
 * * Funcionalidades Principais:
 * 1. Carrega e exibe as configurações salvas do usuário a partir de um `storageService`.
 * 2. Permite ao usuário alterar configurações através de interruptores (Switches).
 * 3. Oferece a funcionalidade de criar um backup dos dados e compartilhá-lo usando a API `Share` do React Native.
 * 4. Fornece ações de limpeza de dados (cache e todos os dados) com diálogos de confirmação para evitar perdas acidentais.
 * 5. A ação de apagar todos os dados utiliza uma confirmação dupla para segurança extra.
 * 6. Exibe informações sobre o uso do armazenamento local.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS, HOOKS E COMPONENTES
// ========================================================================

// Importa hooks e APIs essenciais do React e React Native.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, Alert, Share } from 'react-native';

// Importa componentes de UI da biblioteca 'react-native-elements'.
import { Button, ListItem, Switch, Text } from 'react-native-elements';

// Importa hooks customizados e de navegação.
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Importa tipos de navegação.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importa o tema, componentes e o serviço de armazenamento.
import theme from '../styles/theme';
import Header from '../components/Header';
import { storageService } from '../services/storage';

// ========================================================================
// 2. DEFINIÇÕES DE TIPOS
// ========================================================================

// Tipagem para as props de navegação específicas desta tela.
type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

// Interface para o objeto de configurações do aplicativo.
interface AppSettings {
  notifications: boolean;
  autoBackup: boolean;
  theme: 'light' | 'dark';
  language: string;
}

// ========================================================================
// 3. DEFINIÇÃO DO COMPONENTE DE TELA
// ========================================================================
const SettingsScreen: React.FC = () => {
  // ----------------------------------------------------------------------
  // 3.1. HOOKS E ESTADOS
  // ----------------------------------------------------------------------

  const { user, signOut } = useAuth();
  const navigation = useNavigation<SettingsScreenProps['navigation']>();
  
  // Estado para armazenar o objeto de configurações do app.
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true, autoBackup: true, theme: 'light', language: 'pt-BR',
  });
  // Estado para controlar o indicador de carregamento.
  const [loading, setLoading] = useState(true);
  // Estado para armazenar informações sobre o uso do armazenamento.
  const [storageInfo, setStorageInfo] = useState<any>(null);

  // ----------------------------------------------------------------------
  // 3.2. FUNÇÕES DE DADOS E AÇÕES
  // ----------------------------------------------------------------------

  // Função assíncrona para carregar as configurações e informações de armazenamento.
  const loadSettings = async () => {
    try {
      const appSettings = await storageService.getAppSettings();
      setSettings(appSettings);
      
      const info = await storageService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hook `useFocusEffect` para recarregar as configurações sempre que a tela ganhar foco.
  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  // Função para atualizar uma configuração específica.
  const updateSetting = async (key: keyof AppSettings, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings); // Atualiza o estado local para feedback imediato na UI.
      await storageService.updateAppSettings({ [key]: value }); // Persiste a mudança no armazenamento.
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      Alert.alert('Erro', 'Não foi possível salvar a configuração');
    }
  };

  // Função para criar um backup manual e usar a API de compartilhamento do sistema.
  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      const backup = await storageService.createBackup();
      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`;
      
      // Abre a interface de compartilhamento nativa do dispositivo.
      await Share.share({
        message: backup, // O conteúdo a ser compartilhado (em alguns sistemas).
        title: `Backup do App - ${fileName}`, // O título para a ação de compartilhamento.
      });
      
      Alert.alert('Sucesso', 'Backup criado e compartilhado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      Alert.alert('Erro', 'Não foi possível criar o backup');
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar o cache da aplicação, com confirmação do usuário.
  const handleClearCache = async () => {
    Alert.alert('Limpar Cache', 'Isso irá limpar o cache da aplicação. Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar', style: 'destructive',
        onPress: async () => {
          try {
            storageService.clearCache();
            await loadSettings(); // Recarrega as informações de armazenamento.
            Alert.alert('Sucesso', 'Cache limpo com sucesso!');
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível limpar o cache');
          }
        },
      },
    ]);
  };

  // Função para apagar TODOS os dados, com dupla confirmação para segurança.
  const handleClearAllData = async () => {
    Alert.alert('Apagar Todos os Dados', 'ATENÇÃO: Isso irá apagar TODOS os dados da aplicação permanentemente. Esta ação não pode ser desfeita!', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'APAGAR TUDO', style: 'destructive',
        onPress: () => { // Segunda confirmação.
          Alert.alert('Confirmação Final', 'Tem certeza absoluta? Todos os dados serão perdidos!', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'SIM, APAGAR', style: 'destructive',
              onPress: async () => {
                try {
                  await storageService.clearAll();
                  Alert.alert('Concluído', 'Todos os dados foram apagados. O app será reiniciado.', [
                    { text: 'OK', onPress: () => signOut() } // Faz logout para reiniciar o estado do app.
                  ]);
                } catch (error) {
                  Alert.alert('Erro', 'Não foi possível apagar os dados');
                }
              },
            },
          ]);
        },
      },
    ]);
  };

  // ----------------------------------------------------------------------
  // 3.3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // ----------------------------------------------------------------------

  // Exibe uma tela de carregamento enquanto as configurações são buscadas pela primeira vez.
  if (loading) {
    return (
      <Container>
        <Header />
        <LoadingContainer><LoadingText>Carregando configurações...</LoadingText></LoadingContainer>
      </Container>
    );
  }

  // Renderiza a tela principal de configurações.
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Configurações</Title>

        {/* Seção de Preferências do Usuário */}
        <SectionTitle>Preferências</SectionTitle>
        <SettingsCard>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Notificações</ListItem.Title>
              <ListItem.Subtitle>Receber notificações push</ListItem.Subtitle>
            </ListItem.Content>
            {/* O Switch atualiza a configuração quando seu valor muda. */}
            <Switch value={settings.notifications} onValueChange={(value) => updateSetting('notifications', value)} />
          </ListItem>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Backup Automático</ListItem.Title>
              <ListItem.Subtitle>Criar backups automaticamente</ListItem.Subtitle>
            </ListItem.Content>
            <Switch value={settings.autoBackup} onValueChange={(value) => updateSetting('autoBackup', value)} />
          </ListItem>
        </SettingsCard>

        {/* Seção de Dados e Armazenamento */}
        <SectionTitle>Dados e Armazenamento</SectionTitle>
        <SettingsCard>
          {storageInfo && (
            <>
              <InfoItem><InfoLabel>Itens no Cache:</InfoLabel><InfoValue>{storageInfo.cacheSize}</InfoValue></InfoItem>
              <InfoItem><InfoLabel>Total de Chaves:</InfoLabel><InfoValue>{storageInfo.totalKeys}</InfoValue></InfoItem>
            </>
          )}
        </SettingsCard>

        {/* Botões para ações de gerenciamento de dados. */}
        <Button title="Criar Backup" onPress={handleCreateBackup} containerStyle={styles.button as ViewStyle} buttonStyle={styles.backupButton} loading={loading} />
        <Button title="Limpar Cache" onPress={handleClearCache} containerStyle={styles.button as ViewStyle} buttonStyle={styles.cacheButton} />

        {/* Seção para ações perigosas, com destaque visual. */}
        <SectionTitle>Ações Perigosas</SectionTitle>
        <Button title="Apagar Todos os Dados" onPress={handleClearAllData} containerStyle={styles.button as ViewStyle} buttonStyle={styles.dangerButton} />
        
        <Button title="Voltar" onPress={() => navigation.goBack()} containerStyle={styles.button as ViewStyle} buttonStyle={styles.buttonStyle} />
      </ScrollView>
    </Container>
  );
};

// ========================================================================
// 4. ESTILIZAÇÃO (STYLES E STYLED COMPONENTS)
// ========================================================================

const styles = {
  scrollContent: { padding: 20, },
  button: { marginBottom: 15, width: '100%', },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12, },
  backupButton: { backgroundColor: theme.colors.success, paddingVertical: 12, },
  cacheButton: { backgroundColor: theme.colors.warning, paddingVertical: 12, },
  dangerButton: { backgroundColor: theme.colors.error, paddingVertical: 12, },
};

// --- Styled Components ---
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 20px;
`;

// Card para agrupar itens de configuração.
const SettingsCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  margin-bottom: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden; /* Garante que os cantos dos ListItems fiquem arredondados. */
`;

// Item para exibir informações de armazenamento.
const InfoItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const InfoLabel = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
`;

const InfoValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

// Exporta o componente para ser usado no navegador de rotas.
export default SettingsScreen;