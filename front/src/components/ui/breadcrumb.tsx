'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn('text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5', className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="breadcrumb-item" className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'a';
  return <Comp data-slot="breadcrumb-link" className={cn('hover:text-foreground transition-colors', className)} {...props} />;
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('text-foreground font-normal', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

const breadcrumbRouteMap: Record<string, string> = {
  // Role roots (treated as home)
  aluno: 'Início',
  admin: 'Início',
  coordenacao: 'Início',
  coordenador: 'Coordenador',
  // Shared
  perfil: 'Perfil',
  // Admin
  curso: 'Cursos',
  // Aluno
  certificado: 'Certificados',
  novo: 'Novo Certificado',
  perguntas: 'Perguntas Frequentes',
  // Coordenador
  atividade: 'Atividades',
  certificados: 'Certificados',
  contabilizarHoras: 'Contabilizar Horas',
  turma: 'Turmas'
};

// Dynamic segments that follow a parent with dynamic children (treated as detail pages)
const dynamicParents = new Set(['curso', 'turma']);

export function BreadcrumbAuto({ map = {} }: { map?: Record<string, string> }) {
  const pathname = usePathname();
  const routeMap = { ...breadcrumbRouteMap, ...map };

  const segments = pathname.split('/').filter(Boolean);

  // Determine home href: first meaningful segment
  const homeSegment = segments[0];
  const homeHref = homeSegment ? `/${homeSegment}` : '/';
  const homeLabel = routeMap[homeSegment] ?? 'Início';

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={homeHref}>{homeLabel}</BreadcrumbLink>
        </BreadcrumbItem>

        {segments.slice(1).map((segment, index) => {
          const absoluteIndex = index + 1;
          const fullPath = '/' + segments.slice(0, absoluteIndex + 1).join('/');
          const isLast = absoluteIndex === segments.length - 1;
          const prevSegment = segments[absoluteIndex - 1];
          const isDetailId = dynamicParents.has(prevSegment);
          const label = routeMap[segment] ?? segment;

          // Skip role-root segments already shown as home (aluno, admin, coordenacao)
          if (absoluteIndex === 1 && (segment === 'aluno' || segment === 'admin' || segment === 'coordenacao' || segment === 'coordenador')) {
            return null;
          }

          return (
            <React.Fragment key={fullPath}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast || isDetailId ? (
                  <BreadcrumbPage className="text-gray-500 select-none">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={fullPath}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
};
