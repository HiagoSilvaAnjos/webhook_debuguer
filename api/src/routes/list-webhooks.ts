import { db } from '@/db'
import { webhooks } from '@/db/schema'
import { desc, lt } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

/**
 * Rota para listar os webhooks recebidos com paginação baseada em cursor.
 * Retorna uma lista de webhooks e um cursor para a próxima página.
 */
export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks',
    {
      schema: {
        summary: 'List webhooks',
        tags: ['Webhooks'],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20), // Limite de itens por página
          cursor: z.string().optional(), // O ID do último item da página anterior
        }),
        response: {
          200: z.object({
            webhooks: z.array(
              createSelectSchema(webhooks).pick({
                id: true,
                method: true,
                pathname: true,
                createdAt: true,
              }),
            ),
            nextCursor: z.string().nullable(), // Cursor para a próxima página
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit, cursor } = request.query

      // Busca os webhooks no banco de dados
      const result = await db
        .select({
          id: webhooks.id,
          method: webhooks.method,
          pathname: webhooks.pathname,
          createdAt: webhooks.createdAt,
        })
        .from(webhooks)
        // Se um cursor for fornecido, busca apenas os itens "menores" que ele
        // Como os IDs (UUIDv7) são ordenados por tempo, isso funciona para paginação
        .where(cursor ? lt(webhooks.id, cursor) : undefined)
        // Ordena por ID em ordem decrescente para mostrar os mais recentes primeiro
        .orderBy(desc(webhooks.id))
        // Pede um item a mais que o limite para verificar se há uma próxima página
        .limit(limit + 1)

      // Verifica se há mais itens para a próxima página
      const hasMore = result.length > limit
      // Remove o item extra se ele existir
      const items = hasMore ? result.slice(0, limit) : result
      // Define o cursor para a próxima página como o ID do último item da lista atual
      const nextCursor = hasMore ? items[items.length - 1].id : null

      return reply.send({
        webhooks: items,
        nextCursor,
      })
    },
  )
}
