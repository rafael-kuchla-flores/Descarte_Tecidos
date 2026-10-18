# Ecotecido

Aplicação React/Vite com uma API Express local para autenticação, pontos de coleta e gerenciamento de conteúdo.

## Executar localmente

Instale as dependências e inicie o servidor e o front-end:

```sh
npm install
npm run dev:all
```

O front-end fica disponível no endereço exibido pelo Vite e a API em `http://localhost:4000/api/v1`. A API usa `server/database.json` para persistir os dados do ambiente local. É possível configurar `PORT`, `DATA_FILE` e `JWT_SECRET` por variáveis de ambiente. O front-end aceita `VITE_API_URL` para apontar a API a outro endereço.

Para acessar a administração de conteúdo no ambiente inicial:

- E-mail: `admin@ecotecido.com`
- Senha: `admin123`

## Conteúdos

Com autenticação, usuários podem consultar categorias e posts publicados. Administradores podem criar, atualizar e excluir posts logicamente, além de criar, renomear e excluir categorias.

Endpoints locais implementados:

- `GET /api/v1/categories` e `GET /api/v1/categories/{id}`
- `GET /api/v1/posts` e `GET /api/v1/posts/{id}`
- `GET /api/v1/admin/categories`, `POST /api/v1/admin/categories`, `GET /api/v1/admin/categories/{id}`, `PUT /api/v1/admin/categories/{id}` e `DELETE /api/v1/admin/categories/{id}`
- `GET /api/v1/admin/posts`, `POST /api/v1/admin/posts`, `GET /api/v1/admin/posts/{id}`, `PATCH /api/v1/admin/posts/{id}` e `DELETE /api/v1/admin/posts/{id}`

As listagens aceitam paginação (`page`, `size`) e ordenação (`sort`). Posts aceitam filtros por categoria, termo de busca e tags. A exclusão de um post mantém o registro para consulta administrativa e armazena a justificativa, a data e o nome de quem excluiu.

## Pontos de coleta

Administradores podem consultar a fila de propostas de edição na tela de pontos de coleta, comparar os dados propostos e aprovar ou rejeitar cada solicitação. Gerentes enviam alterações como propostas; elas só são aplicadas após aprovação administrativa. A tela também permite consultar gerentes e operadores associados a cada ponto e associar como operador um usuário já cadastrado pelo documento.

Endpoints locais para estes fluxos:

- `GET /api/v1/admin/collection-points/pending-updates`
- `POST /api/v1/admin/collection-points/{id}/approve-update` e `POST /api/v1/admin/collection-points/{id}/reject-update`
- `GET /api/v1/admin/collection-points/{id}/users`
- `PATCH /api/v1/admin/collection-points/{id}/users/operators` com `{ "document": "..." }`
