import { Check, Star } from 'lucide-react';

const features = [
  'Unlimited email summaries',
  '24/7 AI auto-responder',
  'Real-time classification',
  'Custom response templates',
  'Priority support',
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, transparent billing. Start your free trial today.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Star className="w-4 h-4 fill-current" />
                <span>Most Popular</span>
              </div>
            </div>

            {/* Plan Name */}
            <div className="text-center mb-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal</h3>
              <p className="text-gray-600">Perfect for individuals</p>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">$4.99</span>
                <span className="text-lg text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>

            {/* Trial Info */}
            <p className="text-center text-sm text-gray-500 mt-4">
              7-day free trial • No credit card required
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom solution for your team?
          </p>
          <button className="text-blue-500 hover:text-blue-600 font-semibold underline">
            Contact our sales team
          </button>
        </div>
      </div>
    </section>
  );
}