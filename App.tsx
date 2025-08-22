/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `App.tsx` (ou `App.js`)
 * * Descrição: Este arquivo é o ponto de entrada principal (root) da aplicação React Native.
 * Sua responsabilidade é configurar o ambiente global, envolvendo toda a aplicação com os
 * "Provedores" (Providers) necessários, como o tema visual e o contexto de autenticação.
 * A estrutura de aninhamento dos providers é crucial para o funcionamento correto do app.
 *
 * * Estrutura:
 * 1.  **ThemeProvider:** Fornece o tema (cores, fontes) para todos os componentes estilizados.
 * 2.  **AuthProvider:** Gerencia o estado de autenticação (usuário logado, etc.) e o disponibiliza
 * para as telas.
 * 3.  **AppNavigator:** Renderiza a tela apropriada com base no estado de autenticação.
 */

// ========================================================================
// 1. IMPORTAÇÕES DE DEPENDÊNCIAS E COMPONENTES GLOBAIS
// ========================================================================

// Importa o React, a biblioteca fundamental para criar componentes.
import React from 'react';

// Importa o Provedor do Contexto de Autenticação. Este componente envolve a aplicação e
// disponibiliza o estado do usuário (logado ou não) e as funções de login/logout para todos os
// componentes filhos através do hook `useAuth`.
import { AuthProvider } from './src/contexts/AuthContext';

// Importa o componente de Navegação Principal. Ele é responsável por gerenciar a pilha
// de telas e decidir qual tela exibir com base no estado de autenticação e na interação do usuário.
import { AppNavigator } from './src/navigation/AppNavigator';

// Importa o Provedor de Tema da biblioteca `styled-components`, que permite o uso de um
// objeto de tema centralizado em toda a aplicação.
import { ThemeProvider } from 'styled-components/native';

// Importa o arquivo de tema que contém as definições de cores, tipografia e espaçamentos.
import theme from './src/styles/theme';

// Importa o componente `StatusBar` do React Native, que permite controlar a aparência da
// barra de status do dispositivo (onde ficam o relógio, bateria, sinal, etc.).
import { StatusBar } from 'react-native';

// ========================================================================
// 2. DEFINIÇÃO DO COMPONENTE RAIZ DA APLICAÇÃO
// ========================================================================

/**
 * O componente `App` é o componente raiz que é renderizado quando o aplicativo é iniciado.
 */
export default function App() {
  // O retorno do componente define a estrutura global da aplicação.
  return (
    // O ThemeProvider é o componente de mais alto nível. Ele injeta o objeto 'theme'
    // no contexto, tornando-o acessível a todos os `styled-components` na aplicação.
    <ThemeProvider theme={theme}>
      {/* O AuthProvider envolve o resto da aplicação para prover o contexto de autenticação.
          Qualquer tela ou componente dentro dele pode usar o hook `useAuth` para acessar
          os dados e funções relacionadas ao usuário. */}
      <AuthProvider>
        {/* O StatusBar configura a aparência da barra de status do dispositivo.
            Esta configuração é aplicada globalmente. */}
        <StatusBar 
          // `barStyle="light-content"` define a cor dos ícones da barra (relógio, bateria) como clara (branca).
          barStyle="light-content" 
          // `backgroundColor` define a cor de fundo da barra de status, usando a cor primária do tema.
          backgroundColor={theme.colors.primary} 
        />
        
        {/* O componente AppNavigator é o coração da interface. Ele lê o estado do
            AuthProvider e decide qual tela renderizar: as telas de login/cadastro se não
            houver usuário, ou as telas internas (dashboards, perfil) se o usuário estiver autenticado. */}
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}