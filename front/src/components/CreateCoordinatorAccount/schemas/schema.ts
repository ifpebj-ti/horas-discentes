import { z } from 'zod';

export const createCoordinatorSchema = z
  .object({
    nome: z.string().min(1, 'Nome obrigatório'),
    portaria: z.string().min(1, 'Número da Portaria obrigatório'),
    dou: z.string().min(1, 'DOU obrigatório'),
    senha: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
      .regex(/[a-z]/, 'Deve conter ao menos uma letra minúscula')
      .regex(/[0-9]/, 'Deve conter ao menos um número')
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-\]]/,
        'Deve conter ao menos um caractere especial'
      ),
    confirmarSenha: z.string().min(1, 'Confirme sua senha')
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha']
  });

export type CreateCoordinatorSchema = z.infer<typeof createCoordinatorSchema>;
