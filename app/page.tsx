import React from "react";
import {
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  Zap,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-semibold mb-6 animate-pulse">
              <Zap size={16} />
              <span className="text-sm">AI-Powered Resume Analysis</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Resume Into Your
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Dream Career
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Upload your resume and get instant AI-powered insights, skill gap
              analysis, and personalized career recommendations to stand out in
              the job market.
            </p>

            <div className="flex items-center justify-center gap-4">
              <a
                href="/dashboard"
                className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                Start Analyzing Now
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </a>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  10K+
                </div>
                <div className="text-gray-600">Resumes Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  95%
                </div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Instant Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features to Boost Your Career
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your resume and land your dream
              job
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-linear-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Skill Gap Analysis
              </h3>
              <p className="text-gray-600 mb-6">
                Identify missing skills and get personalized recommendations
                based on industry demand and your career goals.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-indigo-600" />
                  <span>Compare with industry standards</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-indigo-600" />
                  <span>Prioritized learning paths</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Career Readiness Score
              </h3>
              <p className="text-gray-600 mb-6">
                Get an instant assessment of your profile's strength based on
                skills, experience, and market trends.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-purple-600" />
                  <span>Real-time scoring</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-purple-600" />
                  <span>Track improvements</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-linear-to-br from-pink-50 to-pink-100 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Smart Recommendations
              </h3>
              <p className="text-gray-600 mb-6">
                Receive AI-powered suggestions on which skills to learn and how
                to improve your profile visibility.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-pink-600" />
                  <span>Personalized insights</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-pink-600" />
                  <span>Market-driven advice</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Upload Resume
              </h3>
              <p className="text-gray-600">
                Simply upload your resume in PDF format. Our AI will instantly
                parse and analyze your information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Analysis
              </h3>
              <p className="text-gray-600">
                Receive detailed insights about your skills, experience, and
                areas for improvement in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Improve & Succeed
              </h3>
              <p className="text-gray-600">
                Follow personalized recommendations to enhance your profile and
                land your dream job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl mb-8 text-indigo-100">
                Join thousands of professionals who have already improved their
                careers with our AI-powered platform.
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Get Started Free
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <span className="text-xl font-bold">ResumeAI</span>
              </div>
              <p className="text-gray-400">
                AI-powered resume analysis for better career outcomes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
