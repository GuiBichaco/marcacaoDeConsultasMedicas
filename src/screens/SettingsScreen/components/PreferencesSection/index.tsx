import React from 'react';
import { ListItem, Switch } from 'react-native-elements';
import { AppSettings } from '../../models/types';
import { SectionTitle, SettingsCard } from '../../styles';

interface Props {
  settings: AppSettings;
  onUpdate: (key: keyof AppSettings, value: any) => void;
}

const PreferencesSection: React.FC<Props> = ({ settings, onUpdate }) => (
  <>
    <SectionTitle>Preferências</SectionTitle>
    <SettingsCard>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Notificações</ListItem.Title>
        </ListItem.Content>
        <Switch value={settings.notifications} onValueChange={(v) => onUpdate('notifications', v)} />
      </ListItem>
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>Backup Automático</ListItem.Title>
        </ListItem.Content>
        <Switch value={settings.autoBackup} onValueChange={(v) => onUpdate('autoBackup', v)} />
      </ListItem>
    </SettingsCard>
  </>
);

export default PreferencesSection;