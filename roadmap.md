# Tarefas

- [x] Auditar checkout, carrinho, preços, pagamentos, webhooks, banco, estoque, integrações e variáveis.
- [x] Identificar a falha atual: credencial PagBank ausente; confirmar no teste real que nenhuma cobrança é criada.
- [x] Corrigir conflito de identificador vazio que impediria o segundo Pix aprovado e reforçar validação de CPF/telefone.
- [x] Corrigir o carrinho que aparecia vazio depois de navegar e testar a tentativa de compra no navegador.
- [ ] TAG fornecida: falta documentação do emissor sobre seu uso; não inserir em campo desconhecido do PagBank.
- [x] Implementar persistência de pedidos, itens e eventos com identificadores únicos e deduplicação; validar em pagamento real quando configurado.
- [x] Validar CEP de Unaí/MG no servidor antes do pagamento.
- [x] Recalcular produtos, quantidades, preços e total no servidor; desconto zero e frete a combinar fora do pagamento.
- [x] Processar confirmação apenas pelo webhook com assinatura e idempotência; testar com evento real quando credenciado.
- [ ] Adicionar cartão de crédito e débito reais pelo PagBank, após configurar as credenciais oficiais e validar o fluxo seguro.
- [ ] Substituir a notificação WhatsApp por Gmail da Pescados da Bia: depende do endereço de destino e da autorização da conta da proprietária; não vincular conta pessoal da criadora.
- [ ] Após escolher o canal, confirmar recebimento e retries sem duplicação com pagamento real.
- [x] Preservar o visual e o Pix no checkout, sem exibir opções de cartão que não estejam operacionais.
- [x] Conferir a frase inicial “PEIXES • FRUTOS DO MAR • EMPANADOS • CULINÁRIA ORIENTAL”.
- [ ] Executar testes Pix aprovado, crédito, débito, recusa, webhook repetido, fechamento do navegador e notificação real após obter credenciais/conta.
- [x] Auditar configurações externas: faltam PAGBANK_API_TOKEN para criar cobranças; ambiente PAGBANK_ENVIRONMENT (sandbox/live) e URL HTTPS pública correta para notificação precisam ser definidos; conta Gmail da proprietária não autorizada. APP_ORIGIN é opcional se a origem da requisição já for a URL pública correta. A TAG fornecida não é token da API documentada. Sem isso não houve pagamento ou notificação real, nem testes aprovados de crédito/débito/webhook.
