import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-deepBlue mb-4">About What's Up Science</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're on a mission to democratize access to cutting-edge research by connecting verified scientists directly with the public.
            </p>
          </div>

          {/* Mission Section */}
          <div className="card mb-12">
            <h2 className="text-2xl font-bold text-deepBlue mb-6">Our Mission</h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                <strong>Science, from scientists. Not influencers.</strong>
              </p>
              <p className="text-gray-600 mb-4">
                In today's digital age, scientific information is often filtered through social media influencers, 
                journalists, or content creators who may not have the expertise to accurately interpret complex research. 
                This can lead to misinformation, sensationalism, and a disconnect between the public and the scientific community.
              </p>
              <p className="text-gray-600 mb-4">
                What's Up Science bridges this gap by providing a platform where verified scientists can share their 
                research, insights, and discoveries directly with the public. We believe that everyone deserves access 
                to accurate, reliable scientific information from the source.
              </p>
              <p className="text-gray-600">
                Our platform ensures that only authenticated researchers can publish content, maintaining the highest 
                standards of credibility and accuracy. No clickbait, no sensationalism—just real science from real researchers.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center">
              <div className="w-16 h-16 bg-mintGreen rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-deepBlue mb-2">Credibility</h3>
              <p className="text-gray-600">
                Every piece of content comes from verified scientists, ensuring accuracy and reliability.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-mintGreen rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-deepBlue mb-2">Transparency</h3>
              <p className="text-gray-600">
                Direct communication between researchers and the public, with no intermediaries or filters.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-mintGreen rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-deepBlue mb-2">Community</h3>
              <p className="text-gray-600">
                Building a global community of scientists and science enthusiasts who share knowledge and insights.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="card mb-12">
            <h2 className="text-2xl font-bold text-deepBlue mb-6">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-deepBlue mb-3">For Scientists</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mintGreen rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Register with your academic credentials or ORCID
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mintGreen rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Get verified by our team
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mintGreen rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Share your research and insights
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mintGreen rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Engage with readers and build your audience
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-deepBlue mb-3">For Readers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mintGreen rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Browse verified scientific content
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mintGreen rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Follow your favorite researchers
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mintGreen rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Ask questions and engage in discussions
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-mintGreen rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Support independent science communication
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="card mb-12">
            <h2 className="text-2xl font-bold text-deepBlue mb-6">Our Impact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-deepBlue mb-3">Democratizing Science</h3>
                <p className="text-gray-600 mb-4">
                  We're making cutting-edge research accessible to everyone, regardless of their background or education level. 
                  By connecting scientists directly with the public, we're breaking down barriers and fostering a more 
                  scientifically literate society.
                </p>
                <p className="text-gray-600">
                  Our platform supports researchers in sharing their work beyond traditional academic channels, 
                  helping them reach broader audiences and make a greater impact with their discoveries.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-deepBlue mb-3">Supporting Researchers</h3>
                <p className="text-gray-600 mb-4">
                  We provide scientists with a platform to communicate their research effectively, build their public 
                  profiles, and engage with diverse audiences. This helps bridge the gap between academia and the public.
                </p>
                <p className="text-gray-600">
                  Through our subscription model, we're creating sustainable funding for independent science 
                  communication, ensuring that quality scientific content remains accessible and free from commercial bias.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-deepBlue mb-4">Join Our Mission</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether you're a scientist looking to share your research or a science enthusiast eager to learn from 
              the source, we invite you to join our community and help us democratize access to scientific knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth/signup" 
                className="btn-primary inline-block text-center"
              >
                Join as a Scientist
              </a>
              <a 
                href="/browse" 
                className="btn-outline inline-block text-center"
              >
                Explore Content
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 