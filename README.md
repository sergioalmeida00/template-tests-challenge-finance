# ignite-template-tests-challenge
### Rotas da aplicação

- Rotas users
    - `POST - /api/v1/users`
        - A rota recebe `name`, `email` e `password` dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status 201.
        
        ```json
        //SEND EXEMPLE
        {
        	"name":"teswte",
        	"email":"tet@test.com",
        	"password":"123456"
        }
        ```
        
        ```json
        //RETURN EXEMPLE
        {
        	"id": "90d15277-1314-41e3-9500-fb5f654d8861",
        	"name": "teswte",
        	"email": "tete@teste.wcom",
        	"password": "$2a$08$lMWss7lN9KdvL1IShrwkjOXTw2s4kQjzmkwIJq1n99Le26dWXsHUu",
        	"created_at": "2022-08-18T02:20:55.505Z",
        	"updated_at": "2022-08-18T02:20:55.505Z"
        }
        ```
        
    - `POST - /api/v1/sessions`
        - A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.
        
        ```json
        //SEND EXEMPLE
        {
        	"email":"tete@teste.com",
        	"password":"123456"
        }
        ```
        
        ```json
        //RETURN EXEMPLE
        {
        	"user": {
        		"id": "2a9bbf7c-fc4b-4095-b9ea-2608202f26b5",
        		"name": "teste",
        		"email": "tete@teste.com"
        	},
        	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMmE5YmJmN2MtZmM0Yi00MDk1LWI5ZWEtMjYwODIwMmYyNmI1IiwibmFtZSI6InRlc3RlIiwiZW1haWwiOiJ0ZXRlQHRlc3RlLmNvbSIsInBhc3N3b3JkIjoiJDJhJDA4JHZwS0hGRWcuRWlaTFlEd2NXL1p2TnVBSVpEUEhJaDBqN2pabDlkNjF0WTJtSEZrSVhlcFNpIiwiY3JlYXRlZF9hdCI6IjIwMjItMDgtMTdUMTc6Mzk6MjEuMzQxWiIsInVwZGF0ZWRfYXQiOiIyMDIyLTA4LTE3VDE3OjM5OjIxLjM0MVoifSwiaWF0IjoxNjYwNzYyODY5LCJleHAiOjE2NjA4NDkyNjksInN1YiI6IjJhOWJiZjdjLWZjNGItNDA5NS1iOWVhLTI2MDgyMDJmMjZiNSJ9.JtjJzgsIlloyYY9NtvAPGZeB37bVDVVwnn5SxbK8_ZQ"
        }
        ```
        
    - `GET - /api/v1/statements/balance`
        - A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.
        
        ```json
        //RETURN EXEMPLE
        {
        	"statement": [
        		{
        			"id": "37e9d514-4c80-4c67-8cec-35836b01cb2a",
        			"amount": 700,
        			"description": "Imovel",
        			"type": "deposit",
        			"created_at": "2022-08-17T22:01:51.101Z",
        			"updated_at": "2022-08-17T22:01:51.101Z"
        		},
        		{
        			"id": "89056dc1-d57a-4b04-91de-6614394a7098",
        			"amount": 1,
        			"description": "Emprestimo",
        			"type": "withdraw",
        			"created_at": "2022-08-17T23:02:33.014Z",
        			"updated_at": "2022-08-17T23:02:33.014Z"
        		}
        	],
        	"balance": 699
        }
        ```
        
    
- Rotas statement
    - `POST - /api/v1/statements/deposit`
        - A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.
        
        ```json
        //SEND EXEMPLE
        {
        	"amount":700,
        	"description":"immobile"
        }
        ```
        
        ```json
        //RETURN EXEMPLE
        {
        	"id": "37e9d514-4c80-4c67-8cec-35836b01cb2a",
        	"user_id": "2a9bbf7c-fc4b-4095-b9ea-2608202f26b5",
        	"description": "immobile",
        	"amount": 700,
        	"type": "deposit",
        	"created_at": "2022-08-17T22:01:51.101Z",
        	"updated_at": "2022-08-17T22:01:51.101Z"
        }
        ```
        
    - `POST - /api/v1/statements/withdraw`
        - A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`.
        
        ```json
        //SEND EXEMPLE
         {
        	"amount":1,
        	"description":"loan"
        }
        ```
        
        ```json
        //RETURN EXEMPLE
        {
        	"id": "89056dc1-d57a-4b04-91de-6614394a7098",
        	"user_id": "2a9bbf7c-fc4b-4095-b9ea-2608202f26b5",
        	"description": "loan",
        	"amount": 1,
        	"type": "withdraw",
        	"created_at": "2022-08-17T23:02:33.014Z",
        	"updated_at": "2022-08-17T23:02:33.014Z"
        }
        ```
        
    - `GET - /api/v1/statements/:statement_id`
        - A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.
        
        ```json
        //RETURN EXEMPLE
        {
        	"id": "37e9d514-4c80-4c67-8cec-35836b01cb2a",
        	"user_id": "2a9bbf7c-fc4b-4095-b9ea-2608202f26b5",
        	"description": "immobile",
        	"amount": "700.00",
        	"type": "deposit",
        	"created_at": "2022-08-17T22:01:51.101Z",
        	"updated_at": "2022-08-17T22:01:51.101Z"
        }
        ```
