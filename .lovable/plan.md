# Checkout definitivo — Pescados da Bia

## Resultado esperado

Substituir o Pix estático e os pedidos salvos no aparelho por um fluxo seguro e persistente: endereço validado para Unaí/MG, valores recalculados no servidor, pagamento confirmado somente pelo PagBank/PagSeguro, pedido único no banco e aviso automático no WhatsApp Business após aprovação real.

## Auditoria concluída

- O checkout atual gera um Pix estático no navegador; não existe consulta ao PagBank/PagSeguro.
- Pedidos e status ficam no armazenamento local do aparelho, sem banco e sem segurança contra manipulação.
- A página interna permite confirmar ou apagar pedidos sem autenticação real.
- Não existe webhook de pagamento, validação de assinatura, idempotência, estoque numérico ou fila de notificações.
- Os preços, descontos e totais atuais são calculados somente no navegador.
- O WhatsApp atual usa apenas links manuais; a conta oficial ainda não foi vinculada.
- A TAG foi informada como pertencente ao PagBank/PagSeguro, mas sua função exata ainda precisa ser confirmada na documentação oficial antes de ser ligada a qualquer campo.

## Implementação

### 1. Dados e segurança

- Criar tabelas protegidas para pedidos, itens, pagamentos, eventos recebidos e notificações.
- Gerar número único de pedido no banco e impedir duplicidade por pagamento e evento.
- Registrar cliente, endereço completo, itens, valores, pagamento, datas e tentativas do WhatsApp.
- Manter estoque apenas como disponibilidade quando não houver quantidade real cadastrada; não inventar saldos.

### 2. Endereço exclusivo em Unaí/MG

- Separar CEP, rua, número, complemento e bairro no checkout.
- Consultar CEP no servidor por uma fonte oficial/disponível e aceitar somente país Brasil, estado MG e cidade Unaí.
- Repetir a validação no servidor ao criar a cobrança; qualquer divergência bloqueia com a mensagem exigida.
- O frete ficará fora do total inicial e será exibido como “a combinar após o pedido”, conforme informado.

### 3. Pedido e valores confiáveis

- Enviar ao servidor somente IDs e quantidades do carrinho.
- Recalcular preços, modo varejo/atacado aprovado, desconto e total usando o catálogo confiável do servidor.
- Limitar quantidades, rejeitar produtos inexistentes/indisponíveis e ignorar valores enviados pelo navegador.
- Persistir o pedido pendente antes de abrir a cobrança.

### 4. PagBank/PagSeguro

- Criar a cobrança somente pelo servidor usando a API oficial documentada.
- Aplicar a TAG exatamente no campo oficial confirmado pelo PagBank/PagSeguro; se a documentação não reconhecer esse formato, interromper essa parte e informar o dado correto necessário.
- Receber o webhook em endereço público fixo, validar sua autenticidade e consultar a transação no provedor quando necessário.
- Aprovar o pedido somente após confirmação oficial e comparar o valor confirmado com o total persistido.
- Tratar eventos repetidos sem duplicar pedido, pagamento ou efeitos.

### 5. WhatsApp automático

- Usar a conexão oficial do WhatsApp Business vinculada ao número do site, nunca `wa.me` para a notificação automática.
- Gerar a mensagem completa a partir do pedido salvo no servidor.
- Criar caixa de saída persistente com estados `PENDING`, `SENT` e `FAILED`, tentativas, erro e ID da mensagem.
- Enviar somente após pagamento aprovado; retries serão idempotentes e não apagarão o pedido em caso de falha.
- Manter os links manuais existentes apenas para atendimento, sem usá-los como confirmação automática.

### 6. Interface preservada

- Manter cores, tipografia, imagens e organização atuais.
- Atualizar somente campos, mensagens e estados necessários no checkout.
- Mostrar sucesso apenas após aprovação real; pendência, recusa e expiração terão estados próprios.
- Remover a confirmação manual insegura da área pública ou protegê-la antes de exibir dados reais.
- Trocar a frase superior da página inicial para: `PEIXES • FRUTOS DO MAR • EMPANADOS • CULINÁRIA ORIENTAL`.

### 7. Verificação

- Automatizar testes para bloqueio de Brasília, Formosa, Belo Horizonte e qualquer local fora de Unaí/MG.
- Testar payload manipulado, preço alterado, múltiplos produtos, webhook duplicado e falha/retry do WhatsApp.
- Testar estados aprovado, pendente e recusado com o ambiente de testes oficial do PagBank/PagSeguro.
- Conferir banco, logs, webhook publicado e mensagem real somente quando as contas externas estiverem vinculadas.

## Configurações externas necessárias

- **PagBank/PagSeguro:** credencial oficial da API e segredo/configuração de webhook, obtidos no painel de desenvolvedores PagBank. Serão armazenados como segredos do servidor; nenhum valor irá para o navegador.
- **TAG PagBank/PagSeguro:** confirmação do nome do campo/tela de origem. O valor será preservado exatamente, mas não será encaixado em um campo não documentado.
- **WhatsApp Business:** vincular a conta Business do número exibido no site pelo cartão oficial de conexão. A tentativa foi recusada, portanto o envio automático continua bloqueado.
- **Modelo WhatsApp:** aprovação pela Meta quando a regra da conta exigir mensagem modelo para iniciar a conversa.

## Limites de conclusão

O código local e os testes simulados podem ser concluídos sem credenciais. Pagamento real, webhook real e mensagem real só serão marcados como verificados depois da configuração oficial do PagBank/PagSeguro e da conexão do WhatsApp Business.
