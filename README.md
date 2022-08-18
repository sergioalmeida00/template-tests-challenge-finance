# ignite-template-tests-challenge
### Rotas da aplicação

- `Rotas users`
    - `POST - /api/v1/users`
        - A rota recebe `name`, `email` e `password` dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status `201`.
    - `POST - /api/v1/sessions`
        - A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.
    - `GET - /api/v1/statements/balance`
        - A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.
    
- `Rotas statement`
    - `POST - /api/v1/statements/deposit`
        - A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.
    - `POST - /api/v1/statements/withdraw`
        - A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`.
    - `GET - /api/v1/statements/:statement_id`
        - A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.
