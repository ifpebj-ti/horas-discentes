'use client';

import type { Aluno } from '@/types';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

export const gerarCartaDocx = async (alunos: Aluno[]) => {
  // Sort students alphabetically by name
  alunos.sort((a, b) => a.nome.localeCompare(b.nome));

  const template = await fetch('/docs/Coordenador-Requerimento.docx').then(
    (r) => r.arrayBuffer()
  );

  // Create a single document for all selected students
  const zip = new PizZip(template);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  // Prepare data for all students. This structure assumes the DOCX template
  // can iterate over an array of students. You will need to update your
  // Coordenador-Requerimento.docx template to support this structure.
  const studentsData = alunos.map((aluno) => {
    const certs = aluno.certificados.map((c, i) => ({
      idx: i + 1,
      descricao: `${c.title} – ${c.cargaHoraria} h (${c.periodoInicio}-${c.periodoFim})`,
      categoria: c.categoria,
      cargaHoraria: c.cargaHoraria,
      title: c.title,
      periodo: `${c.periodoInicio} a ${c.periodoFim}`
    }));

    const totalHoras = certs.reduce((acc, c) => acc + c.cargaHoraria, 0);

    return {
      estudante: aluno.nome,
      matricula: aluno.matricula,
      carga: totalHoras,
      totalHoras,
      dataHoje: new Date().toLocaleDateString('pt-BR'),
      certs
    };
  });

  // Set data for the document. The template needs to be adapted to handle 'students' array.
  doc.setData({ students: studentsData });

  try {
    doc.render();
    // Retornar o buffer do DOCX gerado
    return doc.getZip().generate({ type: 'nodebuffer' });
  } catch (e) {
    console.error('Erro ao gerar documento', e);
  }
};
