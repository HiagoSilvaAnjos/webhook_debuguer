import { z } from "zod";

/* 
    Este arquivo é responsável por validar e tipar as variáveis de ambiente da aplicação.
    Utiliza a biblioteca Zod para criar um schema de validação que:
    - Define o ambiente (development, production ou test)
    - Define a porta do servidor
    - Valida a URL do banco de dados
    
    Caso alguma variável de ambiente não atenda aos requisitos, um erro será lançado.
*/
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.url(),
});

export const env = envSchema.parse(process.env);
