/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `theme.ts`
 * * Descrição: Este arquivo define o objeto de tema global para a aplicação. Ele centraliza
 * todas as constantes de design, como cores, estilos de tipografia e unidades de espaçamento.
 * Utilizar um arquivo de tema como este é uma prática fundamental de "Design System".
 *
 * * Vantagens:
 * 1.  **Consistência:** Garante que todos os componentes da aplicação usem as mesmas cores, fontes
 * e espaçamentos, criando uma interface de usuário coesa e profissional.
 * 2.  **Manutenibilidade:** Para alterar uma cor em todo o aplicativo (ex: mudar o tom de azul
 * da marca), basta modificar um único valor neste arquivo.
 * 3.  **Legibilidade:** O código se torna mais semântico. Em vez de usar um valor mágico como
 * `#4A90E2`, um desenvolvedor usa `theme.colors.primary`, que é muito mais claro.
 * 4.  **Escalabilidade:** Facilita a criação de novos componentes que seguem o mesmo guia de estilo.
 */

// Exporta o objeto de tema como o padrão do módulo.
export default {
  // ========================================================================
  // 1. CORES
  // ========================================================================
  // Define a paleta de cores da aplicação. Cada cor tem um propósito semântico.
  colors: {
    // Cor principal, usada para botões primários, links e elementos de destaque.
    primary: '#4A90E2',
    // Cor secundária, usada para botões secundários, textos de apoio e elementos menos importantes.
    secondary: '#6C757D',
    // Cor de fundo padrão para a maioria das telas e componentes.
    background: '#F8F9FA',
    // Cor padrão para textos principais.
    text: '#212529',
    // Cor usada para indicar erros, alertas de perigo e ações destrutivas.
    error: '#DC3545',
    // Cor usada para indicar sucesso, confirmação e estados positivos.
    success: '#28A745',
    // Cor usada para avisos e alertas que não são críticos.
    warning: '#FFC107',
    // Cor branca, geralmente usada para textos sobre fundos coloridos ou para fundos de cards.
    white: '#FFFFFF',
    // Cor para bordas de inputs, divisores e outros elementos de contorno.
    border: '#DEE2E6',
  },

  // ========================================================================
  // 2. TIPOGRAFIA
  // ========================================================================
  // Define os estilos de texto padronizados para garantir consistência tipográfica.
  typography: {
    // Estilo para títulos principais de telas.
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    // Estilo para subtítulos ou títulos de seções.
    subtitle: {
      fontSize: 18,
      fontWeight: '600', // Semi-bold
    },
    // Estilo para o corpo de texto principal, parágrafos, etc.
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    // Estilo para textos menores, como legendas ou notas de rodapé.
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },

  // ========================================================================
  // 3. ESPAÇAMENTO
  // ========================================================================
  // Define uma escala de espaçamento consistente para ser usada em margens, paddings e gaps.
  // Usar uma escala (geralmente baseada em um múltiplo, como 8) cria um ritmo visual harmonioso.
  spacing: {
    // Espaçamento pequeno, para elementos muito próximos.
    small: 8,
    // Espaçamento padrão, mais comum para paddings de botões e margens de itens.
    medium: 16,
    // Espaçamento grande, para separar seções distintas.
    large: 24,
    // Espaçamento extra grande, para margens de containers principais.
    xlarge: 32,
  },
};