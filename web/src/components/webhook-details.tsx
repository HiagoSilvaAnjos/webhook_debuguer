import { useQuery } from '@tanstack/react-query'
import { webhookDetailsSchema } from '../http/schemas/webhooks'
import { WebhookDetailHeader } from './webhook-detail-header'
import { SectionTitle } from './section-title'
import { SectionDataTable } from './section-data-table'
import { CodeBlock } from './ui/code-block'

interface WebhookDetailsProps {
  id: string
}

export function WebhookDetails({ id }: WebhookDetailsProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['webhook', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Webhook não encontrado.')
        }
        throw new Error('Falha ao buscar os detalhes do webhook.')
      }

      const data = await response.json()

      // O parse do Zod também pode lançar um erro, que o useQuery vai capturar
      return webhookDetailsSchema.parse(data)
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <p className="text-zinc-400">Carregando detalhes do webhook...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="rounded border border-red-500/30  p-6 text-center">
          <h1 className="text-xl font-medium text-red-400">
            Ocorreu um erro
          </h1>
          <p className="text-zinc-400">
            {error.message ||
              'Não foi possível carregar os detalhes deste webhook.'}
          </p>
        </div>
      </div>
    )
  }

  // Se não estiver em isLoading ou isError, 'data' com certeza existe.
  // O restante do seu código funciona normalmente.
  const overviewData = [
    { key: 'Method', value: data!.method },
    { key: 'Status Code', value: String(data!.statusCode) },
    { key: 'Content-Type', value: data!.contentType || 'application/json' },
    { key: 'Content-Length', value: `${data!.contentLength || 0} bytes` },
  ]

  const headers = Object.entries(data!.headers).map(([key, value]) => {
    return { key, value: String(value) }
  })

  const queryParams = Object.entries(data?.queryParams || {}).map(
    ([key, value]) => {
      return { key, value: String(value) }
    },
  )

  return (
    <div className="flex h-full flex-col">
      <WebhookDetailHeader
        method={data!.method}
        pathname={data!.pathname}
        ip={data!.ip}
        createdAt={data!.createdAt}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={headers} />
          </div>

          {queryParams.length > 0 && (
            <div className="space-y-4">
              <SectionTitle>Query Parameters</SectionTitle>
              <SectionDataTable data={queryParams} />
            </div>
          )}

          {!!data!.body && (
            <div className="space-y-4">
              <SectionTitle>Request Body</SectionTitle>
              <CodeBlock code={data!.body} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
