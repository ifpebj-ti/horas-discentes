'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaChevronDown, FaHome, FaQuestionCircle } from 'react-icons/fa';
import BreadCrumb from '@/components/BreadCrumb';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        id: 'contabilizacao-horas',
        question: 'Como são contabilizadas as horas?',
        answer: 'Aqui você pode detalhar como as horas são contabilizadas. Por exemplo, mencione os critérios, a validação e o sistema utilizado.'
    },
    {
        id: 'atividades-aceitas',
        question: 'Quais atividades são aceitas?',
        answer: 'Liste e descreva os tipos de atividades que são válidas para a contabilização de horas complementares. Ex: workshops, cursos, palestras, projetos de extensão, etc.'
    },
    {
        id: 'prazo-envio-certificados',
        question: 'Qual o prazo para envio de certificados?',
        answer: 'Informe o prazo limite para que os alunos enviem os certificados das atividades realizadas.'
    },
    {
        id: 'status-certificado-aprovado',
        question: 'Como saber se meu certificado foi aprovado?',
        answer: 'Explique o processo de notificação ou como o aluno pode consultar o status de aprovação do certificado enviado.'
    }
];

export default function PerguntasFrequentesPage() {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const questionId = searchParams.get('id');
        if (questionId && faqData.some(item => item.id === questionId)) {
            setOpenAccordion(questionId);
            setTimeout(() => {
                const element = document.getElementById(questionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }, [searchParams]);

    const toggleAccordion = (id: string) => {
        const newOpenAccordion = openAccordion === id ? null : id;
        setOpenAccordion(newOpenAccordion);
        if (newOpenAccordion) {
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <BreadCrumb
                items={[
                    {
                        icon: <FaHome className="text-base" />,
                        label: 'Início',
                        href: '/aluno'
                    },
                    {
                        icon: <FaQuestionCircle className="text-base" />,
                        label: 'Perguntas Frequentes',
                        href: '/aluno/perguntas'
                    }
                ]}
            />
            <h1 className="text-2xl font-semibold text-center mb-3 mt-3 text-blue-600">Dúvidas Frequentes</h1>

            <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Navegue pelas perguntas:</h2>
                <ul className="list-disc list-inside space-y-2">
                    {faqData.map((item) => (
                        <li key={`nav-${item.id}`}>
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpenAccordion(item.id);
                                    setTimeout(() => {
                                        const element = document.getElementById(item.id);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }, 50);
                                }}
                                className="text-blue-500 hover:text-blue-700 hover:underline"
                            >
                                {item.question}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-4">
                {faqData.map((item) => (
                    <div key={item.id} id={item.id} className="rounded-lg border border-gray-200 shadow-sm scroll-mt-20">
                        <button
                            onClick={() => toggleAccordion(item.id)}
                            className="flex w-full items-center justify-between p-5 text-left text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                            aria-expanded={openAccordion === item.id}
                            aria-controls={`answer-${item.id}`}
                        >
                            <span>{item.question}</span>
                            <FaChevronDown
                                className={`h-6 w-6 transform transition-transform duration-200 ${openAccordion === item.id ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {openAccordion === item.id && (
                            <div id={`answer-${item.id}`} className="px-5 pb-5 pt-2 text-gray-600">
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
