import React, { useState } from 'react';
import { FaGraduationCap, FaTimes, FaCopy, FaCheck } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { criarTurma } from '@/services/classService';
import { toast } from 'react-toastify';

interface CreateTurmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cursoId: string;
}

export const CreateTurmaModal = ({
  isOpen,
  onClose,
  onSuccess,
  cursoId
}: CreateTurmaModalProps) => {
  const [formData, setFormData] = useState({
    periodo: '',
    turno: '',
    cargaHorariaExtensao: ''
  });
  const [isTurmaLoading, setIsTurmaLoading] = useState(false);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [createdCodigo, setCreatedCodigo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTurmaChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTurmaSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.periodo ||
      !formData.turno ||
      !formData.cargaHorariaExtensao
    ) {
      toast.error('Preencha todos os campos corretamente.');
      return;
    }

    setConfirmCreate(true);
  };

  const handleCopy = () => {
    if (createdCodigo) {
      navigator.clipboard.writeText(createdCodigo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.info('Código copiado!');
    }
  };

  const executeCreateTurma = async () => {
    try {
      setIsTurmaLoading(true);
      const response = await criarTurma({
        periodo: formData.periodo,
        turno: formData.turno,
        possuiExtensao: formData.cargaHorariaExtensao === 'sim',
        cursoId
      });

      setCreatedCodigo(response.codigo);
      toast.success(`Turma ${formData.periodo} (${formData.turno}) foi criada.`);

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível criar a turma.');
    } finally {
      setIsTurmaLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ periodo: '', turno: '', cargaHorariaExtensao: '' });
    setCreatedCodigo(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <AlertDialog open={confirmCreate} onOpenChange={setConfirmCreate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar criação</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja criar a turma {formData.periodo} ({formData.turno})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeCreateTurma}>
              Sim, criar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg overflow-auto max-h-full w-full max-w-2xl p-7 relative">
          <button
            className="absolute top-0 mt-1 mb-1 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={handleClose}
          >
            <FaTimes className="w-6 h-6" />
          </button>

          <div className="max-w-2xl mx-auto space-y-8">
            {!createdCodigo ? (
              <>
                <Card>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaGraduationCap className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle>Informações da Turma</CardTitle>
                    <CardDescription>
                      Preencha todos os campos para criar uma nova turma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTurmaSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="periodo">Período da turma</Label>
                        <Input
                          id="periodo"
                          type="text"
                          placeholder="Ex: 2025.1"
                          value={formData.periodo}
                          onChange={(e) =>
                            handleTurmaChange('periodo', e.target.value)
                          }
                          required
                        />
                        <p className="text-sm text-gray-500">
                          Formato sugerido: AAAA.S (ano.semestre)
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Label>Essa turma tem carga horária de extensão?</Label>
                        <RadioGroup
                          value={formData.cargaHorariaExtensao}
                          onValueChange={(value) =>
                            handleTurmaChange('cargaHorariaExtensao', value)
                          }
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sim" id="sim" />
                            <Label htmlFor="sim">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nao" id="nao" />
                            <Label htmlFor="nao">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="turno">Turno</Label>
                        <Select
                          value={formData.turno}
                          onValueChange={(value) =>
                            handleTurmaChange('turno', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o turno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manha">Manhã</SelectItem>
                            <SelectItem value="tarde">Tarde</SelectItem>
                            <SelectItem value="noite">Noite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          isTurmaLoading ||
                          !formData.periodo ||
                          !formData.cargaHorariaExtensao ||
                          !formData.turno
                        }
                      >
                        {isTurmaLoading ? <>Criando turma...</> : <>Criar turma</>}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Próximos passos
                  </h3>
                  <ul className="text-purple-700 space-y-1 text-sm">
                    <li>• Após criar a turma, você receberá um código único</li>
                    <li>• Use este código para que alunos se inscrevam na turma</li>
                    <li>• Você poderá gerenciar alunos e acompanhar progresso</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FaCheck className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Turma criada!</h2>
                  <p className="text-gray-600 mt-2">
                    Compartilhe este código com seus alunos para que eles possam se cadastrar na turma {formData.periodo}.
                  </p>
                </div>

                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 max-w-sm mx-auto relative group">
                  <span className="text-4xl font-mono font-bold tracking-widest text-[#1351B4]">
                    {createdCodigo}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-[#1351B4] transition-colors"
                    title="Copiar código"
                  >
                    {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                  </button>
                </div>

                <Button onClick={handleClose} className="w-full max-w-sm">
                  Concluir
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
