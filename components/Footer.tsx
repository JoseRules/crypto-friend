import Logo from "@/assets/icons/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-foreground/20 bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and brand */}
          <div className="flex items-center gap-2">
            <Logo width={20} height={20} className="text-accent" />
            <span className="text-accent font-bold">Crypto Friend</span>
          </div>

          {/* Navigation links */}
          <nav>
            <ul className="flex items-center gap-4 sm:gap-6 text-sm">
              <li>
                <a href="/" className="text-secondary hover:text-accent transition-colors hover:font-bold cursor-pointer">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-secondary hover:text-accent transition-colors hover:font-bold cursor-pointer">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-secondary hover:text-accent transition-colors hover:font-bold cursor-pointer">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Copyright */}
          <p className="text-secondary text-sm">
            © {currentYear} Crypto Friend. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

