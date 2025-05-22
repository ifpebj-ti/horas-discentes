'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, createContext } from 'react';

import Header from '@/components/Header';
import { User } from 'next-auth';

interface LayoutProps {
  children: ReactNode;
  user: User;
};

const user = {
  id: '1',
  name: 'Aluno',
  email: 'aluno@example.com',
  role: 'aluno',
  isNewPPC: true
};

export const CertificadosContext = createContext<any[]>([]);

export const MOCK_CERTIFICATES = [
  // Grupo I
  {
    id: 1,
    grupo: 'I',
    categoria: 'Categoria 2',
    categoriaKey: 'Ensino',
    title: 'Monitoria',
    description: 'Monitoria',
    cargaHoraria: 5,
    local: 'UFPE',
    periodoInicio: '2023-01-10',
    periodoFim: '2023-05-10',
    status: 'aprovado',
    tipo: 'complementar'
  },
  {
    id: 2,
    grupo: 'I',
    categoria: 'Categoria 4',
    categoriaKey: 'Ensino',
    title: 'Cursos extras realizados durante o curso',
    description: 'Cursos extras realizados durante o curso',
    cargaHoraria: 5,
    local: 'UFPE',
    periodoInicio: '2023-01-10',
    periodoFim: '2023-05-10',
    status: 'aprovado',
    tipo: 'complementar'
  },
  // Grupo II
  {
    id: 3,
    grupo: 'II',
    categoria: 'Categoria 7',
    categoriaKey: 'Estagio',
    title: 'Estágio em empresa de TI',
    description: 'Estágio não obrigatório em empresa de TI',
    cargaHoraria: 5,
    local: 'Empresa X',
    periodoInicio: '2023-03-01',
    periodoFim: '2023-06-30',
    status: 'aprovado',
    tipo: 'complementar'
  },
  // Grupo III
  {
    id: 4,
    grupo: 'III',
    categoria: 'Categoria 8',
    categoriaKey: 'Eventos',
    title: 'Semana de Engenharia de Software',
    description: 'Participação como ouvinte em eventos científicos',
    cargaHoraria: 5,
    local: 'IFPE - Campus Belo Jardim',
    periodoInicio: '2023-05-14',
    periodoFim: '2023-05-14',
    status: 'aprovado',
    tipo: 'complementar'
  },
  // Grupo IV
  {
    id: 5,
    grupo: 'IV',
    categoria: 'Categoria 9',
    categoriaKey: 'Pesquisa',
    title: 'Pesquisa em IA',
    description: 'Participação em pesquisa científica',
    cargaHoraria: 5,
    local: 'IFPE',
    periodoInicio: '2023-02-10',
    periodoFim: '2023-02-10',
    status: 'aprovado',
    tipo: 'complementar'
  },
  // Grupo V
  {
    id: 6,
    grupo: 'V',
    categoria: 'Categoria 13',
    categoriaKey: 'Curso',
    title: 'Curso de Programação',
    description: 'Curso de programação',
    cargaHoraria: 5,
    local: 'IFPE',
    periodoInicio: '2023-04-01',
    periodoFim: '2023-04-30',
    status: 'aprovado',
    tipo: 'complementar'
  },
  // Grupo VI
  {
    id: 7,
    grupo: 'VI',
    categoria: 'Categoria 16',
    categoriaKey: 'Voluntariado',
    title: 'Voluntariado em ONG',
    description: 'Participação voluntária em ONG de apoio social',
    cargaHoraria: 5,
    local: 'ONG Esperança',
    periodoInicio: '2023-04-01',
    periodoFim: '2023-04-30',
    status: 'aprovado',
    tipo: 'complementar'
  },
  // Grupo Extensão
  {
    id: 8,
    grupo: 'Extensao',
    categoria: 'Categoria 1',
    categoriaKey: 'Extensao',
    title: 'Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão',
    description: 'Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão',
    cargaHoraria: 5,
    local: 'IFPE',
    periodoInicio: '2023-08-01',
    periodoFim: '2023-08-30',
    status: 'aprovado',
    tipo: 'extensao'
  },
  {
    id: 9,
    grupo: 'Extensao',
    categoria: 'Categoria 2',
    categoriaKey: 'Extensao',
    title: 'Participação como Bolsista, voluntário ou colaborador, em Projetos/Programas de Extensão coordenado por servidor do IFPE',
    description: 'Participação como Bolsista, voluntário ou colaborador, em Projetos/Programas de Extensão coordenado por servidor do IFPE',
    cargaHoraria: 5,
    local: 'IFPE',
    periodoInicio: '2023-09-01',
    periodoFim: '2023-09-30',
    status: 'aprovado',
    tipo: 'extensao'
  },
  {
    id: 10,
    grupo: 'Extensao',
    categoria: 'Categoria 3',
    categoriaKey: 'Extensao',
    title: 'Participação da Comissão Organizadora ou como Monitor em Eventos para exibição pública de conhecimento ou produto (Cultural, Acadêmico, Científico ou Tecnológico) desenvolvido no IFPE',
    description: 'Prestação de serviços de caráter extensionista. Prestação de serviços como voluntário/a, bolsista ou colaborador/a, para o desenvolvimento de produtos e/ou processos voltados á resolução de problemas identificados interna ou externamente ao IFPE',
    cargaHoraria: 5,
    local: 'IFPE',
    periodoInicio: '2023-10-01',
    periodoFim: '2023-10-30',
    status: 'aprovado',
    tipo: 'extensao'
  }
];

const getTitleFromPath = (path: string): string => {
  const lastSegment = path.split('/').filter(Boolean).pop() ?? '';

  switch (lastSegment) {
    case 'aluno':
      return 'Aluno';
    case 'novo':
      return 'Novo Certificado';
    case 'certificado':
      return 'Visualizar Certificados';
    default:
      return 'Início';
  }
};

export default function AlunoLayout({ children }: Readonly<LayoutProps>) {
  const pathname = usePathname();
  const menuTitle = getTitleFromPath(pathname);

  return (
    <CertificadosContext.Provider value={MOCK_CERTIFICATES}>
      <div className="min-h-screen bg-white text-black">
        <header className="shadow-md bg-gray-100 z-20 relative">
          <Header menuTitle={menuTitle} user={user} />
        </header>
        <main>{children}</main>
        {/* FOOTER -------------------------------------------------------------- */}
        <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
          IFPE - Campus Belo Jardim
          <br />
            Endereço: Av. Sebastião Rodrigues da Costa, s/n - São Pedro, Belo Jardim - PE, 55145-065
          <br />
            Telefone: (81) 3411-3200
          <br />
          © 2025 Desenvolvido por Erimilson Silva.
        </footer>
      </div>
    </CertificadosContext.Provider>
  );
}
