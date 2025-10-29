'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()
  const [showDemoMessage, setShowDemoMessage] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      searches: '2 searches',
      description: 'Perfect for trying out DeepSocial',
      features: [
        '2 searches per month',
        'All 6 platforms supported',
        'Basic analytics',
        'CSV & JSON export',
        'Community support',
        'Basic search history'
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200',
      popular: false
    },
    {
      name: 'Basic',
      price: '$15',
      period: 'per month',
      searches: '20 searches',
      description: 'Great for individuals and small teams',
      features: [
        '20 searches per month',
        'All 6 platforms supported',
        'Advanced analytics',
        'CSV & JSON export',
        'Priority support',
        'Extended search history',
        'Faster processing',
        'Email notifications'
      ],
      buttonText: 'Subscribe to Basic',
      buttonStyle: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
      popular: true
    },
    {
      name: 'Ultra',
      price: '$25',
      period: 'per month',
      searches: '100 searches',
      description: 'Perfect for agencies and power users',
      features: [
        '100 searches per month',
        'All 6 platforms supported',
        'Premium analytics',
        'CSV & JSON export',
        '24/7 priority support',
        'Unlimited search history',
        'Fastest processing',
        'Real-time notifications',
        'API access',
        'Custom integrations'
      ],
      buttonText: 'Subscribe to Ultra',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
      popular: false
    }
  ]

  const handleSubscribe = (planName: string) => {
    setShowDemoMessage(true)
    setTimeout(() => setShowDemoMessage(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">DeepSocial</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/auth/register')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Plan</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start with our free plan and scale up as your social media intelligence needs grow
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-600 mb-2">{plan.searches}</p>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.name)}
                    className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing FAQ</h2>
            <p className="text-xl text-gray-600">
              Common questions about our pricing plans
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we&apos;ll prorate any billing differences.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens if I exceed my search limit?</h3>
              <p className="text-gray-600">
                If you exceed your monthly search limit, you&apos;ll be notified and can either upgrade your plan or wait until next month for your searches to reset.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a free trial for paid plans?</h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 7-day free trial. No credit card required to start your trial.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time. You&apos;ll continue to have access to your plan features until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. If you&apos;re not satisfied, contact our support team for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already discovering insights across social media platforms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/register')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-lg"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-4 bg-transparent text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium text-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">DeepSocial</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 DeepSocial. All rights reserved.</p>
              <p className="mt-1">Powered by advanced AI and web scraping technology</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Message Modal */}
      {showDemoMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Demo Notice</h3>
            <p className="text-gray-600 mb-6">
              This is just a demo version. A payment gateway will be integrated upon site purchase. Thank you for your interest!
            </p>
            <button
              onClick={() => setShowDemoMessage(false)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
