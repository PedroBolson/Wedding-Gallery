# Álbum de Casamento Marina & Pedro 💒

Um aplicativo web moderno e elegante para compartilhar fotos de casamento em tempo real. Construído com React, TypeScript, Firebase e Tailwind CSS v4.

## ✨ Características

- 📸 **Upload de fotos em tempo real** - Compartilhe momentos instantaneamente
- 💝 **Sistema de curtidas** - Mostre amor pelas fotos favoritas
- 📥 **Download de fotos** - Salve memórias em alta qualidade
- 👥 **Identificação de usuários** - Cada foto mostra quem enviou
- 🎨 **Design elegante** - Tema coral e pêssego com animações suaves
- 📱 **PWA habilitado** - Instale como app no seu dispositivo
- 🔄 **Atualizações em tempo real** - Veja novas fotos instantaneamente
- 💫 **Animações elegantes** - Framer Motion para transições suaves
- 🎭 **Elementos flutuantes** - Corações e brilhos celebratórios

## 🚀 Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS v4** - Estilização moderna
- **Firebase** - Backend (Firestore + Storage)
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado
- **Lucide Icons** - Ícones elegantes
- **date-fns** - Manipulação de datas

## � Documentação

- 🚀 **[QUICKSTART.md](./QUICKSTART.md)** - Começar em 5 minutos
- 🔧 **[DEPLOY.md](./DEPLOY.md)** - Guia completo de deploy
- 📖 **[MANUAL.md](./MANUAL.md)** - Manual do usuário
- ✅ **[CHECKLIST.md](./CHECKLIST.md)** - Checklist pré-lançamento  
- 📊 **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Resumo técnico completo
- 👋 **[WELCOME.md](./WELCOME.md)** - Bem-vindo ao projeto

## �📦 Instalação

```bash
# Clone o repositório
git clone <repo-url>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Firebase

# Inicie o servidor de desenvolvimento
npm run dev
```

**👉 Para início rápido, leia [QUICKSTART.md](./QUICKSTART.md)**

## 🔧 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Ative o Storage
4. Configure as regras de segurança conforme os arquivos `firestore.rules` e `storage.rules`
5. Copie as credenciais para o arquivo `.env`

## 🎨 Paleta de Cores

O aplicativo usa um esquema de cores elegante inspirado em casamentos:

- **Coral**: `#ff8f77` - Cor primária
- **Pêssego**: `#fdbf87` - Cor secundária
- **Rosa**: `#f48ca3` - Cor de destaque
- **Creme**: `#fefdfb` - Background
- **Sage**: `#647264` - Texto secundário

## 📱 PWA

O aplicativo é um Progressive Web App e pode ser instalado em dispositivos móveis para uma experiência nativa.

## 📝 Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview da build
npm run lint         # Linting
```

## 🔐 Segurança

- Upload limitado a 50MB por foto
- Apenas imagens são aceitas
- Validação de tipos de arquivo
- Regras de segurança do Firebase configuradas

---

Feito com 💕 para Marina & Pedro - 07 de Fevereiro de 2026
