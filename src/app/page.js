import ServiceSlider from "@/components/ServiceSlider";
import Link from "next/link";

async function getServices() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/services?active=true`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export default async function Home() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="pt-8 pb-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-secondary">
            Meditime<span className="text-primary">.</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-secondary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/get-started"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Hero */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-secondary mb-6 leading-tight">
            Your Health Journey<br />
            <span className="text-primary">Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Personalized healthcare solutions designed around your unique needs. 
            Take our quick assessment to get started.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-white font-bold rounded-full hover:bg-secondary/90 transition-all shadow-lg"
          >
            Start Your Assessment
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 bg-gray-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of healthcare services. Each is tailored 
              with a personalized approach to address your specific needs.
            </p>
          </div>

          {services.length > 0 ? (
            <ServiceSlider services={services} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Services coming soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10k+", label: "Happy Patients" },
              { value: "50+", label: "Expert Doctors" },
              { value: "95%", label: "Satisfaction Rate" },
              { value: "24/7", label: "Support Available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          © 2026 Meditime. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
