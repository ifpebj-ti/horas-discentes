import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    senha: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
      .regex(/[a-z]/, 'Deve conter ao menos uma letra minúscula')
      .regex(/[0-9]/, 'Deve conter ao menos um número')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Deve conter ao menos um caractere especial'
      ),
    confirmarSenha: z.string()
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha']
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
