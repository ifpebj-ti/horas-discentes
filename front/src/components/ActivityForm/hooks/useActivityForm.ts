'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { activitySchema, ActivityFormSchema } from '../schemas/schema';

interface Props {
  onSubmit: (data: ActivityFormSchema) => void;
}

export function useActivityForm({ onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ActivityFormSchema>({
    resolver: zodResolver(activitySchema)
  });

  const handleFormSubmit = async (data: ActivityFormSchema) => {
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
