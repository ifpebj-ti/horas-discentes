export interface LoginResponseDto {
  nome: string;
  email: string;
  role: 'ADMIN' | 'COORDENADOR' | 'ALUNO';
  token: string;
}
