import React, { useState } from 'react';
import { FaGraduationCap, FaPlus, FaTimes } from 'react-icons/fa';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { COLORS } from '@/config/colors';
import { criarTurma } from '@/services/classService';
import Swal from 'sweetalert2';

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

  const handleTurmaChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTurmaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.periodo ||
      !formData.turno ||
      !formData.cargaHorariaExtensao
    ) {
      Swal.fire('Erro', 'Preencha todos os campos corretamente.', 'error');
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Confirmar criação',
      text: `Deseja criar a turma ${formData.periodo} (${formData.turno})?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, criar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLORS.primary,
      cancelButtonColor: COLORS.danger
    });

    if (!confirmation.isConfirmed) return;

    try {
      setIsTurmaLoading(true);
      await criarTurma({
        periodo: formData.periodo,
        turno: formData.turno,
        possuiExtensao: formData.cargaHorariaExtensao === 'sim',
        cursoId
      });

      await Swal.fire({
        title: 'Turma criada!',
        text: `Turma ${formData.periodo} (${formData.turno}) foi criada.`,
        icon: 'success',
        confirmButtonColor: COLORS.primary
      });

      onSuccess();
      onClose();
      setFormData({
        periodo: '',
        turno: '',
        cargaHorariaExtensao: ''
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Não foi possível criar a turma.', 'error');
    } finally {
      setIsTurmaLoading(false);
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
                    onValueChange={(value) => handleTurmaChange('turno', value)}
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
                  {isTurmaLoading ? (
                    <>Criando turma...</>
                  ) : (
                    <>
                      <FaPlus className="w-4 h-4 mr-2" />
                      Criar turma
                    </>
                  )}
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
        </div>
      </div>
    </div>
  );
};
