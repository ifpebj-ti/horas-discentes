'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { atividadeSchema, AtividadeFormSchema } from '../schemas/schema';

interface Props {
  onSubmit: (data: AtividadeFormSchema) => void;
}

export function useAtividadeForm({ onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AtividadeFormSchema>({
    resolver: zodResolver(atividadeSchema)
  });

  const handleFormSubmit = async (data: AtividadeFormSchema) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    register,
    handleSubmit,
    errors,
    handleFormSubmit
  };
}
