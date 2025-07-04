import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-green-100 to-white px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-green-700 max-w-2xl leading-tight">
          Relax &amp; Grow with Therapeutic Mini‑Games
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-xl text-gray-700">
          Practice mindfulness, regulate emotions, and build healthy habits through short, playful experiences designed by therapists.
        </p>
        <Link
          href="#games"
          className="mt-6 inline-block rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700 transition-colors"
        >
          Explore Games
        </Link>
      </section>

      {/* Games Grid */}
      <section id="games" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-green-800 mb-10">
            Mini‑Games Library
          </h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {/* Breathing Game Card */}
            <Link
              href="/breathing"
              className="group rounded-xl border border-gray-200 hover:shadow-lg transition p-6 flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-700 group-hover:underline">
                  Guided Breathing
                </h3>
                <p className="mt-2 text-gray-600">
                  Follow the expanding circle to practice calm, deep breaths.
                </p>
              </div>
              <span className="mt-4 text-green-600 font-semibold group-hover:translate-x-1 transition-transform">
                Start →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
