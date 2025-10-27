# Webhook Debugger

Uma aplicação para capturar, visualizar e debugar requisições webhook em tempo real. Perfeita para desenvolvimento e testes de integrações que utilizam webhooks.

## 🚀 Tecnologias

### Backend (API)

- [Fastify](https://fastify.io/) - Framework web rápido e de baixa overhead
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Drizzle ORM](https://orm.drizzle.team/) - ORM para TypeScript
- [Zod](https://zod.dev/) - Validação de schemas com TypeScript
- [Swagger/OpenAPI](https://swagger.io/) - Documentação da API automatizada
- [Scalar](https://scalar.com/) - Interface melhorada para documentação da API

### Frontend (Web)

- [React](https://reactjs.org/) - Biblioteca para construção de interfaces
- [Vite](https://vitejs.dev/) - Build tool e dev server
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- pnpm (gerenciador de pacotes)

## 🔧 Instalação

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/HiagoSilvaAnjos/webhook_debuguer.git
   cd webhook_debuguer
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Configure as variáveis de ambiente:

   - Copie o arquivo `.env.example` para `.env`
   - Configure a URL do banco de dados em `DATABASE_URL`

4. Execute as migrações do banco de dados:
   \`\`\`bash
   pnpm db:migrate
   \`\`\`

5. (Opcional) Popular o banco com dados de exemplo:
   \`\`\`bash
   pnpm db:seed
   \`\`\`

## 🚀 Uso

1. Inicie o servidor de desenvolvimento:
   \`\`\`bash

# Backend

cd api
pnpm dev

# Frontend (em outro terminal)

cd web
pnpm dev
\`\`\`

2. Acesse:
   - Frontend: http://localhost:5173
   - API: http://localhost:3333
   - Documentação da API: http://localhost:3333/docs

## 📝 Funcionalidades

- ✅ Captura de webhooks em tempo real
- ✅ Visualização detalhada das requisições
- ✅ Interface amigável para explorar os dados
- ✅ Documentação interativa da API
- ✅ Suporte a diferentes tipos de webhooks (JSON, form-data, etc)
- ✅ Histórico de requisições persistente
