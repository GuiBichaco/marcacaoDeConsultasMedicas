/**
 * @file Define os modelos de dados para a tela de Configurações.
 */

/**
 * Interface para o objeto de configurações do aplicativo.
 */
export interface AppSettings {
  notifications: boolean;
  autoBackup: boolean;
  theme: 'light' | 'dark';
  language: string;
}