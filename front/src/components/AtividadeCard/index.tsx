import { FaRegClock, FaBookOpen, FaUsers } from 'react-icons/fa';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AtividadeResponse } from '@/services/atividadeService';

interface AtividadeCardProps {
  atividade: AtividadeResponse;
}

export function AtividadeCard({ atividade }: AtividadeCardProps) {
  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-tight">
            {atividade.nome}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {atividade.grupo}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <FaBookOpen className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Categoria</p>
              <p className="text-sm text-primary">{atividade.categoria}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaUsers className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Área</p>
              <p className="text-sm text-primary">{atividade.categoriaKey}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <FaRegClock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Carga Semestral</p>
              <p className="text-sm font-semibold text-primary">
                {atividade.cargaMaximaSemestral}h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaRegClock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Carga do Curso</p>
              <p className="text-sm font-semibold text-primary">
                {atividade.cargaMaximaCurso}h
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
