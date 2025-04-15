# Marcação de Consultas Médicas

## Visão Geral
Este projeto é um aplicativo móvel desenvolvido em **React Native** utilizando o **Expo**, focado na marcação de consultas médicas. Ele permite que usuários realizem login (ATUALIZAÇÃO FUTURA), agendem consultas com especialistas e visualizem seus agendamentos salvos.

## 1. Configuração do Ambiente
Antes de iniciar o desenvolvimento, certifique-se de que os seguintes requisitos estejam atendidos:

### Requisitos:
- Node.js instalado (Recomendado: v18+)
- Expo CLI instalado globalmente:
  ```sh
  npm install -g expo-cli
  ```
- Git instalado e configurado

### Clonando o Repositório
#### Opção 1: Clonar um repositório existente
```sh
git clone https://github.com/SEU_USUARIO/meuPrimeiroAppRN.git marcacaoDeConsultasMedicas
cd marcacaoDeConsultasMedicas
```

#### Opção 2: Criar um novo projeto Expo
```sh
expo init marcacaoDeConsultasMedicas
# Selecione: "blank (TypeScript)"
cd marcacaoDeConsultasMedicas
```

## 2. Configuração do GitHub
Caso precise remover vínculos antigos do repositório:
```sh
git remote remove origin
git remote -v
```

Para criar um novo repositório e vinculá-lo ao GitHub:
```sh
git init
git branch -M main
git remote add origin https://github.com/seu-usuario/marcacaoDeConsultasMedicas.git
git add .
git commit -m "Primeiro commit - Configuração inicial do projeto"
git push -u origin main
```

## 3. Instalação das Dependências
Este projeto utiliza diversas bibliotecas para estilização, navegação e armazenamento local:
```sh
npm install styled-components @types/styled-components @types/styled-components-react-native
npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install @expo/vector-icons react-native-elements --save-dev @types/react-native-elements
npm install @react-navigation/native-stack
npm install @react-native-async-storage/async-storage @react-native-community/datetimepicker
```
## 3.1 Instalação das Dependências
Para verificar se o dispositivo está conectado à internet antes de tentar sincronizar dados com um backend (caso necessário no futuro), usaremos:
```sh
npm install @react-native-community/netinfo
```
Caso ainda não esteja instalado, rode o seguinte comando:
```sh
npm install @react-native-async-storage/async-storage
```
Com essa biblioteca, podemos salvar informações do usuário, como dados de login, perfil e consultas agendadas, diretamente no dispositivo.

## 4. Estrutura de Pastas
```sh
📂 marcacaoDeConsultasMedicas
├── 📂 assets/ *(Imagens, ícones e outros recursos estáticos)*
├── 📂 node_modules/ *(Dependências instaladas via npm/yarn)*
├── 📂 src/  
│   ├── 📂 components/ *(Componentes reutilizáveis do app)*
│   ├── 📂 screens/ *(Telas principais do aplicativo)*
│   ├── 📂 styles/ *(Estilização global e tema do app)*
│   ├── 📂 services/ *(Integração com APIs e banco de dados)*
│   ├── 📂 routes/ *(Configuração de navegação do app)*
├── 📄 App.tsx *(Arquivo principal do aplicativo)*
├── 📄 package.json *(Configuração das dependências do projeto)*
└── 📄 babel.config.js *(Configuração do Babel para o Expo)*
```

## 5. Configuração do Tema Global
Criamos um arquivo `src/styles/theme.ts` para centralizar cores, tipografia e espaçamento:
```ts
export default {
  colors: {
    primary: '#2A86FF',
    secondary: '#00C48C',
    background: '#F5F5F5',
    text: '#333333',
    error: '#FF647C',
    success: '#00C48C',
    white: '#FFFFFF',
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '500',
    },
    body: {
      fontSize: 16,
    },
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};
```

## 6. Telas do Aplicativo

### Tela de Login (ATUALIZAÇÃO FUTURA)
A tela de login permite que os usuários se autentiquem no app.

**Componentes Principais:**
- Campo de e-mail
- Campo de senha (com ocultamento de caracteres)
- Botão de login (redireciona para a HomeScreen)
- Botão de cadastro (redireciona para tela de criação de conta)

### Formulário de Agendamento (AppointmentForm)
Os usuários podem:
- Selecionar um médico da lista de especialistas
- Escolher a data da consulta usando o **DateTimePicker**
- Definir o horário da consulta
- Adicionar uma descrição da consulta

### Tela de Criação de Agendamentos
Esta tela foi atualizada para usar o **AppointmentForm**, garantindo um código mais organizado e reutilizável.

### HomeScreen
A tela inicial do app exibe os agendamentos salvos no armazenamento local usando `AsyncStorage`.

## 7. Executando o Projeto
Para rodar o app no Expo:
```sh
npx expo start
```
Isso abrirá o **Expo Developer Tools** no navegador, onde você pode escolher rodar o app em um emulador ou dispositivo físico.

Para rodar no navegador, aperte no W no terminal do VsCode, se ele não abrir basta instalar a lib abaixo e execute novamente:

**expo install react-native-web@~0.18.10 react-dom@18 @expo/webpack-config@^18.0.1**

Caso esteja testando no celular, instale o app **Expo Go** (disponível na App Store e Google Play) e escaneie o QR Code exibido no navegador.

## 8. Conclusão
Este documento apresenta um guia completo para configuração, desenvolvimento e execução do app **Marcação de Consultas Médicas**. Se precisar de mais detalhes, confira os arquivos no repositório ou entre em contato com a equipe de desenvolvimento!

