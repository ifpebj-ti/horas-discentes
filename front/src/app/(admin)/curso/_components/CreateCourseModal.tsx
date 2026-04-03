import React, { useState } from 'react';
import { FaGraduationCap, FaTimes } from 'react-icons/fa';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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

import { CreateCursoRequest, criarCurso } from '@/services/courseService';
import { toast } from 'react-toastify';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCourseModal = ({
  isOpen,
  onClose,
  onSuccess
}: CreateCourseModalProps) => {
  const [newCourseName, setNewCourseName] = useState('');
  const [complementaryHours, setComplementaryHours] = useState('');
  const [extensionHours, setExtensionHours] = useState('');
  const [hasExtension, setHasExtension] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [confirmCreate, setConfirmCreate] = useState(false);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCourseName.trim()) {
      toast.error('O nome do curso é obrigatório.');
      return;
    }

    setConfirmCreate(true);
  };

  const executeCreateCourse = async () => {
    try {
      setLoading(true);

      const payload: CreateCursoRequest = {
        nomeCurso: newCourseName,
        maximoHorasComplementar: Number(complementaryHours),
        ...(hasExtension ? { maximoHorasExtensao: Number(extensionHours) } : {})
      };

      await criarCurso(payload);

      toast.success(`O curso "${newCourseName}" foi criado com sucesso.`);

      onSuccess();
      onClose();
      setNewCourseName('');
      setComplementaryHours('');
      setExtensionHours('');
      setHasExtension(false);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      toast.error('Não foi possível criar o curso.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AlertDialog open={confirmCreate} onOpenChange={setConfirmCreate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja criar o curso &quot;{newCourseName}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeCreateCourse}>
              Sim, criar
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
                  <FaGraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Adicionar Novo Curso</CardTitle>
                <CardDescription>
                  Preencha todos os campos para criar um novo curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCourse} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="courseName" className="block font-medium">
                      Nome do curso
                    </label>
                    <input
                      id="courseName"
                      type="text"
                      placeholder="Nome do curso"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="complementaryHours"
                      className="block font-medium"
                    >
                      Total de Horas Complementares
                    </label>
                    <input
                      id="complementaryHours"
                      type="number"
                      placeholder="Horas complementares"
                      value={complementaryHours}
                      onChange={(e) => setComplementaryHours(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">
                      Este curso tem carga horária de extensão?
                    </p>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="hasExtension"
                          value="sim"
                          checked={hasExtension === true}
                          onChange={() => setHasExtension(true)}
                          className="accent-blue-600"
                        />
                        <span>Sim</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="hasExtension"
                          value="nao"
                          checked={hasExtension === false}
                          onChange={() => setHasExtension(false)}
                          className="accent-blue-600"
                        />
                        <span>Não</span>
                      </label>
                    </div>
                  </div>

                  {hasExtension && (
                    <div className="space-y-2">
                      <label
                        htmlFor="extensionHours"
                        className="block font-medium"
                      >
                        Horas de Extensão
                      </label>
                      <input
                        id="extensionHours"
                        type="number"
                        placeholder="Horas de extensão"
                        value={extensionHours}
                        onChange={(e) => setExtensionHours(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !newCourseName.trim() ||
                      !complementaryHours.trim() ||
                      (hasExtension && !extensionHours.trim())
                    }
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Criando...' : 'Criar Curso'}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
