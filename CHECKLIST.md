# ✅ Checklist Pré-Lançamento

## 🔧 Configuração Inicial

- [ ] Criar projeto no Firebase Console
- [ ] Ativar Firestore Database
- [ ] Ativar Storage
- [ ] Copiar credenciais para arquivo `.env`
- [ ] Fazer login no Firebase CLI (`firebase login`)
- [ ] Inicializar projeto Firebase (`firebase init`)
- [ ] Deploy das regras de segurança

## 🎨 Personalização

- [ ] Adicionar logo do casamento no `/public`
- [ ] Ajustar cores no `src/styles/colors.ts` (se necessário)
- [ ] Verificar datas e informações no `src/components/HeroSection.tsx`
- [ ] Atualizar nome do casal em todos os componentes
- [ ] Configurar ícones do PWA

## 🧪 Testes

- [ ] Testar login com nome
- [ ] Testar upload de uma foto
- [ ] Testar upload de múltiplas fotos
- [ ] Testar curtir/descurtir fotos
- [ ] Testar download de fotos
- [ ] Testar visualização de foto em fullscreen
- [ ] Testar em diferentes navegadores (Chrome, Safari, Firefox)
- [ ] Testar em diferentes dispositivos (iPhone, Android, Desktop)
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Testar instalação como PWA
- [ ] Testar modo offline (fotos em cache)
- [ ] Testar com conexão lenta

## 🚀 Deploy

- [ ] Executar `npm run build` sem erros
- [ ] Preview do build (`npm run preview`)
- [ ] Deploy para Firebase Hosting
- [ ] Verificar URL de produção funcionando
- [ ] Testar todas as funcionalidades em produção
- [ ] Verificar certificado SSL (HTTPS)
- [ ] Testar PWA install em produção

## 📊 Monitoramento

- [ ] Configurar Firebase Performance Monitoring
- [ ] Configurar Firebase Analytics
- [ ] Configurar alertas de uso/custo
- [ ] Testar coleta de métricas

## 🔒 Segurança

- [ ] Verificar regras do Firestore
- [ ] Verificar regras do Storage
- [ ] Testar limite de upload (50MB)
- [ ] Testar bloqueio de arquivos não-imagem
- [ ] Garantir que `.env` está no `.gitignore`
- [ ] Não commitar credenciais no Git

## 📱 Performance

- [ ] Executar Lighthouse audit (Score > 90)
- [ ] Verificar tempo de carregamento inicial
- [ ] Otimizar imagens se necessário
- [ ] Verificar bundle size
- [ ] Testar lazy loading de fotos

## 🎯 Usabilidade

- [ ] Testar fluxo completo de usuário
- [ ] Verificar mensagens de erro claras
- [ ] Verificar feedback visual em todas as ações
- [ ] Testar acessibilidade básica
- [ ] Verificar textos e instruções

## 📄 Documentação

- [ ] README.md completo
- [ ] DEPLOY.md com instruções de deploy
- [ ] MANUAL.md para usuários finais
- [ ] Comentários no código onde necessário
- [ ] Variáveis de ambiente documentadas

## 🔄 Backup

- [ ] Configurar backup automático do Firestore
- [ ] Documentar processo de backup manual
- [ ] Planejar migração de fotos após o evento
- [ ] Definir política de retenção de dados

## 📢 Comunicação

- [ ] Criar QR Code com link do álbum
- [ ] Preparar mensagem de divulgação
- [ ] Criar instruções simples para convidados
- [ ] Preparar material de divulgação (se necessário)
- [ ] Testar compartilhamento do link

## 🎉 Dia do Evento

- [ ] Verificar que o site está no ar
- [ ] Confirmar que todas as funcionalidades estão operando
- [ ] Ter plano B (link backup, etc)
- [ ] Monitorar uso em tempo real
- [ ] Ter suporte disponível para problemas

## 📊 Pós-Evento

- [ ] Fazer backup de todas as fotos
- [ ] Exportar dados do Firestore
- [ ] Gerar estatísticas de uso
- [ ] Agradecer aos convidados
- [ ] Baixar todas as fotos em alta qualidade
- [ ] Desativar projeto Firebase (ou reduzir plano)

## 🐛 Troubleshooting Preparado

- [ ] Lista de problemas comuns e soluções
- [ ] Contato de suporte técnico
- [ ] Processo de rollback se necessário
- [ ] Logs configurados adequadamente

## 💰 Custos

- [ ] Verificar estimativa de custos do Firebase
- [ ] Configurar alertas de billing
- [ ] Planejar budget para o evento
- [ ] Considerar upgrade de plano se necessário

---

## 📝 Notas Importantes

### Estimativa de Uso para 100 Convidados

**Scenario conservador:**
- 50 convidados enviam fotos
- Média de 10 fotos por pessoa
- Total: 500 fotos
- Tamanho médio: 3MB por foto
- Storage necessário: ~1.5GB

**Firebase Free Tier:**
- Storage: 5GB
- Downloads: 1GB/dia
- Operações Firestore: 50k leituras/dia

**Conclusão:** O plano gratuito deve ser suficiente para um evento!

### Dicas Finais

1. **Teste TUDO antes do evento**
2. **Tenha um dispositivo de backup para monitorar**
3. **Divulgue o link com antecedência**
4. **Coloque QR Codes impressos no local**
5. **Considere ter alguém de TI "on call"**

### Contatos Úteis

- Firebase Support: https://firebase.google.com/support
- Status do Firebase: https://status.firebase.google.com/

---

**Data do Evento:** 07 de Fevereiro de 2026  
**Local:** Property Eventos - Nova Petrópolis/RS

Boa sorte e feliz casamento! 💒💕
