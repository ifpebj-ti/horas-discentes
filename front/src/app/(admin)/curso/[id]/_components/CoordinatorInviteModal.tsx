import React, { useState } from 'react';
import { FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { extractApiError } from '@/lib/apiError';
import { enviarConviteCoordenador } from '@/services/coordinatorService';

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
  const [confirmSend, setConfirmSend] = useState(false);

  const handleCoordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !coordEmail.endsWith('@ifpe.edu.br') &&
      !coordEmail.endsWith('.ifpe.edu.br')
    ) {
      toast.error(
        'O email do coordenador deve ser institucional (ifpe.edu.br).'
      );
      return;
    }

    setConfirmSend(true);
  };

  const executeSendInvite = async () => {
    try {
      setIsCoordLoading(true);
      await enviarConviteCoordenador({ email: coordEmail, cursoId });
      toast.success(
        `Um e-mail foi enviado para ${coordEmail} com instruções para criar a conta.`
      );
      onClose();
      setCoordEmail('');
    } catch (error) {
      toast.error(extractApiError(error, 'Não foi possível enviar o convite.'));
    } finally {
      setIsCoordLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AlertDialog open={confirmSend} onOpenChange={setConfirmSend}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar envio</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja enviar convite para {coordEmail}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeSendInvite}>
              Sim, enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  O coordenador receberá um e-mail com um link para criar a
                  conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCoordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="coord-email">Email do coordenador</Label>
                    <Input
                      id="coord-email"
                      type="email"
                      placeholder="coordenador@ifpe.edu.br"
                      value={coordEmail}
                      onChange={(e) => setCoordEmail(e.target.value)}
                      required
                      className="text-lg"
                    />
                    {coordEmail &&
                      !coordEmail.endsWith('@ifpe.edu.br') &&
                      !coordEmail.endsWith('.ifpe.edu.br') && (
                        <p className="text-sm text-red-500 font-medium">
                          O email deve ser institucional (ifpe.edu.br)
                        </p>
                      )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isCoordLoading ||
                      !coordEmail ||
                      (!coordEmail.endsWith('@ifpe.edu.br') &&
                        !coordEmail.endsWith('.ifpe.edu.br'))
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
    </>
  );
};
