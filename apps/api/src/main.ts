import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
 const app = await NestFactory.create(AppModule);
 app.enableCors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' });
 const port = Number(process.env.PORT ?? 3000);
 await app.listen(port);
 console.log(`Realtime Batch API listening on http://localhost:${port}/graphql`);
}
void bootstrap();
