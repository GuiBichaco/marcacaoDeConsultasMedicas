/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `storageService.ts`
 * * Descrição: Este arquivo define o `storageService`, um serviço de baixo nível que atua como uma
 * camada de abstração (wrapper) avançada sobre o `AsyncStorage` do React Native. Ele centraliza
 * todas as interações com o armazenamento local do dispositivo.
 *
 * * Funcionalidades Principais e Padrões de Arquitetura:
 * 1.  **Abstração de Armazenamento:** Isola o resto do aplicativo dos detalhes de implementação do
 * `AsyncStorage`. Se a tecnologia de armazenamento mudasse (ex: para um banco de dados local
 * como SQLite), apenas este arquivo precisaria ser modificado.
 * 2.  **Cache em Memória:** Implementa um cache em memória (`Map`) para otimizar a performance.
 * Dados frequentemente acessados são lidos da memória, que é muito mais rápido do que
 * acessar o disco do dispositivo (onde o AsyncStorage opera).
 * 3.  **Expiração de Cache:** O cache suporta um tempo de expiração opcional, garantindo que
 * dados sensíveis ao tempo possam ser invalidados e recarregados do armazenamento principal.
 * 4.  **API Semântica:** Fornece métodos genéricos (`getItem`, `setItem`) e também métodos
 * de alto nível específicos para cada tipo de dado (ex: `getAppointments`, `addUser`),
 * tornando o código que consome este serviço mais legível e seguro.
 * 5.  **Gerenciamento de Dados:** Inclui funcionalidades completas para backup, restauração e
 * limpeza de dados, além de validação e obtenção de metadados sobre o armazenamento.
 */

// ========================================================================
// 1. IMPORTAÇÕES, TIPOS E CONFIGURAÇÕES INICIAIS
// ========================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces para os tipos de dados.
export interface StorageData { [key: string]: any; }
interface CacheItem<T> {
  data: T;
  timestamp: number; // Data de quando o item foi cacheado.
  expiry?: number; // Data de expiração opcional do cache.
}

// Cache em memória (usando um Map) para armazenar dados frequentemente acessados e melhorar a performance.
const cache = new Map<string, CacheItem<any>>();

// Objeto que centraliza todas as chaves de armazenamento para evitar erros e facilitar a manutenção.
export const STORAGE_KEYS = {
  USER: '@MedicalApp:user',
  TOKEN: '@MedicalApp:token',
  APPOINTMENTS: '@MedicalApp:appointments',
  NOTIFICATIONS: '@MedicalApp:notifications',
  REGISTERED_USERS: '@MedicalApp:registeredUsers',
  APP_SETTINGS: '@MedicalApp:settings',
  STATISTICS_CACHE: '@MedicalApp:statisticsCache',
} as const;

// ========================================================================
// 2. DEFINIÇÃO DO SERVIÇO DE ARMAZENAMENTO
// ========================================================================
export const storageService = {
  // --- Operações Básicas com Cache ---

  /**
   * Salva um item no AsyncStorage e atualiza o cache em memória.
   * @param key A chave de armazenamento.
   * @param value O valor a ser salvo (será convertido para JSON).
   * @param expiryMinutes Tempo opcional em minutos para a expiração do cache.
   */
  async setItem<T>(key: string, value: T, expiryMinutes?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
      
      const cacheItem: CacheItem<T> = {
        data: value,
        timestamp: Date.now(),
        expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined,
      };
      cache.set(key, cacheItem); // Atualiza o cache.
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      throw error;
    }
  },

  /**
   * Obtém um item, priorizando o cache em memória. Se não estiver no cache ou tiver expirado,
   * busca no AsyncStorage e atualiza o cache.
   * @param key A chave do item a ser buscado.
   * @param defaultValue Valor opcional a ser retornado se a chave não for encontrada.
   * @returns O valor encontrado ou o valor padrão (ou nulo).
   */
  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      // 1. Verifica o cache primeiro.
      const cached = cache.get(key);
      if (cached && (!cached.expiry || cached.expiry > Date.now())) {
        return cached.data as T; // Retorna do cache se for válido.
      } else if (cached) {
        cache.delete(key); // Remove do cache se expirou.
      }

      // 2. Se não estiver no cache, busca no AsyncStorage.
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        // Adiciona o item lido ao cache para futuras leituras rápidas.
        cache.set(key, { data: parsed, timestamp: Date.now() });
        return parsed;
      }
      
      return defaultValue || null; // Retorna o valor padrão se não encontrar em lugar nenhum.
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
      return defaultValue || null;
    }
  },

  /**
   * Remove um item do AsyncStorage e do cache em memória.
   * @param key A chave do item a ser removido.
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      cache.delete(key);
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      throw error;
    }
  },

  /**
   * Limpa completamente o AsyncStorage e o cache em memória. (Ação destrutiva).
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
      cache.clear();
    } catch (error) {
      console.error('Erro ao limpar armazenamento:', error);
      throw error;
    }
  },

  // --- Operações de Alto Nível (Wrappers Semânticos) ---
  // Estas funções usam os métodos básicos acima para fornecer uma API mais clara e específica para cada tipo de dado.

  // --- Consultas ---
  async getAppointments(): Promise<any[]> { return await this.getItem(STORAGE_KEYS.APPOINTMENTS, []); },
  async saveAppointments(appointments: any[]): Promise<void> { await this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments); },
  async addAppointment(appointment: any): Promise<void> {
    const appointments = await this.getAppointments();
    await this.saveAppointments([...appointments, appointment]);
  },
  async updateAppointment(appointmentId: string, updates: Partial<any>): Promise<void> {
    const appointments = await this.getAppointments();
    const updated = appointments.map(apt => apt.id === appointmentId ? { ...apt, ...updates } : apt);
    await this.saveAppointments(updated);
  },
  async deleteAppointment(appointmentId: string): Promise<void> {
    const appointments = await this.getAppointments();
    const filtered = appointments.filter(apt => apt.id !== appointmentId);
    await this.saveAppointments(filtered);
  },

  // --- Usuários ---
  async getRegisteredUsers(): Promise<any[]> { return await this.getItem(STORAGE_KEYS.REGISTERED_USERS, []); },
  async saveRegisteredUsers(users: any[]): Promise<void> { await this.setItem(STORAGE_KEYS.REGISTERED_USERS, users); },
  async addUser(user: any): Promise<void> {
    const users = await this.getRegisteredUsers();
    await this.saveRegisteredUsers([...users, user]);
  },

  // --- Notificações ---
  async getNotifications(): Promise<any[]> { return await this.getItem(STORAGE_KEYS.NOTIFICATIONS, []); },
  async saveNotifications(notifications: any[]): Promise<void> { await this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications); },
  async addNotification(notification: any): Promise<void> {
    const notifications = await this.getNotifications();
    await this.saveNotifications([...notifications, notification]);
  },

  // --- Backup e Restauração ---

  /**
   * Cria uma string JSON contendo os principais dados da aplicação para backup.
   * @returns Uma string JSON representando o backup.
   */
  async createBackup(): Promise<string> {
    try {
      const backupData = {
        appointments: await this.getItem(STORAGE_KEYS.APPOINTMENTS, []),
        notifications: await this.getItem(STORAGE_KEYS.NOTIFICATIONS, []),
        registeredUsers: await this.getItem(STORAGE_KEYS.REGISTERED_USERS, []),
        settings: await this.getItem(STORAGE_KEYS.APP_SETTINGS, {}),
      };
      return JSON.stringify({ timestamp: new Date().toISOString(), data: backupData });
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw error;
    }
  },

  /**
   * Restaura os dados da aplicação a partir de uma string de backup.
   * @param backupString A string JSON do backup.
   */
  async restoreFromBackup(backupString: string): Promise<void> {
    try {
      const backup = JSON.parse(backupString);
      if (backup.data) {
        await this.setItem(STORAGE_KEYS.APPOINTMENTS, backup.data.appointments || []);
        await this.setItem(STORAGE_KEYS.NOTIFICATIONS, backup.data.notifications || []);
        await this.setItem(STORAGE_KEYS.REGISTERED_USERS, backup.data.registeredUsers || []);
        await this.setItem(STORAGE_KEYS.APP_SETTINGS, backup.data.settings || {});
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw error;
    }
  },

  // --- Funções Utilitárias ---

  // Validação simples do formato de um objeto de consulta.
  validateAppointment(appointment: any): boolean { /* ... */ },
  // Validação simples do formato de um objeto de usuário.
  validateUser(user: any): boolean { /* ... */ },

  // Limpa apenas o cache em memória, sem afetar o AsyncStorage.
  clearCache(): void { cache.clear(); },

  /**
   * Obtém metadados sobre o estado atual do armazenamento e do cache.
   * @returns Um objeto com o tamanho do cache, total de chaves no AsyncStorage, etc.
   */
  async getStorageInfo(): Promise<{ cacheSize: number; totalKeys: number; lastAccess: { [key: string]: number }; }> {
    const allKeys = await AsyncStorage.getAllKeys();
    const lastAccess: { [key: string]: number } = {};
    cache.forEach((value, key) => { lastAccess[key] = value.timestamp; });
    return { cacheSize: cache.size, totalKeys: allKeys.length, lastAccess };
  },

  // --- Configurações da Aplicação ---

  /**
   * Obtém as configurações do aplicativo, retornando valores padrão se não existirem.
   */
  async getAppSettings(): Promise<any> {
    const defaultSettings = { theme: 'light', notifications: true, language: 'pt-BR', autoBackup: true };
    return await this.getItem(STORAGE_KEYS.APP_SETTINGS, defaultSettings);
  },

  /**
   * Atualiza uma ou mais configurações do aplicativo.
   * @param settings Um objeto com as chaves e valores a serem atualizados.
   */
  async updateAppSettings(settings: Partial<any>): Promise<void> {
    const currentSettings = await this.getAppSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await this.setItem(STORAGE_KEYS.APP_SETTINGS, updatedSettings);
  },
};