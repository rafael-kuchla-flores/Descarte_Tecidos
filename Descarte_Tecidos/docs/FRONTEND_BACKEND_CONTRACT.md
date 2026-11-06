# ECOTECIDOS — Frontend/Backend integration alignment

**Reference:** Java Spring Boot API, repository `lucastnsoares/ecotecidos-api`, branch `develop`, reviewed 2026-11-06.

## Implemented in this frontend patch

| Flow | Backend contract | Frontend adjustment |
|---|---|---|
| Admin cashback rate | `PUT /api/v1/admin/cashback-rules/points-per-kg?newPointsPerKg=...` | Send a query parameter (`@RequestParam`), not a JSON body. |
| User favorite posts | `GET /api/v1/user/favorite-posts` (paginated), `PUT` / `DELETE /api/v1/user/favorite-posts/{id}` | Signed-in users use the backend; IDs are loaded from response `content[]`. |
| User favorite points | `GET /api/v1/user/favorite-collection-points` (paginated), `PUT` / `DELETE /api/v1/user/favorite-collection-points/{id}` | Signed-in users use the backend. Shared request cache prevents a GET from every card. |
| Guest favorites | No backend endpoint without authentication | Browser-local favorites are retained for guests, kept separate from signed-in account favorites. No automatic migration. |
| My disposals | `GET /api/v1/disposals/my-disposals` returns `UserDisposalsSummaryDTO` with `disposals.content[]` | Read from nested page, with backwards-compatible fallback. |
| Post list | `PostSummaryResponseDTO` contains `categoryName` rather than `category` | Display/filter the correct category on summary cards. |
| Cloth types | Frontend needs `GET /api/v1/cloth-types` with `{id, name}` entries | Normalize array or Spring Page response when available; show a specific warning and prevent a submission with no type ID if unavailable. |

## Required backend action — blocks donor disposal registration

As of the reviewed Java `develop`, `ClothTypeController` only exposes `/api/v1/admin/cloth-types`, requiring `ADMIN`. The donor cannot use it. The current public point response supplies accepted cloth **names**, not the stable **IDs** required by `POST /api/v1/disposals` (`clothTypeIds: Long[]`).

**Backend team:** expose `GET /api/v1/cloth-types` for authenticated donors (or another documented user-accessible route, with frontend coordinated accordingly). A paginated Spring response with at least `id` and `name` fields per active cloth type is sufficient. The UI can then match the names accepted by a selected point to these IDs. Do not fake IDs or use the admin endpoint with donor credentials.

## Auth and deployment considerations

- The API's Spring Security configuration requires JWT for posts, categories, points and other routes besides authentication/registration. Frontend pages presented as public may return HTTP 401 without login. If anonymous browsing is required, the **backend team** must decide which routes to expose safely.
- Check `VITE_API_URL` on the machine/environment where the frontend is run. This patch deliberately does not change local `.env` files or API host defaults.
- Account favorites are server-side. Browser-local guest favorites stay separate and **do not migrate automatically** after login.
- The frontend compilation and lint do not prove the remote API is reachable. Validate login, roles, CORS, GET/PUT/DELETE favorites, cashback rule update, types availability, and disposal registration end-to-end in the integration environment.

## Frontend verification

Files changed by this patch passed targeted ESLint locally. `npm run build` must be run on the development machine after applying the patch; the review environment did not have the platform-native RollDown dependency needed for Vite build.
