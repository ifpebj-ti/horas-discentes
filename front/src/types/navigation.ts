import { IconType } from 'react-icons';

import { LucideIcon } from 'lucide-react';

/**
 * Roles disponíveis no sistema
 */
export type UserRole = 'admin' | 'coordenador' | 'aluno';

/**
 * Tipo para ícones (suporta Lucide e React Icons)
 */
export type IconComponent = LucideIcon | IconType;

/**
 * Interface para um item de navegação
 */
export interface NavigationItem {
  /**
   * Rota do link (ex: '/aluno/certificado')
   */
  href: string;

  /**
   * Label exibido no menu
   */
  label: string;

  /**
   * Ícone do menu item
   */
  icon: IconComponent;

  /**
   * Se o item está desabilitado
   */
  disabled?: boolean;

  /**
   * Badge de notificação (ex: número de certificados pendentes)
   */
  badge?: string | number;
}

/**
 * Configuração de navegação por role
 */
export type NavigationConfig = {
  [K in UserRole]: NavigationItem[];
};

/**
 * Props para o usuário no contexto de navegação
 */
export interface NavigationUser {
  name: string;
  role: UserRole;
}
