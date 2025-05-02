import { z } from 'zod'

export const CreatePollSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  options: z.array(z.string().min(1, 'Opção vazia')).min(2, 'É necessário pelo menos duas opções'),
  expiresAt: z.coerce.date().optional()
})

export const VotePollSchema = z.object({
  optionIndex: z.number().int().nonnegative('O índice da opção deve ser um número positivo')
})

export const PollIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'ID inválido (esperado formato de ObjectId)')
})

export const PollListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  title: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional()
})
