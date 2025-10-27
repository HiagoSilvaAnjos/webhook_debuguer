/**
 * Este arquivo é responsável por popular o banco de dados com dados fictícios de webhooks do Stripe.
 * Utiliza a biblioteca Faker para gerar dados aleatórios mas realistas.
 * Os webhooks gerados simulam diferentes eventos do Stripe, como pagamentos, faturas e clientes.
 */

import { faker } from "@faker-js/faker";
import { db } from ".";
import { webhooks } from "./schema";

// Lista de eventos possíveis do Stripe que serão simulados
const stripeEvents = [
  "charge.succeeded",
  "charge.failed",
  "charge.refunded",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.created",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.created",
  "invoice.finalized",
  "customer.created",
  "customer.updated",
  "customer.deleted",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "checkout.session.completed",
  "checkout.session.expired",
  "payment_method.attached",
  "payment_method.detached",
];

/**
 * Função que gera um webhook simulado do Stripe
 * Cria dados aleatórios mas realistas que seguem a estrutura oficial do Stripe
 * Inclui informações como:
 * - Tipo do evento (pagamento, fatura, etc)
 * - Valores monetários
 * - IDs no formato do Stripe
 * - Headers típicos de uma requisição do Stripe
 */
function generateStripeWebhook() {
  // Seleciona aleatoriamente um tipo de evento da lista
  const eventType = faker.helpers.arrayElement(stripeEvents);
  // Gera um valor aleatório entre 10.00 e 500.00
  const amount = faker.number.int({ min: 1000, max: 50000 });
  // Seleciona uma moeda aleatória
  const currency = faker.helpers.arrayElement(["usd", "eur", "brl"]);

  // Estrutura do corpo do webhook seguindo o formato oficial do Stripe
  const body = {
    id: `evt_${faker.string.alphanumeric(24)}`,
    object: "event",
    api_version: "2023-10-16",
    created: faker.date.recent({ days: 30 }).getTime() / 1000,
    type: eventType,
    data: {
      object: {
        id: eventType.includes("charge")
          ? `ch_${faker.string.alphanumeric(24)}`
          : eventType.includes("payment_intent")
          ? `pi_${faker.string.alphanumeric(24)}`
          : eventType.includes("invoice")
          ? `in_${faker.string.alphanumeric(24)}`
          : eventType.includes("customer")
          ? `cus_${faker.string.alphanumeric(14)}`
          : `cs_${faker.string.alphanumeric(24)}`,
        object: eventType.split(".")[0],
        amount: amount,
        currency: currency,
        customer: `cus_${faker.string.alphanumeric(14)}`,
        description: faker.company.catchPhrase(),
        status: eventType.includes("failed") ? "failed" : "succeeded",
        receipt_email: faker.internet.email(),
      },
    },
  };

  // Headers típicos do Stripe
  const headers = {
    "content-type": "application/json",
    "stripe-signature": `t=${Math.floor(
      Date.now() / 1000
    )},v1=${faker.string.alphanumeric(64)}`,
    "user-agent": "Stripe/1.0 (+https://stripe.com/docs/webhooks)",
    accept: "*/*",
    "accept-encoding": "gzip, deflate",
    "x-stripe-client-user-agent": JSON.stringify({
      bindings_version: "10.0.0",
      lang: "node",
      lang_version: "18.0.0",
      platform: "linux",
      publisher: "stripe",
    }),
  };

  const bodyString = JSON.stringify(body, null, 2);

  return {
    method: "POST",
    pathname: "/webhooks/stripe",
    ip: faker.internet.ipv4(),
    statusCode: faker.helpers.arrayElement([200, 200, 200, 200, 500]), // Maioria 200
    contentType: "application/json",
    contentLength: Buffer.byteLength(bodyString),
    queryParams: null,
    headers: headers,
    body: bodyString,
    createdAt: faker.date.recent({ days: 30 }),
  };
}

/**
 * Função principal que popula o banco de dados
 * Realiza os seguintes passos:
 * 1. Limpa todos os webhooks existentes
 * 2. Gera 60 novos webhooks
 * 3. Ordena os webhooks por data
 * 4. Insere os dados no banco
 */
async function seed() {
  console.log("🌱 Populando o banco de dados...");

  // Limpa todos os webhooks existentes
  await db.delete(webhooks);

  // Gera 60 webhooks simulados
  const webhooksData = Array.from({ length: 60 }, () =>
    generateStripeWebhook()
  );

  // Ordena os webhooks por data de criação (do mais antigo para o mais recente)
  // Isso cria uma linha do tempo mais realista dos eventos
  webhooksData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Insere todos os webhooks no banco de dados
  await db.insert(webhooks).values(webhooksData);

  console.log(
    "✅ Banco de dados populado com sucesso! 60 webhooks do Stripe foram criados!"
  );
}

seed()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
