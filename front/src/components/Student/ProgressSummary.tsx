'use client';
import Link from 'next/link';
import { SOFTWARE_ENGINEERING_REQUIREMENTS } from '@/types';

interface Props {
  certificates: { hours: number; category: string }[];
  courseRequirement?: typeof SOFTWARE_ENGINEERING_REQUIREMENTS;
}

export default function ProgressSummary({
  certificates,
  courseRequirement = SOFTWARE_ENGINEERING_REQUIREMENTS,
}: Props) {
  /* ── cálculo total ─────────────────────────────────────────────────────── */
  const totalHours = certificates.reduce((sum, c) => sum + c.hours, 0);
  const maxHours = courseRequirement.totalHoursRequired;
  const pctTotal = Math.min((totalHours / maxHours) * 100, 100);

  /* ── cálculo por categoria ─────────────────────────────────────────────── */
  const hoursByCat = courseRequirement.categories.map(cat => {
    const earned = certificates
      .filter(c => c.category === cat.category)
      .reduce((s, c) => s + c.hours, 0);

    return { ...cat, earned, pct: Math.min((earned / cat.maxHours) * 100, 100) };
  });

  /* ── UI ────────────────────────────────────────────────────────────────── */
  return (
    <div className="bg-white rounded-3xl shadow p-8 space-y-8 border border-[#F0F2F5]">
      {/* Total --------------------------------------------------------------- */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[#071D41]">
          Progresso Geral
        </h2>

        <div className="flex justify-between text-base mb-2">
          <span className="text-[#A0AEC0]">Total de Horas Complementares</span>
          <span className="tabular-nums font-semibold text-[#A0AEC0]">
            {totalHours} / {maxHours} h
          </span>
        </div>

        <div className="relative h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1E7BFF] to-[#0F4AA9] transition-[width] duration-500"
            style={{ width: `${pctTotal}%` }}
          />
        </div>
      </section>

      {/* Por categoria ------------------------------------------------------- */}
      <section>
        <h3 className="text-base font-semibold mb-3 text-[#071D41]">
          Progresso por Categoria
        </h3>

        <ul className="space-y-3">
          {hoursByCat.map(cat => (
            <li key={cat.category}>
              <div className="flex justify-between text-sm mb-1">
                <Link
                  href={`/aluno/certificado?category=${cat.category}`}
                  className={cat.earned === 0
                    ? 'text-gray-500 font-medium hover:text-[#0F4AA9] transition-colors'
                    : 'text-[#0F4AA9] font-semibold underline cursor-pointer hover:text-[#0D3F8E] transition-colors'
                  }
                >
                  {cat.label}
                </Link>
                <span className={cat.earned === 0
                  ? 'tabular-nums text-xs text-gray-500 font-medium'
                  : 'tabular-nums text-xs bg-[#0F4AA9] text-white px-2 py-0.5 rounded font-semibold'
                }>
                  {cat.earned} / {cat.maxHours} h
                </span>
              </div>
              <div className="relative h-[6px] rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="absolute inset-0 bg-[#0F4AA9]"
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
