export type CertificadosCategory =
  | 'academic'
  | 'research'
  | 'extension'
  | 'representation'
  | 'volunteering'
  | 'internship'
  | 'course';

export interface Certificados {
  id: string;
  title: string;
  description?: string;
  institution: string;
  hours: number;
  submissionDate: string;
  status: 'aprovado' | 'pendente' | 'rejeitado';
  category: CertificadosCategory;
}

export interface CategoryLimit {
  category: CertificadosCategory;
  maxHours: number;
  label: string;
  description: string;
}

export interface CourseRequirement {
  id: string;
  name: string;
  totalHoursRequired: number;
  categories: CategoryLimit[];
}

export const CATEGORY_INFO: Record<string, { label: string, description: string }> = {
  academic: {
    label: 'Atividades Acadêmicas',
    description: 'Participação em eventos, palestras, semanas acadêmicas e similares'
  },
  research: {
    label: 'Pesquisa',
    description: 'Participação em projetos de iniciação científica, publicações em congressos ou periódicos'
  },
  extension: {
    label: 'Extensão',
    description: 'Participação em projetos de extensão com a comunidade'
  },
  representation: {
    label: 'Representação Estudantil',
    description: 'Participação em órgãos colegiados, centros acadêmicos ou similares'
  },
  volunteering: {
    label: 'Voluntariado',
    description: 'Atividades voluntárias relacionadas à área de formação'
  },
  internship: {
    label: 'Estágio Não-obrigatório',
    description: 'Estágios realizados além do obrigatório para o curso'
  },
  course: {
    label: 'Cursos Complementares',
    description: 'Cursos adicionais relacionados à área de formação'
  },
};


export const SOFTWARE_ENGINEERING_REQUIREMENTS: CourseRequirement = {
  id: "eng-software",
  name: "Engenharia de Software",
  totalHoursRequired: 200,
  categories: [
    {
      category: "academic",
      maxHours: 60,
      label: CATEGORY_INFO.academic.label,
      description: CATEGORY_INFO.academic.description
    },
    {
      category: "research",
      maxHours: 80,
      label: CATEGORY_INFO.research.label,
      description: CATEGORY_INFO.research.description
    },
    {
      category: "extension",
      maxHours: 60,
      label: CATEGORY_INFO.extension.label,
      description: CATEGORY_INFO.extension.description
    },
    {
      category: "representation",
      maxHours: 40,
      label: CATEGORY_INFO.representation.label,
      description: CATEGORY_INFO.representation.description
    },
    {
      category: "volunteering",
      maxHours: 40,
      label: CATEGORY_INFO.volunteering.label,
      description: CATEGORY_INFO.volunteering.description
    },
    {
      category: "internship",
      maxHours: 80,
      label: CATEGORY_INFO.internship.label,
      description: CATEGORY_INFO.internship.description
    },
    {
      category: "course",
      maxHours: 60,
      label: CATEGORY_INFO.course.label,
      description: CATEGORY_INFO.course.description
    }
  ]
};
