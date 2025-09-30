import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Campo obrigatório")
    .email("Email Inválido"),
  password: z
    .string()
    .nonempty("Campo obrigatório"),
});
