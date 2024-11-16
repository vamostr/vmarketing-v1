import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { CreditCard, Crown, Zap, Check } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Ücretsiz',
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
  },
];

export const SubscriptionSettings: React.FC = () => {
  const { user } = useAuthStore();

  const getButtonStyle = (planId: string) => {
    if (user?.subscription.plan === planId) {
      return 'bg-gray-100 text-gray-800 cursor-default';
    }
    switch (planId) {
      case 'pro':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'enterprise':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900">Abonelik Planları</h2>
        <p className="mt-2 text-gray-600">
          İşletmenizin ihtiyaçlarına uygun planı seçin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = user?.subscription.plan === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${
                isCurrentPlan ? `border-${plan.color}-500` : 'border-transparent'
              }`}
            >
              <div className={`p-6 bg-${plan.color}-50`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className={`text-${plan.color}-600 text-sm`}>
                      {plan.description}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 text-${plan.color}-500`} />
                </div>
                <p className="mt-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.id !== 'enterprise' && <span className="text-gray-500">/ay</span>}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className={`h-5 w-5 text-${plan.color}-500 mr-2 mt-0.5`} />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full px-4 py-2 rounded-md font-medium ${getButtonStyle(
                    plan.id
                  )}`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan
                    ? 'Mevcut Plan'
                    : plan.id === 'enterprise'
                    ? 'İletişime Geç'
                    : 'Planı Seç'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};