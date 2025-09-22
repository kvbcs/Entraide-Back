import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configuration CORS pour restreindre l'accès à une URL précise

  const corsOptions = (origin, callback) => {
    // Liste les origines autorisées depuis .env (ou fallback)
    const allowedOrigins = [
      process.env.FRONTEND_URL ?? 'http://localhost:3000',
      // ajouter d'autres domaines si besoin
    ];

    // ⚡️ Cas 1 : origin est undefined → Postman, cURL ou même SSR → on autorise en dev
    // ⚡️ Cas 2 : origin est dans la liste des domaines autorisés → OK
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  };

  app.enableCors({
    origin: corsOptions,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Méthodes autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
    credentials: true, // Autoriser les cookies (si besoin)
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
