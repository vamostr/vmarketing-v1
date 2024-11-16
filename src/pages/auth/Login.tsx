import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, Building2, User, ArrowRight, Github, Twitter } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      // API çağrısı simülasyonu
      const mockUser = {
        id: '1',
        email: data.email,
        name: 'Test Kullanıcı',
        role: data.email.includes('admin') ? 'admin' : 'user',
        createdAt: new Date(),
        subscription: {
          plan: 'free',
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      };

      setAuth(mockUser, 'mock-token');
      toast.success('Giriş başarılı!');
      navigate(data.email.includes('admin') ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error('Giriş başarısız!');
    }
  };

  const handleDemoLogin = (type: 'admin' | 'user') => {
    setValue('email', type === 'admin' ? 'admin@vmarketing.com' : 'demo@vmarketing.com');
    setValue('password', '123456');
    handleSubmit(onSubmit)();
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`${provider} ile giriş başlatıldı`);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Sol taraf - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative">
        {/* Arkaplan deseni */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzODhCRjYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2NEgzNnpNNDAgMzBoNHY0aC00ek0zMiAzMmg0djRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative z-10 mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-12">
            <img
              className="h-12 w-auto mx-auto mb-8"
              src="https://vamos.ist/wp-content/uploads/2024/01/siyah@2x.png"
              alt="vMarketing"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hoş Geldiniz
            </h2>
            <p className="text-gray-600">
              Hesabınıza giriş yapın veya demo hesapları deneyin
            </p>
          </div>

          {/* Demo Butonları */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-gray-700 bg-white border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm"
            >
              <Building2 className="h-5 w-5 mr-3 text-blue-600" />
              <span className="font-medium">Admin Demo ile Giriş Yap</span>
            </button>
            <button
              onClick={() => handleDemoLogin('user')}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-gray-700 bg-white border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm"
            >
              <User className="h-5 w-5 mr-3 text-green-600" />
              <span className="font-medium">Kullanıcı Demo ile Giriş Yap</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#fafafa] text-gray-500">veya</span>
            </div>
          </div>

          {/* Sosyal Giriş */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <Github className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleSocialLogin('Twitter')}
              className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <Twitter className="h-5 w-5 text-blue-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="E-posta adresiniz"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Şifreniz"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Şifremi unuttum
                </Link>
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
                  Giriş Yap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Hemen ücretsiz kayıt olun
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Sağ taraf - Görsel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 mix-blend-multiply opacity-90" />
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Marketing"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-xl text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Pazarlama Süreçlerinizi Otomatikleştirin
            </h2>
            <p className="text-lg text-gray-100">
              WhatsApp ve e-posta kampanyalarınızı tek platformdan yönetin, 
              müşterilerinizle iletişiminizi güçlendirin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};