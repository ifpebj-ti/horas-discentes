import { z } from 'zod';

export const firstAccessSchema = z
  .object({
    nome: z.string().min(1, 'Nome obrigatório'),
    email: z
      .string()
      .email('Email inválido')
      .refine((email) => email.endsWith('@discente.ifpe.edu.br'), {
        message: 'Use seu email institucional (@discente.ifpe.edu.br)'
      }),
    matricula: z
      .string()
      .length(13, 'A matrícula deve ter exatamente 13 caracteres')
      .regex(
        /^.{4}[12].{4}\d{4}$/,
        'Matrícula inválida. Exemplo: 20231ewbj2157 (5º dígito: 1 ou 2, últimos 4: números)'
      ),
    senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme sua senha')
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha']
  });

export type FirstAccessSchema = z.infer<typeof firstAccessSchema>;
