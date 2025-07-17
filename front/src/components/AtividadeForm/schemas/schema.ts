import * as z from 'zod';

export const atividadeSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  grupo: z.string().min(1, 'Grupo é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  categoriaKey: z.string().min(1, 'Área é obrigatória'),
  cargaMaximaSemestral: z
    .number({ message: 'Carga semestral deve ser um número' })
    .positive('Deve ser maior que zero')
    .max(200, 'Máximo de 200 horas'),
  cargaMaximaCurso: z
    .number({ message: 'Carga do curso deve ser um número' })
    .positive('Deve ser maior que zero')
    .max(500, 'Máximo de 500 horas')
});

export type AtividadeFormSchema = z.infer<typeof atividadeSchema>;
