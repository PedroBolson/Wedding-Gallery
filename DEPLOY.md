# 🚀 Guia de Deploy - Álbum Marina & Pedro

## 📋 Pré-requisitos

1. Node.js 18+ instalado
2. Conta no Firebase
3. Firebase CLI instalado: `npm install -g firebase-tools`

## 🔥 Configuração do Firebase

### 1. Criar Projeto

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome: "wedding-gallery-marina-pedro"
4. Desabilite Google Analytics (opcional)

### 2. Ativar Serviços

#### Firestore Database
1. No menu lateral, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Produção" e selecione a localização mais próxima (southamerica-east1)
4. As regras serão atualizadas depois

#### Storage
1. No menu lateral, vá em "Storage"
2. Clique em "Começar"
3. Aceite as regras padrão (serão atualizadas)

### 3. Configurar Credenciais

1. No menu lateral, vá em "Configurações do projeto" (ícone de engrenagem)
2. Role até "Seus apps"
3. Clique no ícone `</>` (Web)
4. Registre o app com nome "Wedding Gallery"
5. Copie as credenciais do Firebase
6. Crie um arquivo `.env` na raiz do projeto:

\`\`\`env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
\`\`\`

### 4. Fazer Login no Firebase CLI

\`\`\`bash
firebase login
\`\`\`

### 5. Inicializar Projeto Firebase

\`\`\`bash
firebase init
\`\`\`

- Selecione: Firestore, Functions, Hosting, Storage
- Use projeto existente
- Selecione o projeto criado
- Aceite os padrões ou use as configurações abaixo:

**Firestore:**
- Rules: `firestore.rules` (já existe)
- Indexes: `firestore.indexes.json` (já existe)

**Functions:**
- Language: TypeScript
- ESLint: Yes
- Install dependencies: Yes

**Hosting:**
- Public directory: `dist`
- Single-page app: Yes
- Automatic builds: No

**Storage:**
- Rules: `storage.rules` (já existe)

### 6. Atualizar Regras

As regras já estão configuradas nos arquivos:
- `firestore.rules`
- `storage.rules`

Deploy das regras:

\`\`\`bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
\`\`\`

## 🏗️ Build e Deploy

### 1. Instalar Dependências

\`\`\`bash
npm install
\`\`\`

### 2. Build do Projeto

\`\`\`bash
npm run build
\`\`\`

### 3. Preview Local (opcional)

\`\`\`bash
npm run preview
\`\`\`

ou

\`\`\`bash
firebase serve
\`\`\`

### 4. Deploy para Firebase Hosting

\`\`\`bash
firebase deploy --only hosting
\`\`\`

## 🌐 URL do Projeto

Após o deploy, seu projeto estará disponível em:
- `https://seu-projeto.web.app`
- `https://seu-projeto.firebaseapp.com`

## 📱 Configuração de Domínio Customizado (Opcional)

1. No Firebase Console, vá em Hosting
2. Clique em "Adicionar domínio personalizado"
3. Siga as instruções para configurar DNS

## 🔒 Configurações de Segurança Recomendadas

### Limites de Upload

No arquivo `storage.rules`, já está configurado:
- Máximo 50MB por arquivo
- Apenas imagens permitidas

### Monitoramento

1. No Firebase Console, ative "Performance Monitoring"
2. Ative "Crashlytics" para rastreamento de erros
3. Configure alertas de uso no "Usage and billing"

## 🔧 Manutenção

### Atualizar Dependências

\`\`\`bash
npm update
\`\`\`

### Redeployar

\`\`\`bash
npm run build && firebase deploy
\`\`\`

### Ver Logs

\`\`\`bash
firebase functions:log
\`\`\`

## 📊 Monitoramento de Custos

- Firestore: Monitore número de leituras/escritas
- Storage: Monitore tamanho dos arquivos armazenados
- Hosting: Monitore bandwidth

**Dica:** Configure alertas de orçamento no Firebase Console!

## 🎯 Pós-Deploy Checklist

- [ ] Site acessível via URL
- [ ] PWA funcionando (testar "Add to Home Screen")
- [ ] Upload de fotos funcionando
- [ ] Download de fotos funcionando
- [ ] Sistema de curtidas funcionando
- [ ] Responsivo em mobile
- [ ] Performance adequada (teste no Lighthouse)

## 🆘 Troubleshooting

### Erro de CORS
- Verifique as regras do Storage
- Configure CORS no bucket do Storage

### Erro de Permissão
- Verifique as regras do Firestore
- Confirme que as regras foram deployadas

### PWA não instala
- Verifique se está usando HTTPS
- Confirme que o manifest.json está correto
- Teste em modo anônimo

## 📞 Suporte

Para problemas, consulte:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

Bom casamento! 💒💕
