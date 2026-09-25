# Tarefas

- [x] Auditar checkout, carrinho, preços, pagamentos, webhooks, banco, estoque, integrações e variáveis.
- [x] Identificar a falha atual: credencial PagBank ausente; confirmar no teste real que nenhuma cobrança é criada.
- [x] Corrigir conflito de identificador vazio que impediria o segundo Pix aprovado e reforçar validação de CPF/telefone.
- [ ] Identificar e integrar corretamente a TAG fornecida ao provedor real.
- [ ] Persistir pedidos e pagamentos com segurança e idempotência.
- [ ] Validar endereço exclusivamente em Unaí/MG no servidor antes do pagamento.
- [ ] Recalcular produtos, quantidades, preços, desconto, frete e total no servidor.
- [ ] Confirmar pagamento somente por webhook oficial autenticado.
- [ ] Adicionar cartão de crédito e débito reais pelo PagBank, após configurar as credenciais oficiais e validar o fluxo seguro.
- [ ] Notificar automaticamente a proprietária no WhatsApp com retry seguro.
- [ ] Confirmar no WhatsApp do número do site cada pedido aprovado, sem depender de ação manual.
- [ ] Substituir a notificação WhatsApp por e-mail automático via Gmail da Pescados da Bia; a proprietária deve autorizar a conta correta, não o Gmail pessoal da criadora do site.
- [ ] Atualizar o checkout preservando o visual e os recursos existentes.
- [ ] Trocar a frase da imagem para “PEIXES • FRUTOS DO MAR • EMPANADOS • CULINÁRIA ORIENTAL”.
- [ ] Executar os 13 testes obrigatórios e revisar segurança final.
- [ ] Documentar configurações externas pendentes e limites de verificação.
