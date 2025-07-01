'use client';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import type { Aluno } from '@/types';

export async function gerarCartaDocx(alunos: Aluno[]) {
  const template = await fetch('/docs/Coordenador-Requerimento.docx')
    .then(r => r.arrayBuffer());

  const { saveAs } = await import('file-saver');

  function slugify(str: string) {
    return str
      .normalize('NFD')               // remove acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')           // espaços → _
      .replace(/[^a-zA-Z0-9_]/g, '')  // remove símbolos
      .toLowerCase();
  }


  for (const aluno of alunos) {
    const zip = new PizZip(template);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    /* --- prepara o array de certificados para o loop --- */
    const certs = aluno.certificados.map((c, i) => ({
      idx: i + 1,
      descricao: `${c.title} – ${c.cargaHoraria} h (${c.periodoInicio}-${c.periodoFim})`,
      categoria: c.categoria,
      cargaHoraria: c.cargaHoraria,
      title: c.title,
      periodo: `${c.periodoInicio} a ${c.periodoFim}`,
    }));

    const totalHoras = certs.reduce((acc, c) => acc + c.cargaHoraria, 0);

    doc.setData({
      estudante: aluno.nome,
      matricula: aluno.matricula,
      carga: totalHoras,
      totalHoras,
      dataHoje: new Date().toLocaleDateString('pt-BR'),
      certs       // ← passa o array para o template
    });

    try {
      doc.render();
      const blob = doc.getZip().generate({ type: 'blob' });
      const arquivo = `${slugify(aluno.nome)}.contabilizacao-horas.docx`;
      saveAs(blob, arquivo);
    } catch (e) {
      console.error('Erro ao gerar documento', e);
    }
  }
}
