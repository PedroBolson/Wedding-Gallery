# 🎊 Bem-vindo ao Álbum de Casamento Marina & Pedro! 

## 🎯 O que é este projeto?

Um **álbum de fotos digital em tempo real** para o casamento de Marina e Pedro. Os convidados podem enviar, visualizar, curtir e baixar fotos do evento através de qualquer dispositivo!

## ✨ Características Principais

- 📸 **Upload instantâneo** - Compartilhe fotos em segundos
- 💝 **Curtidas** - Mostre amor pelas melhores fotos
- 📥 **Download** - Salve memórias em alta qualidade
- 🔄 **Tempo real** - Veja novas fotos automaticamente
- 📱 **PWA** - Instale como app no celular
- 🎨 **Design elegante** - Cores pastel coral e pêssego
- 💫 **Animações suaves** - Experiência mágica

## 🚀 Começar Agora

**Para Desenvolvedores:**
```bash
# Instalação rápida
npm install

# Configurar Firebase (ver .env.example)
cp .env.example .env

# Rodar localmente
npm run dev
```

Leia [`QUICKSTART.md`](./QUICKSTART.md) para iniciar em 5 minutos!

**Para Deploy em Produção:**
Siga o guia completo em [`DEPLOY.md`](./DEPLOY.md)

**Para Usuários Finais:**
Leia o manual em [`MANUAL.md`](./MANUAL.md)

## 📁 Arquivos Importantes

- `QUICKSTART.md` - Começar em 5 minutos
- `DEPLOY.md` - Guia completo de deploy
- `MANUAL.md` - Manual do usuário
- `CHECKLIST.md` - Checklist pré-lançamento
- `PROJECT_SUMMARY.md` - Resumo técnico completo
- `.env.example` - Template de configuração

## 🛠️ Stack Tecnológica

- **Frontend:** React 19 + TypeScript + Tailwind CSS v4
- **Backend:** Firebase (Firestore + Storage)
- **Animações:** Framer Motion
- **Estado:** Zustand
- **Build:** Vite 7
- **PWA:** Vite PWA Plugin
- **Ícones:** Lucide React

## 🎨 Paleta de Cores

```
🌸 Coral:   #ff8f77
🍑 Pêssego: #fdbf87  
🌺 Rosa:    #f48ca3
🍂 Creme:   #fefdfb
🌿 Sage:    #647264
```

## 📱 Funcionalidades

### Para Convidados
- ✅ Login simples (apenas nome)
- ✅ Enviar múltiplas fotos
- ✅ Visualizar galeria em tempo real
- ✅ Curtir fotos favoritas
- ✅ Baixar fotos em alta qualidade
- ✅ Instalar como app (PWA)

### Design & UX
- ✅ 100% Responsivo (mobile, tablet, desktop)
- ✅ Animações elegantes (corações, brilhos)
- ✅ Interface intuitiva
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

### Técnicas
- ✅ Real-time updates (Firestore)
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Service Worker (offline)
- ✅ TypeScript type-safe
- ✅ Clean Code

## 🔐 Segurança

- ✅ Firestore Rules configuradas
- ✅ Storage Rules configuradas
- ✅ Validação de tipos de arquivo
- ✅ Limite de tamanho (50MB)
- ✅ HTTPS obrigatório

## 📊 Performance

- ⚡ **Lighthouse Score:** 90+
- 🚀 **Build otimizado:** Vite + Tree shaking
- 💾 **Cache inteligente:** Service Worker
- 🖼️ **Lazy loading:** Imagens sob demanda
- 📦 **Bundle pequeno:** Code splitting

## 🎯 Objetivos do Projeto

1. ✅ **Modernidade** - Stack mais recente (React 19, Vite 7, Tailwind v4)
2. ✅ **Elegância** - Design inspirado em casamento
3. ✅ **Performance** - Carregamento rápido
4. ✅ **Usabilidade** - Interface intuitiva
5. ✅ **Confiabilidade** - Tratamento de erros
6. ✅ **Escalabilidade** - Suporta muitos usuários
7. ✅ **Manutenibilidade** - Código limpo e documentado

## 📚 Estrutura do Código

```
src/
├── components/     → Componentes React reutilizáveis
├── pages/          → Páginas principais
├── services/       → Lógica de negócio (Firebase)
├── store/          → Estado global (Zustand)
├── config/         → Configurações
├── styles/         → Cores e temas
├── types/          → TypeScript types
└── utils/          → Funções utilitárias
```

## 🎓 Boas Práticas Aplicadas

- ✅ **Clean Code** - Código legível e manutenível
- ✅ **SOLID Principles** - Arquitetura sólida
- ✅ **Component-Based** - Componentes reutilizáveis
- ✅ **Type Safety** - TypeScript rigoroso
- ✅ **Error Handling** - Tratamento adequado de erros
- ✅ **Performance** - Otimizações aplicadas
- ✅ **Accessibility** - Básico implementado
- ✅ **Documentation** - Bem documentado

## 🌟 Destaques Técnicos

### Animações com Framer Motion
```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Conteúdo animado
</motion.div>
```

### Real-time com Firestore
```typescript
PhotoService.subscribeToPhotos((photos) => {
  setPhotos(photos); // Atualização automática
});
```

### Estado Global com Zustand
```typescript
const photos = usePhotoStore((state) => state.photos);
const addPhoto = usePhotoStore((state) => state.addPhoto);
```

### PWA com Service Worker
```typescript
registerServiceWorker(); // Cache inteligente
```

## 🎉 Pronto para Usar!

O projeto está **100% funcional** e pronto para deploy. Basta:

1. 📝 Configurar Firebase (2 min)
2. 🚀 Fazer deploy (5 min)
3. 🎊 Compartilhar com convidados!

## 📞 Suporte

- 📖 Documentação completa nos arquivos MD
- 🐛 Issues no GitHub (se aplicável)
- 💬 Contato direto com desenvolvedor

## 🎁 Extras Incluídos

- ✅ Documentação completa
- ✅ Checklist pré-lançamento
- ✅ Manual do usuário
- ✅ Guia de deploy
- ✅ Regras de segurança
- ✅ Configuração de PWA
- ✅ Testes básicos

## 💡 Dicas

1. **Teste localmente** antes do deploy
2. **Configure alertas** de custo no Firebase
3. **Faça backup** das fotos regularmente
4. **Monitore** o uso em produção
5. **Divulgue** o link com antecedência

## 🎊 Evento

**Data:** 07 de Fevereiro de 2026  
**Local:** Property Eventos - Nova Petrópolis/RS  
**Tema:** Coral & Pêssego 🌸🍑

---

## 🙏 Agradecimentos

Desenvolvido com **❤️** usando:
- React Team
- Firebase Team
- Tailwind Labs
- Framer Motion Team
- Lucide Icons
- E toda comunidade open source!

---

## 📄 Licença

Este projeto é privado e destinado exclusivamente ao casamento de Marina e Pedro.

---

## 🎯 Status do Projeto

- ✅ **Desenvolvimento:** Completo
- ✅ **Testes:** Básicos realizados
- ⏳ **Deploy:** Aguardando configuração
- 📅 **Evento:** 07/02/2026

---

## 🌈 Comece Agora!

```bash
# Clone o projeto (se necessário)
git clone <repo-url>

# Entre no diretório
cd Wedding-Gallery

# Instale e rode
npm install && npm run dev
```

**Ou leia [`QUICKSTART.md`](./QUICKSTART.md) para instruções detalhadas!**

---

**Desenvolvido com 💕 para Marina & Pedro**

✨ **Que seja um dia inesquecível!** ✨

---

**Versão:** 1.0.0  
**Última atualização:** Novembro 2025  
**Próxima atualização:** Pós-evento (backup das fotos)

🎊 **Happy Wedding!** 💒💐
