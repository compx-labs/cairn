// app/routes/_index.tsx
import { Link } from "react-router";
import { project } from "~/data/project";
import { ThemeToggle } from "~/components/ThemeToggle";

export function meta() {
  return [
    { title: `${project.name} – Web3 Transparency Dashboard` },
    {
      name: "description",
      content:
        "Give your community clear, verifiable insight into your Web3 treasury. Every balance and transaction links back to the blockchain.",
    },
  ];
}

export default function Index() {
  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg transition-colors duration-200">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/cairn-logo.png"
              alt={project.name}
              className="h-16 w-16 rounded-full "
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/demo"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-brand-500 text-ink-800 hover:bg-brand-600 transition-colors duration-200"
            >
              See Demo
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-100/40 via-transparent to-transparent dark:from-brand-100/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              Web3 Transparency Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink-800 dark:text-dark-text font-heading">
              Show your community exactly where the money goes
            </h1>
            <p className="mt-6 text-lg text-ink-500 dark:text-dark-text-muted max-w-prose">
              Like the stone cairns that guide travelers in Scotland, Cairn
              guides your community with clear, verifiable insight into your
              Web3 treasury. Every balance and transaction links back to the
              blockchain.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-ink-800 font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-brand-500/25"
              >
                View Live Demo
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <a
                href="#problem"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-line dark:border-dark-border text-ink-700 dark:text-dark-text hover:bg-ink-50 dark:hover:bg-dark-border transition-colors duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-white dark:bg-dark-surface border border-line dark:border-dark-border shadow-xl overflow-hidden">
              <img
                src="/cairn-large-trans.svg"
                alt="Cairn dashboard preview"
                className="w-full h-full object-contain p-8 dark:hidden"
              />
              <img
                src="/cairn-large-trans-dark.svg"
                alt="Cairn dashboard preview"
                className="w-full h-full object-contain p-8 hidden dark:block"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-500 rounded-2xl blur-3xl opacity-20 animate-pulse" />
            <div
              className="absolute -top-6 -right-6 w-32 h-32 bg-brand-400 rounded-2xl blur-3xl opacity-20 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="py-16 bg-ink-50 dark:bg-dark-surface/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-ink-800 dark:text-dark-text font-heading mb-6">
              Web3 projects struggle with transparency
            </h2>
            <p className="text-lg text-ink-500 dark:text-dark-text-muted mb-12">
              Communities want to see how treasury funds are managed, but
              blockchain data is complex and hard to interpret. Projects need a
              simple way to show they're trustworthy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Data is scattered",
                body: "Treasury info lives across multiple wallets and blockchains, making it hard to get the full picture.",
              },
              {
                icon: "📊",
                title: "Raw data is confusing",
                body: "Blockchain explorers show technical details that don't translate to clear financial reporting.",
              },
              {
                icon: "⏰",
                title: "Manual updates are tedious",
                body: "Teams waste time creating spreadsheets and reports when they could be building.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-ink-800 dark:text-dark-text mb-2">
                  {item.title}
                </h3>
                <p className="text-ink-500 dark:text-dark-text-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-ink-800 dark:text-dark-text font-heading mb-4">
              Cairn makes transparency simple
            </h2>
            <p className="text-lg text-ink-500 dark:text-dark-text-muted max-w-2xl mx-auto">
              Connect your wallets once, and Cairn automatically creates a
              beautiful, always-up-to-date dashboard your community can trust.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Proof, not promises",
                body: "Every balance and transaction links directly to the blockchain. Your community can verify everything.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Updates automatically",
                body: "No more manual spreadsheets. Cairn pulls fresh data from the blockchain and updates your dashboard in real-time.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                ),
                title: "Built for humans",
                body: "Clean design, clear labels, and intuitive navigation make complex treasury data easy to understand.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-8 border border-line dark:border-dark-border bg-white dark:bg-dark-surface shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-ink-800 dark:text-dark-text mb-3">
                  {item.title}
                </h3>
                <p className="text-ink-500 dark:text-dark-text-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-ink-50 dark:bg-dark-surface/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-ink-800 dark:text-dark-text font-heading mb-4">
              How Cairn works
            </h2>
            <p className="text-lg text-ink-500 dark:text-dark-text-muted max-w-2xl mx-auto">
              Three simple steps to complete treasury transparency
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect your wallets",
                body: "Add your treasury wallet addresses and give them human-readable labels.",
              },
              {
                step: "02",
                title: "Cairn does the work",
                body: "We pull balances, transactions, and USD values from the blockchain automatically.",
              },
              {
                step: "03",
                title: "Share with confidence",
                body: "Your community gets a beautiful dashboard they can trust, updated in real-time.",
              },
            ].map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-500 text-white text-xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-ink-800 dark:text-dark-text mb-3">
                    {item.title}
                  </h3>
                  <p className="text-ink-500 dark:text-dark-text-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-brand-500 rounded-full" />
                Live Demo
              </div>
              <h3 className="text-3xl font-bold text-ink-800 dark:text-dark-text font-heading mb-4">
                See Cairn in action
              </h3>
              <p className="text-lg text-ink-500 dark:text-dark-text-muted mb-8">
                Explore a real treasury dashboard powered by Cairn. See live
                balances, recent transactions, and team information for the
                CompX project on Algorand.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Live wallet balances with USD values",
                  "Recent transactions across all wallets",
                  "Team profiles with contact information",
                  "Direct links to blockchain explorers",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-brand-600 dark:text-brand-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-ink-600 dark:text-dark-text-muted">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/demo"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-ink-800 font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-brand-500/25"
              >
                Explore the Demo
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white dark:bg-dark-surface border border-line dark:border-dark-border shadow-2xl overflow-hidden">
                <img
                  src="/app-screenshot-light.png"
                  alt="Cairn dashboard screenshot"
                  className="w-full h-full  dark:hidden"
                />
                <img
                  src="/app-screenshot-dark.png"
                  alt="Cairn dashboard screenshot"
                  className="w-full h-full  hidden dark:block"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500 rounded-2xl blur-2xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Ready to show your community where the money goes?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join the projects building trust through transparency. Start with
            our live demo, then get in touch to set up your own dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/demo"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-ink-800 font-semibold hover:bg-brand-50 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              View Demo Project
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a
              href="mailto:hello@cairn.guide"
              className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-colors duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-line dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <span className="text-sm text-ink-500 dark:text-dark-text-muted">
            © {new Date().getFullYear()} Cairn, created by CompX Labs
          </span>
          <Link
            to="/demo"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            See the demo →
          </Link>
        </div>
      </footer>
    </div>
  );
}
