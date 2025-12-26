import Logo from "@/assets/icons/Logo";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-6xl flex-col items-center justify-between sm:py-24 py-12 px-4 sm:px-16">
          <div className="w-full space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo width={48} height={48} className="text-accent" />
                <h1 className="text-3xl sm:text-4xl font-bold text-accent">About Crypto Friend</h1>
              </div>
              <p className="text-secondary text-lg sm:text-xl max-w-2xl mx-auto">
                Your trusted companion for making informed cryptocurrency investment and trading decisions.
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-foreground rounded-lg p-6 sm:p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
                <p className="text-secondary text-base sm:text-lg leading-relaxed">
                  Crypto Friend is designed to provide you with real-time cryptocurrency data, comprehensive market analysis, 
                  and the tools you need to navigate the crypto market with confidence. We believe that access to accurate, 
                  up-to-date information is essential for making sound investment decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">What We Offer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Real-Time Data</h3>
                    <p className="text-secondary text-sm">
                      Access live cryptocurrency prices, market trends, and trading volumes from reliable sources.
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Market Analysis</h3>
                    <p className="text-secondary text-sm">
                      Comprehensive charts and statistics to help you understand market movements and trends.
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">User-Friendly Interface</h3>
                    <p className="text-secondary text-sm">
                      Clean, intuitive design that makes it easy to find and analyze the information you need.
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Always Up-to-Date</h3>
                    <p className="text-secondary text-sm">
                      Our data is continuously updated to ensure you have the latest market information at your fingertips.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">Our Commitment</h2>
                <p className="text-secondary text-base sm:text-lg leading-relaxed">
                  We are committed to providing accurate, reliable, and timely cryptocurrency market data. 
                  Our platform is built with transparency and user experience in mind, ensuring that you have 
                  access to the tools and information necessary to make informed decisions in the dynamic world of cryptocurrency.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

