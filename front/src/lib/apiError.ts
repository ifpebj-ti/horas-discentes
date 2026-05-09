export function extractApiError(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: Record<string, string> } })
    ?.response?.data;
  return data?.erro ?? data?.mensagem ?? data?.message ?? fallback;
}
