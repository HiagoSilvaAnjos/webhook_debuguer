import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

/**
 * Rota para obter os detalhes de um webhook específico pelo seu ID.
 * Utiliza o método GET e espera o ID como parâmetro na URL.
 */
export const getWebhook: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Get a specific webhook by ID',
        tags: ['Webhooks'],
        params: z.object({
           id: z.uuidv7(), // Valida que o ID é um UUID
        }),
        response: {
          200: createSelectSchema(webhooks), // Retorna o objeto completo do webhook
          404: z.object({ message: z.string() }), // Webhook não encontrado
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      // Busca o webhook no banco de dados
      const result = await db
        .select()
        .from(webhooks)
        .where(eq(webhooks.id, id))
        .limit(1)

      // Se nenhum resultado for encontrado, retorna 404
      if (result.length === 0) {
        return reply.status(404).send({ message: 'Webhook not found.' })
      }

      // Retorna o primeiro (e único) resultado
      return reply.send(result[0])
    },
  )
}
