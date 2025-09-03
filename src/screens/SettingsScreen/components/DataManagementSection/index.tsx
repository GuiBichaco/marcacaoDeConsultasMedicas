import React from 'react';
import { Button } from 'react-native-elements';
import { SectionTitle, SettingsCard, InfoItem, InfoLabel, InfoValue, styles } from '../../styles';

interface Props {
  storageInfo: any;
  isLoading: boolean;
  onBackup: () => void;
  onClearCache: () => void;
  onClearAll: () => void;
}

const DataManagementSection: React.FC<Props> = ({ storageInfo, isLoading, onBackup, onClearCache, onClearAll }) => (
  <>
    <SectionTitle>Dados e Armazenamento</SectionTitle>
    <SettingsCard>
      {storageInfo && (
        <>
          <InfoItem><InfoLabel>Itens no Cache:</InfoLabel><InfoValue>{storageInfo.cacheSize}</InfoValue></InfoItem>
          <InfoItem><InfoLabel>Total de Chaves:</InfoLabel><InfoValue>{storageInfo.totalKeys}</InfoValue></InfoItem>
        </>
      )}
    </SettingsCard>
    <Button title="Criar Backup" onPress={onBackup} loading={isLoading} buttonStyle={styles.backupButton} containerStyle={styles.button} />
    <Button title="Limpar Cache" onPress={onClearCache} buttonStyle={styles.cacheButton} containerStyle={styles.button} />

    <SectionTitle>Ações Perigosas</SectionTitle>
    <Button title="Apagar Todos os Dados" onPress={onClearAll} buttonStyle={styles.dangerButton} containerStyle={styles.button} />
  </>
);

export default DataManagementSection;