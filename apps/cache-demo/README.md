# React + NestJS + MongoDB + Redis Cache Demo

## 기술 스택
- React + TypeScript + Vite
- MUI 기반 검색/상태 화면, AG Grid 데이터 그리드
- NestJS REST API + Swagger
- MongoDB 7: 상품 데이터 1,000,000건 생성 스크립트와 인덱스
- Redis 7: cache-aside, TTL(기본 60초), 캐시 무효화
- Docker Compose: web, api, mongodb, redis

## Docker로 실행
저장소 루트에서:
```bash
docker compose -f docker-compose.cache.yml up --build -d
docker compose -f docker-compose.cache.yml exec api npm run seed
```
시드 데이터 100만 건 생성은 디스크/CPU 환경에 따라 시간이 걸릴 수 있습니다. 진행률이 로그에 표시됩니다.

- UI: http://localhost:8080
- Swagger: http://localhost:3000/api/docs
- API: http://localhost:3000/api/products?page=1&limit=50
- MongoDB: localhost:27017
- Redis: localhost:6379

종료:
```bash
docker compose -f docker-compose.cache.yml down
```
데이터 볼륨까지 삭제하려면 `docker compose -f docker-compose.cache.yml down -v`를 사용하세요.

## 로컬 개발
Node.js 20 이상과 MongoDB/Redis가 실행 중이어야 합니다.
```bash
npm install
npm --workspace @rbm/cache-demo run dev
```
프런트엔드 개발 서버: http://localhost:5173, Swagger: http://localhost:3000/api/docs

## 캐시 동작
1. `GET /api/products`가 검색/필터/페이지 조건을 포함한 캐시 키를 계산합니다.
2. Redis HIT면 MongoDB를 조회하지 않고 캐시 데이터를 반환합니다.
3. MISS면 MongoDB에서 페이지 데이터와 전체 건수를 조회하고 Redis에 TTL과 함께 저장합니다.
4. `DELETE /api/products/cache`는 `products:v1:*` 키를 무효화합니다.
5. Redis가 연결되지 않으면 캐시를 건너뛰고 MongoDB를 사용합니다.

응답의 `cacheHit` 및 `durationMs` 필드로 캐시 HIT/MISS와 API 처리 시간을 비교할 수 있습니다. 검색은 예제용 부분 문자열 정규식이며, 대규모 운영 검색에는 정규식 대신 MongoDB Atlas Search 또는 검색용 인덱스/토큰 설계를 검토하세요. 페이지네이션은 학습용 skip/limit 방식이며 매우 깊은 페이지에서는 커서 기반 페이지네이션이 더 적합합니다.

## 주요 엔드포인트
- `GET /api/products?page=1&limit=50&search=product&category=Books&status=active`
- `DELETE /api/products/cache`
- Swagger UI: `/api/docs`
