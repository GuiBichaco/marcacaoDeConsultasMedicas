/**
 * DOCUMENTAÇÃO DO CÓDIGO
 * =======================
 *
 * * Arquivo: `index.ts` (dentro de uma pasta `types`)
 * * Descrição: Este arquivo funciona como um "barril" (barrel file) ou um ponto de entrada central
 * para os tipos da aplicação. O seu principal objetivo é agrupar e re-exportar tipos de
 * diferentes arquivos, simplificando as importações em outras partes do código.
 *
 * * Vantagens:
 * 1.  **Importações Simplificadas:** Em vez de um componente importar tipos de múltiplos caminhos
 * (ex: `../types/doctors`, `../types/navigation`), ele pode importar tudo o que precisa
 * de um único local (ex: `../types`).
 * 2.  **Melhor Organização:** Ajuda a desacoplar os componentes da estrutura interna da pasta `types`.
 * Se os arquivos de tipos forem reorganizados, apenas este `index.ts` precisa ser atualizado.
 * 3.  **Manutenibilidade:** Mantém a gestão de tipos centralizada e mais fácil de navegar.
 */

// ========================================================================
// 1. IMPORTAÇÕES E RE-EXPORTAÇÕES DE TIPOS
// ========================================================================

// Importa o tipo `Doctor` do arquivo `doctors.ts`. Este tipo fica disponível no escopo deste arquivo.
import { Doctor } from './doctors';

// Importa a interface `RootStackParamList` do arquivo `navigation.ts`, que define as rotas e seus parâmetros.
import { RootStackParamList } from './navigation';

// Re-exporta o tipo `Appointment` do arquivo `appointments.ts`.
// Isso significa que qualquer arquivo que importar de `types/index.ts` poderá acessar o tipo `Appointment`
// diretamente, sem precisar saber que ele originalmente vem de `appointments.ts`.
export { Appointment } from './appointments';