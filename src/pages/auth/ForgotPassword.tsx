import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
    } catch (error) {
      toast.error('Şifre sıfırlama bağlantısı gönderilemedi');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://vamos.ist/wp-content/uploads/2024/01/siyah@2x.png"
          alt="vMarketing"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Şifrenizi mi unuttunuz?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="ornek@sirket.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Şifre Sıfırlama Bağlantısı Gönder'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};