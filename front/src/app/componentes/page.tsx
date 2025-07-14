'use client';
import { useState } from 'react';
import { FaChalkboardTeacher, FaGraduationCap, FaIdCard } from 'react-icons/fa';
import { FiSend, FiMapPin, FiClock, FiCalendar } from 'react-icons/fi';

import { CertificateDetailsCard } from '@/components/CertificateDetailsCard';
import CourseCard from '@/components/CourseCard';
import { DashboardCard } from '@/components/DashboardCard';
import { FileUploadInput } from '@/components/FileUploadInput';
import { ParticipationOrigin } from '@/components/ParticipationOrigin';
import { RoundedButton } from '@/components/RoundedButton';
import { StatusBadge } from '@/components/StatusBadge';
import { UserCard } from '@/components/UserCard';

import Swal from 'sweetalert2';
const certificado = {
  name: 'João Silva',
  registration: '20221ESOFT0001',
  phone: '(81) 99999-9999',
  email: 'joao.silva@estudante.ifpe.edu.br',
  activity: 'Curso de React',
  category: 'course',
  description: 'Curso online de React com duração de 40 horas',
  location: 'IFPE - Campus Belo Jardim',
  date: '01/03/2024 a 15/03/2024',
  workload: '40 horas'
};
const userCard = [
  {
    name: 'João Silva',
    registration: '20221ESOFT0001',
    totalHours: 120,
    status: 'em progresso' as const
  },
  {
    name: 'Maria Santos',
    registration: '20221ESOFT0002',
    totalHours: 200,
    status: 'concluido' as const
  },
  {
    name: 'Carlos Lima',
    registration: '20221ESOFT0003',
    totalHours: 80,
    status: 'em progresso' as const
  }
];
export default function Componentes() {
  const [file, setFile] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Motivo obrigatório',
        text: 'Informe o motivo da rejeição antes de continuar.',
        confirmButtonColor: '#f87171'
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Rejeitado com sucesso!',
      text: `Motivo: ${rejectionReason}`,
      confirmButtonColor: '#f87171'
    });

    setRejectionReason(''); // limpar
  };

  const handleApprove = () => {
    Swal.fire({
      icon: 'success',
      title: 'Aprovado com sucesso!',
      confirmButtonColor: '#1351B4'
    });
  };

  const handleSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gray-50">
      <h1 className="text-2xl font-bold">Exemplos de Componentes</h1>

      {/* Botões */}
      <div className="flex flex-col items-center gap-4">
        <p className="font-semibold">Botão com ícone</p>
        <RoundedButton
          text="Enviar"
          icon={<FiSend />}
          bgColor="bg-blue-700"
          textColor="text-white"
          onClick={() => alert('Botão com ícone')}
        />

        <p className="font-semibold mt-6">Botão sem ícone</p>
        <RoundedButton
          text="Continuar"
          bgColor="bg-green-600"
          textColor="text-white"
          onClick={() => alert('Botão sem ícone')}
        />
      </div>

      {/* Badges */}
      <div className="flex flex-col items-center gap-4 mt-12">
        <p className="font-semibold">Badges com status</p>
        <div className="flex gap-4 flex-wrap">
          <StatusBadge status="aprovado" />
          <StatusBadge status="pendente" />
          <StatusBadge status="rejeitado" />
        </div>

        <p className="font-semibold mt-6">Badge padrão (sem status)</p>
        <StatusBadge />
        <StatusBadge defaultText="Outro Texto" />
      </div>
      {/* Origem da Participação */}
      <div className="flex flex-col items-center gap-4 mt-12">
        <p className="font-semibold">Origem da Participação</p>
        <div className="flex gap-4 flex-wrap">
          <ParticipationOrigin
            origin="IFPE - Campus Belo Jardim"
            icon={<FiMapPin className="text-gray-400" />}
          />
          <ParticipationOrigin
            origin="20 Horas"
            icon={<FiClock className="text-gray-400" />}
          />
          <ParticipationOrigin
            origin="27/10/1998"
            icon={<FiCalendar className="text-gray-400" />}
          />
        </div>
      </div>
      {/* inputfile */}
      <div className="flex flex-col items-center gap-4 mt-12">
        <p className="font-semibold">Input File</p>
        <div className="flex gap-4 flex-wrap">
          <FileUploadInput
            file={file}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
        </div>
      </div>
      {/* Cartão de Detalhes do Certificado */}
      <div className="flex flex-col items-center gap-4 mt-12">
        <p className="font-semibold">Cartão de Detalhes do Certificado</p>
        <div className="flex gap-4 flex-wrap">
          <CertificateDetailsCard
            name={certificado.name}
            registration={certificado.registration}
            email={certificado.email}
            activity={certificado.activity}
            category={certificado.category}
            description={certificado.description}
            location={certificado.location}
            date={certificado.date}
            workload={certificado.workload}
            onReject={handleReject}
            onApprove={handleApprove}
            onViewPdf={() => Swal.fire('PDF', 'Abrindo PDF...', 'info')}
          />
        </div>
      </div>
      {/* card de Usuário */}
      <div className="flex flex-col items-center gap-4 mt-12">
        <p className="font-semibold">Cartão de Usuário</p>
        <div className="flex gap-4 flex-wrap">
          {userCard.map((user, index) => (
            <UserCard
              key={index}
              name={user.name}
              registration={user.registration}
              totalHours={user.totalHours}
              status={user.status}
              onViewDetails={() =>
                Swal.fire('Detalhes do Usuário', 'Abrindo detalhes...', 'info')
              }
            />
          ))}
        </div>
      </div>
      {/* Cartão de Dashboard */}
      <div className="flex gap-6 flex-wrap justify-center">
        <DashboardCard
          icon={<FaChalkboardTeacher />}
          label="Turmas"
          onClick={() => alert('Turmas')}
        />

        <DashboardCard
          icon={<FaGraduationCap />}
          label="Requisições"
          notificationCount={3}
          onClick={() => alert('Requisições')}
        />

        <DashboardCard
          icon={<FaIdCard />}
          label="Secretaria"
          onClick={() => alert('Secretaria')}
        />
      </div>
      {/* Cartão de Curso */}
      <div className="flex flex-col items-center gap-4 mt-12">
        <p className="font-semibold">Cartão de Curso</p>
        <div className="flex gap-4 flex-wrap">
          <CourseCard
            courseName="Engenharia de Software"
            coordinators={2}
            classes={3}
            onManageCourse={() => console.log('Curso gerenciado!')}
          />
          <CourseCard
            courseName="Musica bá blá blá"
            coordinators={1}
            classes={5}
            onManageCourse={() => console.log('Curso gerenciado!')}
          />
        </div>
      </div>
    </div>
  );
}
