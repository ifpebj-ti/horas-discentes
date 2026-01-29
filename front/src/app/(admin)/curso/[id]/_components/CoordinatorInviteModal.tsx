import React, { useState } from 'react';
import { FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { COLORS } from '@/config/colors';
import { enviarConviteCoordenador } from '@/services/coordenadorService';

interface CoordinatorInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cursoId: string;
}

export const CoordinatorInviteModal = ({
  isOpen,
  onClose,
  cursoId
}: CoordinatorInviteModalProps) => {
  const [coordEmail, setCoordEmail] = useState('');
  const [isCoordLoading, setIsCoordLoading] = useState(false);

  const handleCoordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coordEmail.endsWith('@docente.ifpe.edu.br')) {
      Swal.fire(
        'Erro',
        'O email do coordenador deve ser institucional (@docente.ifpe.edu.br).',
        'error'
      );
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Confirmar envio',
      text: `Deseja enviar convite para ${coordEmail}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLORS.primary,
      cancelButtonColor: COLORS.danger
    });

    if (!confirmation.isConfirmed) return;

    try {
      setIsCoordLoading(true);
      await enviarConviteCoordenador({ email: coordEmail, cursoId });
      await Swal.fire({
        title: 'Convite enviado!',
        text: `Um e-mail foi enviado para ${coordEmail} com instruções para criar a conta.`,
        icon: 'success',
        confirmButtonColor: COLORS.primary
      });
      onClose(); 
      setCoordEmail(''); 
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Não foi possível enviar o convite.', 'error');
    } finally {
      setIsCoordLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-auto max-h-full w-full max-w-2xl p-7 relative">
        <button
          className="absolute top-0 mt-1 mb-1 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Convite por E-mail</CardTitle>
              <CardDescription>
                O coordenador receberá um e-mail com um link para criar a conta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCoordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="coord-email">Email do coordenador</Label>
                  <Input
                    id="coord-email"
                    type="email"
                    placeholder="coordenador@docente.ifpe.edu.br"
                    value={coordEmail}
                    onChange={(e) => setCoordEmail(e.target.value)}
                    required
                    className="text-lg"
                  />
                  {coordEmail &&
                    !coordEmail.endsWith('@docente.ifpe.edu.br') && (
                      <p className="text-sm text-red-500 font-medium">
                        O email deve ser institucional (@docente.ifpe.edu.br)
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isCoordLoading ||
                    !coordEmail ||
                    !coordEmail.endsWith('@docente.ifpe.edu.br')
                  }
                >
                  {isCoordLoading ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <FaPaperPlane className="w-4 h-4 mr-2" />
                      Enviar convite
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              O que acontece depois?
            </h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• O coordenador receberá um e-mail com link de ativação</li>
              <li>• Ele poderá criar sua conta com dados completos</li>
              <li>• Após ativação, terá acesso ao sistema</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
