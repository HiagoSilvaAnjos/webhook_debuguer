import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

/**
 * Rota para deletar um webhook específico pelo seu ID.
 * Utiliza o método DELETE e espera o ID como parâmetro na URL.
 */
export const deleteWebhook: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Delete a specific webhook by ID',
        tags: ['Webhooks'],
        params: z.object({
          id: z.string().uuid(), // Valida que o ID é um UUID
        }),
        response: {
          204: z.void(), // Sucesso, sem conteúdo
          404: z.object({ message: z.string() }), // Webhook não encontrado
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      // Deleta o webhook do banco de dados
      const result = await db
        .delete(webhooks)
        .where(eq(webhooks.id, id))
        .returning()

      // Se nenhum registro foi deletado, o webhook não existe
      if (result.length === 0) {
        return reply.status(404).send({ message: 'Webhook not found.' })
      }

      // Retorna uma resposta de sucesso sem conteúdo
      return reply.status(204).send()
    },
  )
}
