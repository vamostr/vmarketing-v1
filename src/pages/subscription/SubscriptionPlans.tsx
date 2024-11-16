import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { CreditCard, Crown, Zap, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    id: 'free',
    name: 'Ücretsiz Plan',
    price: '0 ₺',
    description: 'Küçük işletmeler için temel özellikler',
    icon: CreditCard,
    features: [
      'Günlük 100 WhatsApp mesajı',
      'Günlük 1000 e-posta',
      'Temel raporlama',
      'E-posta şablonları',
      'WhatsApp şablonları',
    ],
    color: 'blue',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Profesyonel',
    price: '499 ₺',
    description: 'Büyüyen işletmeler için gelişmiş özellikler',
    icon: Crown,
    features: [
      'Sınırsız WhatsApp mesajı',
      'Sınırsız e-posta',
      'Gelişmiş analitik',
      'Özel şablonlar',
      'Öncelikli destek',
      'API erişimi',
    ],
    color: 'yellow',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    price: 'Özel Fiyat',
    description: 'Büyük işletmeler için özel çözümler',
    icon: Zap,
    features: [
      'Tüm Pro özellikleri',
      'Özel entegrasyonlar',
      'Özel API limitleri',
      '7/24 öncelikli destek',
      'Özel eğitim ve danışmanlık',
      'SLA garantisi',
    ],
    color: 'purple',
    popular: false,
  },
];

export const SubscriptionPlans: React.FC = () => {
  const { user } = useAuthStore();
  const currentPlan = user?.subscription.plan || 'free';

  const handleUpgrade = (planId: string) => {
    // Ödeme sayfasına yönlendirme
    console.log('Upgrade to:', planId);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Başlık */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Abonelik Planları
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          İşletmenizin ihtiyaçlarına uygun planı seçin
        </p>
      </div>

      {/* Mevcut Plan Bilgisi */}
      <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Mevcut Planınız</h2>
            <p className="mt-1 text-sm text-gray-500">
              {user?.subscription.status === 'trial'
                ? 'Deneme sürümü kullanıyorsunuz'
                : user?.subscription.status === 'active'
                ? 'Aktif abonelik'
                : 'Süresi dolmuş abonelik'}
            </p>
          </div>
          <div className="flex items-center">
            {user?.subscription.status === 'trial' && (
              <div className="mr-4 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {Math.ceil((new Date(user.subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün kaldı
                </div>
              </div>
            )}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentPlan === 'free' ? 'bg-blue-100 text-blue-800' :
              currentPlan === 'pro' ? 'bg-yellow-100 text-yellow-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {plans.find(p => p.id === currentPlan)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Plan Kartları */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-sm flex flex-col ${
                plan.popular ? 'ring-2 ring-blue-500' : 'border'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-600 text-white">
                    Popüler
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  <Icon className={`h-8 w-8 text-${plan.color}-500`} />
                </div>

                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>

                <div className="mt-6">
                  <p className="text-4xl font-bold text-gray-900">{plan.price}</p>
                  <p className="mt-1 text-sm text-gray-500">/ aylık</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className={`h-5 w-5 text-${plan.color}-500 mr-2`} />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 bg-gray-50 rounded-b-2xl mt-auto">
                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full btn bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    Mevcut Plan
                  </button>
                ) : plan.id === 'enterprise' ? (
                  <Link
                    to="/contact"
                    className="w-full btn bg-purple-600 text-white hover:bg-purple-700 text-center"
                  >
                    İletişime Geç
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full btn ${
                      plan.id === 'pro'
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {currentPlan === 'free' ? 'Yükselt' : 'Planı Değiştir'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SSS */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Sıkça Sorulan Sorular
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Plan değişikliği nasıl yapılır?
            </h3>
            <p className="mt-2 text-gray-600">
              İstediğiniz planı seçip "Yükselt" veya "Planı Değiştir" butonuna tıklayarak
              ödeme adımlarını tamamlayabilirsiniz. Yeni planınız ödeme onayından sonra
              hemen aktif olur.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900">
              İptal ve iade politikası nedir?
            </h3>
            <p className="mt-2 text-gray-600">
              Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal durumunda
              mevcut dönem sonuna kadar hizmet almaya devam edersiniz. Kullanılmayan
              süre için iade yapılmaz.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Mesaj limitleri nasıl hesaplanır?
            </h3>
            <p className="mt-2 text-gray-600">
              Ücretsiz planda günlük limitler gece yarısı (00:00) sıfırlanır.
              Pro ve Kurumsal planlarda herhangi bir mesaj limiti bulunmamaktadır.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Özel fiyatlandırma mümkün mü?
            </h3>
            <p className="mt-2 text-gray-600">
              Kurumsal plan için özel ihtiyaçlarınıza göre fiyatlandırma yapıyoruz.
              İletişime geçin butonuna tıklayarak bizimle görüşebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};