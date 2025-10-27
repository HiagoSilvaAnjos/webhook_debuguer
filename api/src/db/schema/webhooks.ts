/**
 * Este arquivo define o schema da tabela de webhooks no banco de dados PostgreSQL.
 * Utiliza o Drizzle ORM para definir a estrutura da tabela.
 * A tabela armazena informações detalhadas sobre cada requisição webhook recebida,
 * incluindo cabeçalhos, corpo da requisição, parâmetros e metadados.
 */

import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

// Define a estrutura da tabela 'webhooks' que armazenará todas as requisições
export const webhooks = pgTable("webhooks", {
  // Identificador único do webhook usando UUIDv7 (ordenável por tempo)
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),

  // Método HTTP da requisição (GET, POST, etc)
  method: text().notNull(),

  // Caminho da URL que recebeu o webhook
  pathname: text().notNull(),

  // Endereço IP do remetente
  ip: text().notNull(),

  // Código de status HTTP da resposta (200, 404, 500, etc)
  statusCode: integer().notNull().default(200),

  // Tipo de conteúdo da requisição (application/json, etc)
  contentType: text(),

  // Tamanho do corpo da requisição em bytes
  contentLength: integer(),

  // Parâmetros da query string em formato JSON
  queryParams: jsonb().$type<Record<string, string>>(),

  // Cabeçalhos da requisição em formato JSON
  headers: jsonb().$type<Record<string, string>>().notNull(),

  // Corpo da requisição em formato texto
  body: text(),

  // Data e hora de recebimento do webhook
  createdAt: timestamp().notNull().defaultNow(),
});
