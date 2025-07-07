"use client"; // This directive marks the component as a Client Component.

import React, { useState } from 'react';
// Note: The 'next/link' component is removed to prevent compilation errors in this environment.
// In your actual Next.js project, you should use the <Link> component for navigation.

// ICONS: Using inline SVGs for portability, as you would with lucide-react or similar libraries.
// Added explicit type 'React.SVGProps<SVGSVGElement>' for props to resolve TypeScript error.
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

// Custom SVG Logo for FinSight
// Added explicit type for className prop.
const FinSightLogo = ({ className }: { className?: string }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
            <path d="M4 20L12 4L20 20H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 11L8 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-2xl font-bold tracking-tight text-white">FinSight</span>
    </div>
);


export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Reusable button styles to mimic the shadcn/ui Button component
  const buttonClasses = {
    primary: "bg-cyan-500 text-black font-semibold hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white",
    ghost: "text-gray-300 hover:bg-gray-800 hover:text-white",
  };
  
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#showcase", label: "Showcase" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  return (
    <div className="bg-gray-950 antialiased text-gray-300">
        {/* Main container with a subtle background pattern */}
      <main className="min-h-screen bg-grid-gray-700/[0.2] relative">
        {/* Adds a radial gradient for a nice lighting effect at the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-black opacity-80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.15),_transparent_30%)] pointer-events-none"></div>

        {/* Header */}
        <header className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center">
              <a href="/" aria-label="Home">
                <FinSightLogo />
              </a>
              <nav className="hidden md:flex items-center space-x-8">
                {navLinks.map(link => (
                    <a key={link.href} href={link.href} className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                      {link.label}
                    </a>
                ))}
              </nav>
              <div className="hidden md:flex items-center space-x-4">
                {/* DEV NOTE: Replaced <Link> with <a> for compatibility. Use <Link href="/login"> in your project. */}
                <a href="/login" className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 ${buttonClasses.ghost}`}>Login</a>
                {/* DEV NOTE: Replaced <Link> with <a> for compatibility. Use <Link href="/register"> in your project. */}
                <a href="/register" className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 ${buttonClasses.primary}`}>Get Started</a>
              </div>
              <div className="md:hidden">
                 <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500">
                    <span className="sr-only">Open main menu</span>
                    {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-gray-900 rounded-lg p-4">
                <nav className="flex flex-col space-y-4">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                          {link.label}
                        </a>
                    ))}
                    {/* DEV NOTE: Replaced <Link> with <a> for compatibility. Use <Link href="/login"> in your project. */}
                    <a href="/login" className="text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors duration-200 pt-2 border-t border-gray-700">Login</a>
                    {/* DEV NOTE: Replaced <Link> with <a> for compatibility. Use <Link href="/register"> in your project. */}
                    <a href="/register" className={`w-full text-center px-4 py-2 rounded-md text-sm transition-colors duration-200 ${buttonClasses.primary}`}>Get Started</a>
                </nav>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative z-10 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-4xl text-center px-4">
            <div className="inline-block px-4 py-1 mb-6 text-sm font-semibold tracking-wider text-cyan-400 uppercase rounded-full bg-cyan-900/40 border border-cyan-800">
              The Future of Trading is Here
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              The Ultimate Edge in Financial Markets
            </h1>
            <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-gray-400">
              FinSight empowers you with institutional-grade tools, real-time data, and powerful analytics. Go from insight to action in seconds.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              {/* DEV NOTE: Replaced <Link> with <a> for compatibility. Use <Link href="/register"> in your project. */}
              <a href="/register" className={`px-8 py-3 rounded-md text-lg transition-transform duration-200 hover:scale-105 ${buttonClasses.primary}`}>
                Start for Free
              </a>
              <a href="#features" className={`px-8 py-3 rounded-md text-lg transition-transform duration-200 hover:scale-105 ${buttonClasses.secondary}`}>
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="relative z-10 py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base font-semibold tracking-wider text-cyan-400 uppercase">Features</h2>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Everything you need to trade smarter
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
                Stop guessing. Start making data-driven decisions with our powerful suite of tools.
              </p>
            </div>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-cyan-700 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-500 text-black">
                    <SearchIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">Advanced Screener</h3>
                <p className="mt-2 text-base text-gray-400">Filter thousands of stocks with over 100+ technical and fundamental criteria to find your next winning trade.</p>
              </div>
              {/* Feature 2 */}
              <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-cyan-700 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-500 text-black">
                    <ZapIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">Real-Time Data</h3>
                <p className="mt-2 text-base text-gray-400">Access lightning-fast, real-time market data and news from global exchanges to stay ahead of the curve.</p>
              </div>
              {/* Feature 3 */}
              <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-cyan-700 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-500 text-black">
                    <ChartIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">Pro-Level Charting</h3>
                <p className="mt-2 text-base text-gray-400">Analyze price action with our fully-featured charting library, complete with drawing tools and indicators.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Showcase Section */}
        <section id="showcase" className="relative z-10 py-20 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                 <div className="lg:text-center">
                     <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        See FinSight in Action
                     </h2>
                     <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
                        A clean, intuitive interface designed for focus and speed.
                     </p>
                 </div>
                <div className="mt-12">
                   <div className="relative rounded-xl p-2 bg-gray-800 border-2 border-gray-700 shadow-2xl shadow-cyan-500/10">
                        {/* Placeholder for the app screenshot */}
                        <img 
                            src="https://placehold.co/1200x700/0A0A0A/444444?text=FinSight+App+Dashboard+UI\n(Screener+and+Charts)" 
                            alt="FinSight Application Dashboard"
                            className="rounded-lg w-full h-auto"
                        />
                   </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="relative z-10 py-20 sm:py-24 lg:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
             <div className="lg:text-center">
                  <h2 className="text-base font-semibold tracking-wider text-cyan-400 uppercase">Testimonials</h2>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Loved by traders worldwide
                  </p>
             </div>
             <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Testimonial 1 */}
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-300">"FinSight has completely changed how I approach the markets. The screener is unbelievably fast and powerful."</p>
                    <div className="mt-4 flex items-center">
                        <img className="h-12 w-12 rounded-full" src="https://i.pravatar.cc/48?u=1" alt="User avatar" />
                        <div className="ml-4">
                            <div className="text-base font-medium text-white">Sarah J.</div>
                            <div className="text-sm text-gray-500">Day Trader</div>
                        </div>
                    </div>
                </div>
                {/* Testimonial 2 */}
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-300">"The best platform for technical analysis I've ever used. The charting tools are second to none."</p>
                    <div className="mt-4 flex items-center">
                        <img className="h-12 w-12 rounded-full" src="https://i.pravatar.cc/48?u=2" alt="User avatar" />
                        <div className="ml-4">
                            <div className="text-base font-medium text-white">Michael B.</div>
                            <div className="text-sm text-gray-500">Swing Trader</div>
                        </div>
                    </div>
                </div>
                {/* Testimonial 3 */}
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-300">"As a long-term investor, FinSight helps me find undervalued gems with its deep fundamental data. Highly recommend!"</p>
                    <div className="mt-4 flex items-center">
                        <img className="h-12 w-12 rounded-full" src="https://i.pravatar.cc/48?u=3" alt="User avatar" />
                        <div className="ml-4">
                            <div className="text-base font-medium text-white">Emily L.</div>
                            <div className="text-sm text-gray-500">Investor</div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Ready to elevate your trading?
                </h2>
                <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto text-gray-400">
                    Join thousands of traders who are already using FinSight to gain their edge.
                    Sign up now and get started for free.
                </p>
                <div className="mt-8">
                    {/* DEV NOTE: Replaced <Link> with <a> for compatibility. Use <Link href="/register"> in your project. */}
                    <a href="/register" className={`px-10 py-4 rounded-md text-xl transition-transform duration-200 hover:scale-105 inline-block ${buttonClasses.primary}`}>
                        Claim Your Free Account
                    </a>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <a href="/" aria-label="Home">
                            <FinSightLogo />
                        </a>
                        <p className="mt-4 text-sm text-gray-500">© {new Date().getFullYear()} FinSight Inc. All rights reserved.</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#features" className="text-base text-gray-500 hover:text-white">Features</a></li>
                            <li><a href="#showcase" className="text-base text-gray-500 hover:text-white">Pricing</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-white">Changelog</a></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-white">About</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-white">Careers</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-white">Privacy</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-white">Terms</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
}
