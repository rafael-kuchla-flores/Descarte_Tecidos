# ECOTECIDOS — Repasse do frontend

Atualizado em **05/11/2026**, a partir do ZIP fornecido pela equipe.

## 1. Objetivo desta entrega

Completar melhorias de **interface e navegação** no frontend React/Vite, preservando os módulos existentes e sem alterar o backend, regras de negócio de API ou entregas formais de QA.

## 2. Alterações implementadas

| Área | Alteração |
|---|---|
| Conteúdos educativos | Favoritar/desfavoritar pelo card e pela tela de detalhes; filtro **Meus favoritos**; busca e filtros por categoria preservados; mensagens de carregamento, erro, vazio e tentativa de recarregar. |
| Favoritos locais | Hook compartilhado `src/hooks/useFavorites.js`: para usuário autenticado, sincroniza com a API Java; para visitante sem login, utiliza armazenamento local no navegador, com chaves separadas por tipo. |
| Pontos de coleta | O botão de coração do card agora usa o **mesmo armazenamento** do detalhe do ponto. Seleção no mapa virou botão acessível ao teclado; status de ponto pendente ou pausado não aparece como “Recebendo”. |
| Campanhas | Listagem com estados de carregamento, erro e vazio, preservando o serviço de campanhas existente. |
| Navegação | Rota inexistente mostra página 404; URL antiga `/registrar-descarte` encaminha ao formulário funcional de `/carteira`; atalhos de favoritos e rótulo do menu móvel. |
| Acessibilidade | Botões com nomes e estados `aria-pressed`, navegação por teclado, textos de status, ajustes de foco, HTML em português do Brasil e metadados de página. |
| Manutenção | Correção do **case** dos imports `Header` e `Footer` para sistemas sensíveis a maiúsculas/minúsculas; remoção de tratamento de erro HTTP duplicado e logs do corpo da resposta em `src/services/api.js`. |
| Assets | Favicon SVG simples criado para substituir a referência ausente. |

### Como funcionam os favoritos

- **Usuários autenticados:** favoritos de conteúdos e pontos são consultados e atualizados por `GET`, `PUT` e `DELETE` em `/user/favorite-posts` e `/user/favorite-collection-points`, respectivamente.
- **Visitantes:** listas locais no `localStorage` (`ecotecido:favoritePosts` e `ecotecido:favoriteCollectionPoints`); não são migradas automaticamente ao fazer login.
- A mudança para a API depende de disponibilidade do backend Java, JWT e CORS. As falhas são exibidas e não provocam gravação local silenciosa para contas autenticadas.
- A tela de conteúdos pode ser aberta diretamente em `/conteudos?favoritos=1`.

## 3. Organização e pontos de integração

- `src/routes/AppRoutes.jsx` — rotas públicas, protegidas e por perfil.
- `src/context/AuthContext.jsx`, `src/hooks/useAuth.js` — sessão e papéis.
- `src/services/api.js` — cliente de API; recebe base pelo `VITE_API_URL`.
- `src/services/contentService.js` — posts, categorias, imagens, administração de conteúdos.
- `src/services/collectionPointService.js` — pontos de coleta, geolocalização e normalização.
- `src/services/cashbackService.js` — saldo, histórico, resgate, descarte e regras.
- `src/pages/wallet/Wallet.jsx` — carteira, registro de descarte e resgate reais via API.
- `src/pages/collection-point/DisposalReview.jsx` — confirmação/rejeição de descartes.
- `src/pages/admin/cashback-rules/CashbackRules.jsx` — regra de pontos/kg.
- `src/hooks/useFavorites.js`, `src/services/favoritesService.js` — integração de favoritos com API para contas autenticadas; modo local apenas para visitantes.

## 4. Como executar na máquina da equipe (CMD)

Dentro da raiz do projeto:

```cmd
npm install
npm run dev
```

Para validar **compilação**, sem substituir o trabalho formal de QA:

```cmd
npm run build
```

Para conferir o que foi modificado:

```cmd
git status -sb
git diff --check
git diff --stat
```

A API usada pelo navegador deve estar configurada por `VITE_API_URL` em arquivo local de ambiente (não enviado neste pacote). Por exemplo, **somente se a API local estiver em execução**:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

**Nunca commitar `.env` com segredos**. O projeto original tem configuração própria para API de equipe; confirmar o endereço e as permissões na máquina de integração.

## 5. Pendências e pontos de atenção para a equipe

**Não interpretar estas mudanças como homologação funcional.** Ainda precisam de verificação conjunta com o backend e de QA:

1. **Autenticação e perfis** (doador, gerente, operador e admin) e permissões de acesso às rotas.
2. Contratos de resposta e erros das APIs de conteúdos, pontos, descarte, resgate e regras de cashback.
3. Validação manual em navegador e celular, incluindo telas administrativas; não foi feita auditoria visual exaustiva de todos os módulos.
4. As páginas `ManagerFeaturePending` sob gerente (`horarios`, `tecidos`, `operadores`, `recebimentos`) continuam exibindo funcionalidades pendentes, conforme a base recebida.
5. `campaignService.js` possui **campanhas de demonstração/fallback**. Confirmar com a equipe quando serão substituídas pelo backend.
6. O formulário de newsletter e links de redes sociais do rodapé são **elementos de interface**, não integrações comprovadas; não anunciar como serviço ativo.
7. `npm run lint` no projeto inteiro já identifica erros preexistentes em outros arquivos (`react-hooks/set-state-in-effect`, imports não utilizados etc.). Os arquivos funcionais alterados foram verificados com ESLint individualmente; a limpeza global do lint precisa ser coordenada para evitar sobrescrever trabalho alheio.
8. URLs `/posts`, `/categories` e imagens dependem de disponibilidade e autenticação do backend; favoritos não permitem leitura offline do conteúdo em si. A listagem pública de tipos de tecidos precisa ser liberada no backend para que doadores possam registrar descartes (veja `FRONTEND_BACKEND_CONTRACT.md`).

## 6. Aplicação do pacote de alterações

**Aplicar somente sobre a mesma versão de projeto enviada para esta revisão.** Primeiro confirmar que não há alterações rastreadas pendentes:

```cmd
git status -sb
```

Extraia `ECOTECIDOS_patch_frontend.zip` na **raiz do projeto**, mantendo a estrutura `src/`, `docs/`, `index.html` e `public/`. Depois:

```cmd
npm run build
git diff --check
git status -sb
```

O pacote de alteração **não contém** `.git`, `node_modules`, `.env` ou arquivos de backup. Ao versionar, revisar a lista de arquivos antes do `git commit` e evitar `git add .`, que pode incluir backups pessoais.

## 7. Notas de verificação desta preparação

- ESLint: passou nos arquivos diretamente alterados na implementação (com exceção de arquivos preexistentes que não fazem parte da correção global de lint).
- Resolução estática de imports locais: sem caminhos ausentes ou inconsistências de maiúsculas/minúsculas.
- Build **não pôde ser executado neste ambiente Linux**, porque o ZIP original traz dependências nativas do ambiente Windows (`rolldown`) e não havia acesso à rede para instalar a variante Linux. **Executar `npm run build` no Windows antes de publicar ou entregar ao QA.**

## 8. Atualização de integração — 06/11/2026

Correções do contrato entre o frontend e o backend Java `develop` estão detalhadas em `docs/FRONTEND_BACKEND_CONTRACT.md`. O cashback agora envia `newPointsPerKg` como query parameter; favoritos autenticados utilizam a API; o histórico de descartes é lido de `disposals.content` e a listagem de posts usa `categoryName`. A rota de tipos de tecido para doadores ainda depende de ação do backend. Executar novamente o build após aplicar este patch.
