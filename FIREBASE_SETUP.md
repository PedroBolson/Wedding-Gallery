# 🔥 Configuração do Firebase - Passo a Passo

## 📋 Pré-requisitos
- Conta Google
- 5 minutos

## 🎯 Passo 1: Criar Projeto Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Nome do projeto: `wedding-gallery-marina-pedro` (ou qualquer nome)
4. **Desabilite** Google Analytics (opcional para este projeto)
5. Clique em **"Criar projeto"**
6. Aguarde a criação (~30 segundos)

## 🗄️ Passo 2: Ativar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"** ou **"Create database"**
3. Modo: Selecione **"Produção"** (production mode)
4. Localização: Selecione **"southamerica-east1 (São Paulo)"** (mais próximo do Brasil)
5. Clique em **"Ativar"**
6. Aguarde a criação (~1 minuto)

### Configurar Regras do Firestore

1. Vá em **"Rules"** (aba no topo)
2. Cole o conteúdo do arquivo `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
    
    match /photos/{photoId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if true;
    }
  }
}
```

3. Clique em **"Publicar"**

## 📦 Passo 3: Ativar Storage

1. No menu lateral, clique em **"Storage"**
2. Clique em **"Começar"** ou **"Get started"**
3. Modo: Selecione **"Produção"** (production mode)
4. Localização: Use a mesma do Firestore (**southamerica-east1**)
5. Clique em **"Concluído"**

### Configurar Regras do Storage

1. Vá em **"Rules"** (aba no topo)
2. Cole o conteúdo do arquivo `storage.rules`:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /wedding-photos/{photoId} {
      allow read: if true;
      allow write: if request.resource.size < 50 * 1024 * 1024
                  && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Clique em **"Publicar"**

## 🔑 Passo 4: Obter Credenciais

1. Clique no ícone de **engrenagem** ⚙️ (Settings) no menu lateral
2. Selecione **"Configurações do projeto"** ou **"Project settings"**
3. Role até **"Seus apps"** ou **"Your apps"**
4. Clique no ícone **`</>`** (Web)
5. Registre o app:
   - Apelido: `Wedding Gallery Web`
   - **NÃO** marque Firebase Hosting (faremos depois)
6. Clique em **"Registrar app"**
7. Você verá algo assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

8. **COPIE** essas credenciais!

## 📝 Passo 5: Configurar Arquivo .env

1. Na raiz do projeto, crie o arquivo `.env`:

```bash
# No terminal, execute:
cp .env.example .env
```

2. Abra o arquivo `.env` e cole suas credenciais:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Salve o arquivo

## ✅ Passo 6: Testar Configuração

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Abra http://localhost:5173
```

1. Digite seu nome e entre
2. Tente enviar uma foto
3. Se funcionar, está tudo certo! 🎉

## 🔒 Passo 7: Segurança

### ⚠️ IMPORTANTE

1. **NUNCA** commite o arquivo `.env` no Git
2. O arquivo já está no `.gitignore`
3. Verifique:

```bash
cat .gitignore | grep .env
# Deve aparecer: .env
```

4. Para compartilhar com outros desenvolvedores, use apenas o `.env.example`

## 📊 Passo 8: Monitoramento (Opcional)

### Configurar Alertas de Custo

1. No Firebase Console, vá em **"Usage and billing"**
2. Configure um orçamento mensal (ex: $5-10 USD)
3. Ative alertas quando atingir 50%, 75%, 90% do orçamento

### Ativar Analytics (Opcional)

1. No Firebase Console, vá em **"Analytics"**
2. Clique em **"Enable Google Analytics"**
3. Siga as instruções

## 🎯 Limites do Plano Gratuito (Spark)

### Firestore
- ✅ 1GB de armazenamento
- ✅ 50k leituras/dia
- ✅ 20k escritas/dia
- ✅ 20k exclusões/dia

### Storage
- ✅ 5GB de armazenamento
- ✅ 1GB de download/dia
- ✅ 20k uploads/dia

### Para um casamento com ~100 convidados:
- ✅ **Suficiente!** Mesmo se todos enviarem 5-10 fotos cada

## 🚨 Se Exceder os Limites

O Firebase automaticamente:
1. Interrompe as operações
2. Envia um email de alerta
3. Pede para fazer upgrade

**Solução:** Upgrade para o plano Blaze (pay-as-you-go)
- Só paga pelo que usar além dos limites gratuitos
- Configure um budget limit para controlar custos

## 🎉 Pronto!

Sua configuração do Firebase está completa! Agora você pode:

1. ✅ Desenvolver localmente
2. ✅ Testar todas as funcionalidades
3. ✅ Fazer deploy (ver DEPLOY.md)

## 🆘 Problemas Comuns

### "Firebase: Error (auth/api-key-not-valid)"
→ Verifique se copiou a API Key corretamente no `.env`

### "Missing or insufficient permissions"
→ Verifique as regras do Firestore e Storage

### "Storage bucket not found"
→ Confirme que ativou o Storage no Firebase Console

### "CORS error"
→ As regras do Storage devem permitir acesso público (read: true)

## 📞 Suporte

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Status: https://status.firebase.google.com
- Firebase Support: https://firebase.google.com/support

---

**Tempo estimado:** 5-10 minutos ⏱️

**Dificuldade:** Fácil 🟢

**Próximo passo:** Leia [QUICKSTART.md](./QUICKSTART.md) para rodar o projeto!
