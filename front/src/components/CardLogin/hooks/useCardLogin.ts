// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';

import { mySchema, typeMyschema } from '../schemas/schema';

export function useCardLogin() {
  // const session = useSession();
  // const { push } = useRouter();

  const form = useForm<typeMyschema>({
    resolver: zodResolver(mySchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submitForm: SubmitHandler<typeMyschema> = async () => {
    // Simulando login com roles
    toast.success('Login efetuado com sucesso');
  };

  return {
    form,
    submitForm
  };
}
