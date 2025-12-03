import api from './api';

export interface UpdateAdminRequest {
  email?: string;
  senha?: string;
  senhaAtual?: string;
}

// Atualizar dados do próprio admin autenticado
export const atualizarMeusDados = async (
  dados: UpdateAdminRequest
): Promise<void> => {
  await api.put('/Admin/me', dados);
};

