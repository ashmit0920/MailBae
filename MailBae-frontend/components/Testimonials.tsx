import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechFlow Inc.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    quote: 'MailBae transformed my inbox from chaos to clarity. I save 2+ hours daily and never miss important emails.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Startup Founder',
    company: 'InnovateLab',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    quote: 'The AI responses are so natural, my clients think I\'m personally replying to every email. Game changer!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Product Manager',
    company: 'DataCore Systems',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    quote: 'Finally, an email tool that actually understands context. The daily summaries keep me in the loop effortlessly.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Loved by early adopters
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our users say about their MailBae experience
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-blue-500 text-white rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Join thousands of satisfied users
            </h3>
            <p className="text-blue-100 mb-6">
              Start your free trial today and experience the difference
            </p>
            <button className="bg-white text-blue-500 hover:bg-gray-100 px-8 py-3 rounded-2xl font-semibold transition-colors duration-200">
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}