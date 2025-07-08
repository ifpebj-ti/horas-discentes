import * as Types from '@/types';

export const MOCK_USER: Types.Usuario = {
  id: '1',
  name: 'Aluno',
  email: 'aluno@example.com',
  role: 'aluno',
  isNewPPC: true
};

// export const MOCK_CERTIFICATES: Types.Certificado[] = [
//   // Grupo I
//   {
//     id: '1',
//     grupo: 'I',
//     categoria: 'Categoria 2',
//     categoriaKey: 'Ensino',
//     title: 'Monitoria',
//     description: 'Monitoria',
//     cargaHoraria: 5,
//     local: 'UFPE',
//     periodoInicio: '2023-01-10',
//     periodoFim: '2023-05-10',
//     status: 'aprovado',
//     tipo: 'complementar'
//   },
//   {
//     id: 2,
//     grupo: 'I',
//     categoria: 'Categoria 4',
//     categoriaKey: 'Ensino',
//     title: 'Cursos extras realizados durante o curso',
//     description: 'Cursos extras realizados durante o curso',
//     cargaHoraria: 5,
//     local: 'UFPE',
//     periodoInicio: '2023-01-10',
//     periodoFim: '2023-05-10',
//     status: 'rejeitado',
//     tipo: 'complementar'
//   },
//   // Grupo II
//   {
//     id: 3,
//     grupo: 'II',
//     categoria: 'Categoria 7',
//     categoriaKey: 'Estagio',
//     title: 'Estágio em empresa de TI',
//     description: 'Estágio não obrigatório em empresa de TI',
//     cargaHoraria: 5,
//     local: 'Empresa X',
//     periodoInicio: '2023-03-01',
//     periodoFim: '2023-06-30',
//     status: 'aprovado',
//     tipo: 'complementar'
//   },
//   // Grupo III
//   {
//     id: 4,
//     grupo: 'III',
//     categoria: 'Categoria 8',
//     categoriaKey: 'Eventos',
//     title: 'Semana de Engenharia de Software',
//     description: 'Participação como ouvinte em eventos científicos',
//     cargaHoraria: 5,
//     local: 'IFPE - Campus Belo Jardim',
//     periodoInicio: '2023-05-14',
//     periodoFim: '2023-05-14',
//     status: 'aprovado',
//     tipo: 'complementar'
//   },
//   // Grupo IV
//   {
//     id: 5,
//     grupo: 'IV',
//     categoria: 'Categoria 9',
//     categoriaKey: 'Pesquisa',
//     title: 'Pesquisa em IA',
//     description: 'Participação em pesquisa científica',
//     cargaHoraria: 5,
//     local: 'IFPE',
//     periodoInicio: '2023-02-10',
//     periodoFim: '2023-02-10',
//     status: 'aprovado',
//     tipo: 'complementar'
//   },
//   // Grupo V
//   {
//     id: 6,
//     grupo: 'V',
//     categoria: 'Categoria 13',
//     categoriaKey: 'Curso',
//     title: 'Curso de Programação',
//     description: 'Curso de programação',
//     cargaHoraria: 5,
//     local: 'IFPE',
//     periodoInicio: '2023-04-01',
//     periodoFim: '2023-04-30',
//     status: 'aprovado',
//     tipo: 'complementar'
//   },
//   // Grupo VI
//   {
//     id: 7,
//     grupo: 'VI',
//     categoria: 'Categoria 16',
//     categoriaKey: 'Voluntariado',
//     title: 'Voluntariado em ONG',
//     description: 'Participação voluntária em ONG de apoio social',
//     cargaHoraria: 5,
//     local: 'ONG Esperança',
//     periodoInicio: '2023-04-01',
//     periodoFim: '2023-04-30',
//     status: 'aprovado',
//     tipo: 'complementar'
//   },
//   // Grupo Extensão
//   {
//     id: 8,
//     grupo: 'Extensao',
//     categoria: 'Categoria 1',
//     categoriaKey: 'Extensao',
//     title:
//       'Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão',
//     description:
//       'Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão',
//     cargaHoraria: 5,
//     local: 'IFPE',
//     periodoInicio: '2023-08-01',
//     periodoFim: '2023-08-30',
//     status: 'aprovado',
//     tipo: 'extensao'
//   },
//   {
//     id: 9,
//     grupo: 'Extensao',
//     categoria: 'Categoria 2',
//     categoriaKey: 'Extensao',
//     title:
//       'Participação como Bolsista, voluntário ou colaborador, em Projetos/Programas de Extensão coordenado por servidor do IFPE',
//     description:
//       'Participação como Bolsista, voluntário ou colaborador, em Projetos/Programas de Extensão coordenado por servidor do IFPE',
//     cargaHoraria: 5,
//     local: 'IFPE',
//     periodoInicio: '2023-09-01',
//     periodoFim: '2023-09-30',
//     status: 'aprovado',
//     tipo: 'extensao'
//   },
//   {
//     id: 10,
//     grupo: 'Extensao',
//     categoria: 'Categoria 3',
//     categoriaKey: 'Extensao',
//     title:
//       'Participação da Comissão Organizadora ou como Monitor em Eventos para exibição pública de conhecimento ou produto (Cultural, Acadêmico, Científico ou Tecnológico) desenvolvido no IFPE',
//     description:
//       'Prestação de serviços de caráter extensionista. Prestação de serviços como voluntário/a, bolsista ou colaborador/a, para o desenvolvimento de produtos e/ou processos voltados á resolução de problemas identificados interna ou externamente ao IFPE',
//     cargaHoraria: 5,
//     local: 'IFPE',
//     periodoInicio: '2023-10-01',
//     periodoFim: '2023-10-30',
//     status: 'aprovado',
//     tipo: 'extensao'
//   },
//   {
//     id: 11,
//     grupo: 'IV',
//     categoria: 'Categoria 4',
//     categoriaKey: 'Voluntariado',
//     title: 'Voluntariado em ONG',
//     description: 'Participação voluntária em ONG de apoio social',
//     cargaHoraria: 5,
//     local: 'ONG Esperança',
//     periodoInicio: '2023-04-01',
//     periodoFim: '2023-04-30',
//     status: 'pendente',
//     tipo: 'complementar'
//   }
// ];

// Categorias de Atividades Complementares
export const MOCK_CATEGORIAS_COMPLEMENTARES: Types.CategoriaProgresso[] = [
  // Grupo I
  {
    grupo: 'I',
    categoria: 'Categoria 1',
    nome: 'Disciplinas cursadas em outros cursos de graduação',
    horas: 0,
    total: 60,
    categoriaKey: 'Ensino'
  },
  {
    grupo: 'I',
    categoria: 'Categoria 2',
    nome: 'Monitoria',
    horas: 0,
    total: 80,
    categoriaKey: 'Ensino'
  },
  {
    grupo: 'I',
    categoria: 'Categoria 3',
    nome: 'Cursos de idiomas realizados durante o curso, comunicação e expressão e informática',
    horas: 0,
    total: 80,
    categoriaKey: 'Ensino'
  },
  {
    grupo: 'I',
    categoria: 'Categoria 4',
    nome: 'Participação do programa institucional de bolsas de iniciação à docência',
    horas: 0,
    total: 40,
    categoriaKey: 'Ensino'
  },
  // Grupo II
  {
    grupo: 'II',
    categoria: 'Categoria 5',
    nome: 'Visita técnica em área afim ao curso e supervisionada pela instituição, mediante apresentação de relatório.',
    horas: 0,
    total: 80,
    categoriaKey: 'Estagio'
  },
  {
    grupo: 'II',
    categoria: 'Categoria 6',
    nome: 'Estágio Profissional não obrigatório',
    horas: 0,
    total: 60,
    categoriaKey: 'Estagio'
  },
  // Grupo III
  {
    grupo: 'III',
    categoria: 'Categoria 7',
    nome: 'Participação como ouvinte, participante, palestrante, instrutor, apresentador, expositor ou mediador em eventos científicos, seminários, atividades culturais, esportivas, políticas e sociais, sessões técnicas, exposições, jornadas acadêmicas e científicas, palestras, seminários, congressos, conferências ou similares',
    horas: 0,
    total: 80,
    categoriaKey: 'Eventos'
  },
  // Grupo IV
  {
    grupo: 'IV',
    categoria: 'Categoria 8',
    nome: 'Participação em projetos de pesquisa',
    horas: 0,
    total: 80,
    categoriaKey: 'Pesquisa'
  },
  {
    grupo: 'IV',
    categoria: 'Categoria 9',
    nome: 'Publicações de textos acadêmicos',
    horas: 0,
    total: 40,
    categoriaKey: 'Pesquisa'
  },
  {
    grupo: 'IV',
    categoria: 'Categoria 10',
    nome: 'Grupos de estudos com produção intelectual',
    horas: 0,
    total: 20,
    categoriaKey: 'Pesquisa'
  },
  {
    grupo: 'IV',
    categoria: 'Categoria 11',
    nome: 'Trabalhos desenvolvidos sob orientação de docente apresentados em eventos acadêmicos',
    horas: 0,
    total: 40,
    categoriaKey: 'Pesquisa'
  },
  // Grupo V
  {
    grupo: 'V',
    categoria: 'Categoria 12',
    nome: 'Participação em projetos de extensão',
    horas: 0,
    total: 80,
    categoriaKey: 'Curso'
  },
  {
    grupo: 'V',
    categoria: 'Categoria 13',
    nome: 'Participar na organização, coordenação ou realização de cursos em eventos científicos',
    horas: 0,
    total: 40,
    categoriaKey: 'Curso'
  },
  {
    grupo: 'V',
    categoria: 'Categoria 14',
    nome: 'Trabalhar na organização de material informativo da Instituição',
    horas: 0,
    total: 20,
    categoriaKey: 'Curso'
  },
  {
    grupo: 'V',
    categoria: 'Categoria 15',
    nome: 'Trabalhar na organização ou participação em campanhas de voluntariado ou programas de ação social',
    horas: 0,
    total: 20,
    categoriaKey: 'Curso'
  },
  // Grupo VI
  {
    grupo: 'VI',
    categoria: 'Categoria 16',
    nome: 'Participação, como voluntário, em atividades compatíveis com os objetivos do curso realizadas em instituições filantrópicas e da sociedade civil organizada do terceiro setor',
    horas: 0,
    total: 20,
    categoriaKey: 'Voluntariado'
  }
];

// Categorias de Atividades Extensão
export const MOCK_CATEGORIAS_EXTENSAO: Types.CategoriaProgresso[] = [
  {
    grupo: 'Extensao',
    categoria: 'Categoria 1',
    nome: 'Participação como Bolsista, voluntário ou colaborador, em Projetos/Programas de Extensão coordenado por servidor do IFPE',
    horas: 0,
    total: 160,
    categoriaKey: 'Extensao'
  },
  {
    grupo: 'Extensao',
    categoria: 'Categoria 2',
    nome: 'Participação em Eventos voltados ao público externo como Palestrante, Instrutor, Apresentador, Expositor ou Mediador de Cursos/Palestras/Workshops/Mesas Redondas/Oficinas',
    horas: 0,
    total: 80,
    categoriaKey: 'Extensao'
  },
  {
    grupo: 'Extensao',
    categoria: 'Categoria 3',
    nome: 'Participação da Comissão Organizadora ou como Monitor em Eventos para exibição pública de conhecimento ou produto (Cultural, Acadêmico, Científico ou Tecnológico) desenvolvido no IFPE',
    horas: 0,
    total: 80,
    categoriaKey: 'Extensao'
  },
  {
    grupo: 'Extensao',
    categoria: 'Categoria 4',
    nome: 'Prestaçaõ de serviços de caráter extensionista. Prestação de serviços como voluntário/a, bolsista ou colaborador/a, para o desenvolvimento de produtos e/ou processos voltados á resolução de problemas identificados interna ou externamente ao IFPE',
    horas: 0,
    total: 160,
    categoriaKey: 'Extensao'
  },
  {
    grupo: 'Extensao',
    categoria: 'Categoria 5',
    nome: 'Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão',
    horas: 0,
    total: 80,
    categoriaKey: 'Extensao'
  },
  {
    grupo: 'Extensao',
    categoria: 'Categoria 6',
    nome: 'Atividades de empreendedorismo, como membro de empresa júnior ou como voluntário/a ou bolsista de incubadoras de empresas ou projetos, prestando assessoria e consultoria',
    horas: 0,
    total: 160,
    categoriaKey: 'Extensao'
  }
];

export const STATUS_OPTIONS: Types.OpcaoFiltro[] = [
  { value: 'all', label: 'Todos os status' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'rejeitado', label: 'Rejeitado' }
];

export const CATEGORY_OPTIONS: Types.OpcaoFiltro[] = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'Ensino', label: 'Ensino' },
  { value: 'Estagio', label: 'Estagio' },
  { value: 'Eventos', label: 'Eventos' },
  { value: 'Pesquisa', label: 'Pesquisa' },
  { value: 'Extensao', label: 'Extensao' },
  { value: 'Curso', label: 'Curso' },
  { value: 'Voluntariado', label: 'Voluntariado' }
];

export const CATEGORIES_SELECT: Types.CategoriaSelecaoForm[] = [
  { nome: 'Ensino' },
  { nome: 'Pesquisa' },
  { nome: 'Extensão' },
  { nome: 'Gestão' },
  { nome: 'Monitoria' },
  { nome: 'Iniciação Científica' }
];
