import { FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';

export default function ResumoAluno() {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold">Resumo</h2>

      <div className="flex items-center gap-3">
        <FaFileAlt className="text-blue-500" />
        <p className="text-sm">
          Total de Certificados: <strong>3</strong>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <FaCheckCircle className="text-green-500" />
        <p className="text-sm">
          Certificados Aprovados: <strong>1</strong>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <FaClock className="text-yellow-500" />
        <p className="text-sm">
          Pendentes de Aprovação: <strong>1</strong>
        </p>
      </div>
    </div>
  );
}
