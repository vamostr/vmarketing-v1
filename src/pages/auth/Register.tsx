import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Building2, ArrowRight, Check } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Kullanım koşullarını kabul etmelisiniz' }),
  }),
});

type RegisterForm = z.infer<typeof registerSchema>;

const features = [
  'Günlük 100 WhatsApp mesajı',
  'Günlük 1000 e-posta',
  'Temel raporlama',
  'E-posta şablonları',
  'WhatsApp şablonları',
];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      // API çağrısı simülasyonu
      const mockUser = {
        id: '1',
        email: data.email,
        name: data.name,
        companyName: data.companyName,
        role: 'user',
        createdAt: new Date(),
        subscription: {
          plan: 'free',
          status: 'trial',
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      };

      setAuth(mockUser, 'mock-token');
      toast.success('Kayıt başarılı!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Kayıt başarısız!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sol taraf - Özellikler */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="max-w-xl text-white">
              <h2 className="text-3xl font-bold mb-8">
                14 Gün Ücretsiz Deneyin
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <p className="ml-3 text-lg">{feature}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 text-white">
                  <span className="text-sm">Kredi kartı gerektirmez</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ taraf - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <img
              className="h-12 w-auto mx-auto"
              src="https://vamos.ist/wp-content/uploads/2024/01/siyah@2x.png"
              alt="vMarketing"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Hemen Ücretsiz Başlayın
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              14 gün boyunca tüm özellikleri ücretsiz deneyin
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('name')}
                    type="text"
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Şirket Adı
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('companyName')}
                    type="text"
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Şirketinizin Adı"
                  />
                </div>
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                <label className="block text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    {...register('terms')}
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                      Kullanım koşullarını
                    </Link>{' '}
                    ve{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                      gizlilik politikasını
                    </Link>{' '}
                    kabul ediyorum
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Ücretsiz Başla
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Giriş yapın
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};