import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContactStore } from '../../stores/contactStore';
import { X } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().or(z.literal('')),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddContactModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addContact, groups, tags } = useContactStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    addContact({
      ...data,
      groups: [],
      tags: [],
      source: 'manual',
    });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Yeni Kişi Ekle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 input"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="mt-1 input"
              placeholder="+90"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 input"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Şirket
            </label>
            <input
              type="text"
              {...register('company')}
              className="mt-1 input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notlar
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="mt-1 input"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};