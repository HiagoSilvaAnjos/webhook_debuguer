import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { db } from '@/db'

/**
 * Rota genérica para capturar qualquer requisição webhook.
 * Escuta em `/capture/*` e armazena todos os detalhes da requisição no banco de dados.
 * Isso permite que qualquer webhook enviado para este endpoint seja registrado e inspecionado.
 */
export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
  // Define uma rota que aceita todos os métodos HTTP (`.all`)
  app.all(
    '/capture/*',
    {
      schema: {
        summary: 'Capture incoming webhook requests',
        tags: ['External'],
        hide: true, // Esconde esta rota da documentação principal da API
        response: {
          201: z.object({ id: z.string() }), // Retorna o ID do webhook criado
        },
      },
    },
    async (request, reply) => {
      // Extrai informações da requisição
      const method = request.method
      const ip = request.ip
      const contentType = request.headers['content-type']
      const contentLength = request.headers['content-length']
        ? Number(request.headers['content-length'])
        : null

      let body: string | null = null

      // Garante que o corpo da requisição seja armazenado como texto
      if (request.body) {
        body =
          typeof request.body === 'string'
            ? request.body
            : JSON.stringify(request.body, null, 2)
      }

      // Extrai o caminho da URL, removendo o prefixo `/capture`
      const pathname = new URL(
        `http://localhost${request.url}`,
      ).pathname.replace('/capture', '')

      // Formata os cabeçalhos para serem armazenados como um objeto de strings
      const headers = Object.fromEntries(
        Object.entries(request.headers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : value || '',
        ]),
      )

      // Insere o novo webhook no banco de dados
      const result = await db
        .insert(webhooks)
        .values({
          method,
          ip,
          contentType,
          contentLength,
          body,
          headers,
          pathname,
        })
        .returning()

      // Retorna o ID do webhook recém-criado com o status 201 (Created)
      return reply.status(201).send({ id: result[0].id })
    },
  )
}
