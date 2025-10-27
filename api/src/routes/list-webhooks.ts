// import { db } from "@/db";
// import { webhooks } from "@/db/schema";
// import { desc } from "drizzle-orm";
// import { lt } from "drizzle-orm";
// import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/webhooks",
    {
      schema: {
        summary: "List webhooks",
        tags: ["Webhooks"],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              method: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { limit } = request.query;

      //   const result = await db
      //     .select({
      //       id: webhooks.id,
      //       method: webhooks.method,
      //       pathname: webhooks.pathname,
      //       createdAt: webhooks.createdAt,
      //     })
      //     .from(webhooks)
      //     .where(cursor ? lt(webhooks.id, cursor) : undefined)
      //     .orderBy(desc(webhooks.id))
      //     .limit(limit + 1);

      //   const hasMore = result.length > limit;
      //   const items = hasMore ? result.slice(0, limit) : result;
      //   const nextCursor = hasMore ? items[items.length - 1].id : null;

      //   return reply.send({
      //     webhooks: items,
      //     nextCursor,
      //   });

      return [
        {
          id: "1",
          method: "POST",
        },
      ];
    }
  );
};
