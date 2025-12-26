import Logo from "@/assets/icons/Logo";

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-6xl flex-col items-center justify-between sm:py-24 py-12 px-4 sm:px-16">
          <div className="w-full space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo width={48} height={48} className="text-accent" />
                <h1 className="text-3xl sm:text-4xl font-bold text-accent">Contact Us</h1>
              </div>
              <p className="text-secondary text-lg sm:text-xl max-w-2xl mx-auto">
                Have questions or feedback? We'd love to hear from you.
              </p>
            </div>

            {/* Contact Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Contact Information */}
              <div className="bg-foreground rounded-lg p-6 sm:p-8 space-y-6">
                <section>
                  <h2 className="text-2xl font-bold text-primary mb-4">Get in Touch</h2>
                  <p className="text-secondary text-base leading-relaxed mb-6">
                    Whether you have a question about our platform, need technical support, or want to share 
                    your feedback, we're here to help.
                  </p>
                </section>

                <div className="space-y-4">
                  <div className="bg-background rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">General Inquiries</h3>
                    <p className="text-secondary text-sm">
                      For general questions and information about Crypto Friend.
                    </p>
                    <p className="text-accent text-sm mt-2">info@cryptofriend.com</p>
                  </div>

                  <div className="bg-background rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Technical Support</h3>
                    <p className="text-secondary text-sm">
                      Need help with the platform or experiencing technical issues?
                    </p>
                    <p className="text-accent text-sm mt-2">support@cryptofriend.com</p>
                  </div>

                  <div className="bg-background rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Partnerships</h3>
                    <p className="text-secondary text-sm">
                      Interested in partnering with us or have business inquiries?
                    </p>
                    <p className="text-accent text-sm mt-2">partners@cryptofriend.com</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-foreground rounded-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full bg-background text-primary border border-foreground/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full bg-background text-primary border border-foreground/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-primary mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full bg-background text-primary border border-foreground/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full bg-background text-primary border border-foreground/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent text-button-text px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-foreground rounded-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Response Time</h2>
              <p className="text-secondary text-base leading-relaxed">
                We typically respond to all inquiries within 24-48 hours during business days. 
                For urgent matters, please mark your message as urgent and we'll prioritize your request.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

