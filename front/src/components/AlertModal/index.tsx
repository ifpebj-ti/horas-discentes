'use client';

import * as React from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface AlertProps {
  imageUrl?: string;
  title: string;
  description?: string;
  buttons?: { label: string; href: string }[];
  showCloseButton?: boolean;
  closeButtonText?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  imageUrl,
  title,
  description,
  buttons,
  showCloseButton = true,
  closeButtonText = 'Cancelar',
  onClose
}) => {
  const [open, setOpen] = React.useState(true);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md flex flex-col items-center justify-center">
        <AlertDialogHeader className="text-center">
          {imageUrl && <Image src={imageUrl} alt="Alert" width={300} height={120} />}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2 justify-center">
          {buttons?.map((button, index) => (
            <Button key={index} className="px-4 py-2">
              {button.label}
            </Button>
          ))}
          {showCloseButton && (
            <AlertDialogCancel asChild>
              <Button
                variant="ghost"
                className="px-4 py-2"
                onClick={() => {
                  setOpen(false);
                  onClose?.();
                }}
              >
                {closeButtonText}
              </Button>
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
