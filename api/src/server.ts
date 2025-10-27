import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { listWebhooks } from "./routes/list-webhooks";
import { env } from "./env";

// Cria uma instância do Fastify com suporte a tipagem usando Zod
const app = fastify().withTypeProvider<ZodTypeProvider>();

// Configura os compiladores personalizados para validação e serialização
// Isso permite que o Fastify use o Zod para validar as requisições e respostas
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Registra o plugin CORS para permitir requisições de diferentes origens
// origin: true permite requisições de qualquer origem
app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

// Registra o plugin Swagger para documentação da API
// Configura as informações básicas da documentação OpenAPI
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Webhook Inspector API",
      description: "API para capturar e inspecionar requisições webhook",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

// Registra o plugin Scalar API Reference para uma interface de documentação melhorada
// Disponível no caminho /docs
app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

// Registra as rotas da aplicação
// Inclui a rota para listar webhooks
app.register(listWebhooks);

// Inicia o servidor
app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("🔥 Server is running on http: http://localhost:3333");
  console.log("📚 API docs available at http://localhost:3333/docs");
});
