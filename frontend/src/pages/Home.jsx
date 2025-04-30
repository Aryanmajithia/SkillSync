import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Next Tech Opportunity
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Connect with top companies and discover exciting tech jobs that
            match your skills and aspirations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/jobs"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100"
            >
              Find Jobs
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose SkillSync?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI-powered platform matches you with the perfect job
                opportunities based on your skills and preferences.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">Top Companies</h3>
              <p className="text-gray-600">
                Connect with leading tech companies and startups looking for
                talented professionals like you.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600">
                Access resources and tools to help you grow your career and
                reach your professional goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of tech professionals who have found their dream jobs
            through SkillSync.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700"
          >
            Create Your Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
