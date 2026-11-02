# Realtime Batch Monitor

React + Electron 데스크톱 클라이언트와 NestJS 백엔드로 구성한 실시간 배치 처리 모니터링 예제입니다.

## 기술 스택
- **Desktop:** Electron, React, TypeScript, Vite (electron-vite)
- **API:** NestJS, GraphQL (Apollo, code-first), TypeORM, SQLite
- **Realtime:** Socket.IO Gateway → renderer에 배치 진행률 이벤트 전달
- **Monorepo:** npm workspaces

## 아키텍처
```text
React renderer ── GraphQL HTTP ──┐
       │                         ▼
       └──── Socket.IO ─── NestJS API
                                  ├── GraphQL Resolver
                                  ├── BatchService (실시간 진행률)
                                  ├── Socket.IO Gateway
                                  └── TypeORM ── SQLite
Electron main / preload ── 안전한 데스크톱 셸
```

## 실행
Node.js 20 이상 권장.
```bash
npm install
npm run dev
```
- GraphQL endpoint: http://localhost:3000/graphql
- Renderer dev server: http://localhost:5173

## 동작 확인
1. 데스크톱 앱이 열리면 **배치 시작**을 누릅니다.
2. GraphQL mutation으로 작업을 생성합니다.
3. NestJS가 처리량을 주기적으로 갱신하고 Socket.IO로 `batch:progress` 이벤트를 브로드캐스트합니다.
4. React 화면의 진행률/상태가 실시간으로 갱신됩니다.
5. GraphQL query로 저장된 작업 목록을 다시 불러올 수 있습니다.

## GraphQL 예시
```graphql
query Jobs {
  jobs { id name status total processed createdAt }
}
```
```graphql
mutation StartBatch {
  startBatch(total: 100) { id status total }
}
```

## 주요 경로
- `apps/desktop/src/main`: Electron main process
- `apps/desktop/src/preload`: isolated preload bridge
- `apps/desktop/src/renderer`: React UI
- `apps/api/src/batch`: GraphQL, processing service, TypeORM entity
- `apps/api/src/realtime`: Socket.IO gateway

## 설계 메모
학습용 예제입니다. 대규모 배치에서는 in-memory timer 대신 BullMQ/RabbitMQ/Kafka 같은 작업 큐, 재시도/멱등성, worker 분리, 인증·인가, 관측성, graceful shutdown 및 DB migration을 추가하세요. SQLite는 로컬 데모용이며 프로덕션에는 PostgreSQL 등을 고려하세요.
