# QA / Tech Writing — Front-end

## Escopo analisado
- Repositório: `rafael-kuchla-flores/Descarte_Tecidos`
- Branch de referência: `develop`
- Snapshot analisado: commit `1c52e7f` (2026-09-08)
- Tipo de análise: estática. **Nenhum teste foi marcado como executado.**

## Evidências encontradas
- React + Vite.
- React Router.
- `AuthContext` com armazenamento de token/usuário em `localStorage`.
- `ProtectedRoute` com proteção de rotas administrativas por `ADMIN`.
- Telas de login, cadastro e recuperação de senha.
- Página de acesso negado.
- Páginas administrativas para dashboard, campanhas, pontos, usuários e conteúdo.
- Services `api.js`, `authService.js` e `userService.js`.

## Pendências/achados
1. README ainda está como template padrão do Vite e precisa de instruções reais do projeto.
2. `package.json` não evidencia Jest nem script de testes.
3. `authService.getMe()` usa `/users/me`, enquanto o Back analisado expõe `GET /user`.
4. `authService.resetPassword()` usa `/auth/reset-password`, enquanto o Back expõe `/auth/forgot-password/reset`.
5. `services/api.js` usa uma URL fixa; preferir variável `VITE_API_URL`.
6. Rotas de ponto de coleta por perfil ainda não estão evidenciadas.
7. A proteção visual do Front não substitui autorização do Back.

## Casos QA preparados
| ID | Cenário | Status |
|---|---|---|
| FE-AUTH-01 | Login válido | NOT RUN |
| FE-AUTH-02 | Login inválido | NOT RUN |
| FE-AUTH-03 | Usuário não autenticado tenta rota protegida | NOT RUN |
| FE-AUTH-04 | Usuário não ADMIN tenta `/admin` | NOT RUN |
| FE-LOGOUT-01 | Logout e tentativa de voltar para área protegida | NOT RUN |
| FE-PASS-01 | Solicitação de recuperação | NOT RUN |
| FE-PASS-02 | Redefinição com token válido | NOT RUN |
| FE-REG-01 | Cadastro válido | NOT RUN |
| FE-REG-02 | Campos obrigatórios | NOT RUN |
| FE-REG-03 | Senhas diferentes / senha curta | NOT RUN |

## Evidência mínima quando os testes começarem
- Branch + commit.
- Navegador.
- Data/hora.
- Passos executados.
- Resultado atual.
- Resultado esperado.
- Screenshot/vídeo quando aplicável.
- Bug Jira relacionado, se houver.
