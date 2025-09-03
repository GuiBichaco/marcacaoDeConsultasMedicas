/**
 * @file Hook customizado para gerenciar a lógica da tela de Configurações.
 */
import React, { useState } from 'react';
import { Alert, Share } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { storageService } from '../../../services/storage';
import { AppSettings } from '../models/types';

const INITIAL_SETTINGS: AppSettings = {
  notifications: true, autoBackup: true, theme: 'light', language: 'pt-BR',
};

export const useSettings = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Loading para ações específicas (ex: backup)

  // Carrega as configurações e informações de armazenamento
  const loadData = async () => {
    try {
      const [appSettings, info] = await Promise.all([
        storageService.getAppSettings(),
        storageService.getStorageInfo(),
      ]);
      setSettings(appSettings);
      setStorageInfo(info);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useFocusEffect(React.useCallback(() => { loadData(); }, []));

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings); // Feedback otimista na UI
    try {
      await storageService.updateAppSettings({ [key]: value });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a configuração.');
    }
  };

  const handleCreateBackup = async () => {
    setActionLoading(true);
    try {
      const backupData = await storageService.createBackup();
      await Share.share({ message: backupData, title: 'Backup do App' });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o backup.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearCache = () => Alert.alert('Limpar Cache', 'Tem certeza?', [
    { text: 'Cancelar' },
    { text: 'Limpar', style: 'destructive', onPress: async () => {
        await storageService.clearCache();
        await loadData(); // Recarrega info
        Alert.alert('Sucesso', 'Cache limpo!');
    }},
  ]);

  const handleClearAllData = () => Alert.alert('Apagar Todos os Dados', 'Esta ação é irreversível!', [
    { text: 'Cancelar' },
    { text: 'APAGAR', style: 'destructive', onPress: () => 
      Alert.alert('Confirmação Final', 'Todos os seus dados serão perdidos. Certeza absoluta?', [
        { text: 'Cancelar' },
        { text: 'SIM, APAGAR TUDO', style: 'destructive', onPress: async () => {
            await storageService.clearAll();
            Alert.alert('Concluído', 'Dados apagados. O app será reiniciado.', [
              { text: 'OK', onPress: signOut },
            ]);
        }},
      ])
    },
  ]);

  return {
    initialLoading,
    actionLoading,
    settings,
    storageInfo,
    updateSetting,
    handleCreateBackup,
    handleClearCache,
    handleClearAllData,
    handleGoBack: () => navigation.goBack(),
  };
};