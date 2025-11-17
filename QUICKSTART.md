# 🚀 Quick Start - 5 Minutos para Rodar

## 1️⃣ Instalar Dependências (1 min)

```bash
npm install
```

## 2️⃣ Configurar Firebase (2 min)

1. Crie um projeto em https://console.firebase.google.com/
2. Ative **Firestore Database** e **Storage**
3. Copie as credenciais e crie o arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

## 3️⃣ Rodar Desenvolvimento (1 min)

```bash
npm run dev
```

Abra http://localhost:5173

## 4️⃣ Testar Funcionalidades (1 min)

1. ✅ Digite seu nome para entrar
2. ✅ Clique em "Enviar Fotos"
3. ✅ Arraste uma imagem
4. ✅ Veja a foto aparecer na galeria
5. ✅ Curta a foto
6. ✅ Baixe a foto

## ✅ Pronto!

Seu app está funcionando! 🎉

---

## 📦 Deploy Rápido (Opcional)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
npm run build
firebase deploy
```

---

## 🆘 Problemas Comuns

### Erro: "Firebase is not configured"
→ Verifique se criou o arquivo `.env` com as credenciais

### Erro: "Permission denied"
→ No Firebase Console, vá em Firestore/Storage > Rules e use as regras dos arquivos `firestore.rules` e `storage.rules`

### Fotos não aparecem
→ Verifique se ativou o Storage no Firebase Console

---

## 📚 Próximos Passos

1. Leia `DEPLOY.md` para deploy em produção
2. Leia `MANUAL.md` para entender todas as funcionalidades
3. Siga `CHECKLIST.md` antes do evento

---

**Tempo total: ~5 minutos** ⏱️

Happy coding! 💻✨
