# Project architecture decisions

- Keep the cart in browser storage but hydrate it before persisting updates, because SSR's empty initial state must not erase a returning shopper's selection.
- Only server-side checkout functions create PagBank orders and validate Unaí addresses and retail pricing, because browser inputs are not authoritative.
- Accept payment approval only from the authenticated PagBank webhook and commit it through the database payment function, because browser redirects and QR creation are not proof of payment.
- Treat owner notifications as a separate retryable step after payment approval, because a delivery failure must not reverse a paid order.
- Do not display unimplemented card methods or unsupported installment claims, because the gateway must actually authorize them before they can be offered.