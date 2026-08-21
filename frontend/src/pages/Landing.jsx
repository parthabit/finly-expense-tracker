import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet, TrendingUp, PieChart, ShieldCheck, Sparkles, ArrowRight,
  BarChart3, Target, Bell, Check,
} from "lucide-react";

const FEATURES = [
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track cash flow, category spend, and trends with interactive charts." },
  { icon: Target, title: "Budgets & Goals", desc: "Set monthly budgets per category and watch progress bars fill live." },
  { icon: Sparkles, title: "AI-style Insights", desc: "Get plain-English callouts like 'Food spend is up 18% this month.'" },
  { icon: Bell, title: "Smart Reminders", desc: "Never miss a bill or blow a budget without a heads up." },
];

const PRICING = [
  { name: "Starter", price: "Free", desc: "For getting your spending under control.", features: ["Unlimited transactions", "3 budgets", "Basic analytics"] },
  { name: "Pro", price: "₹299/mo", desc: "For serious money management.", features: ["Everything in Starter", "Unlimited budgets & goals", "Receipt scanning", "Priority support"], highlighted: true },
  { name: "Team", price: "₹899/mo", desc: "Shared finances for households.", features: ["Everything in Pro", "Multiple members", "Shared wallets", "Admin controls"] },
];

const TESTIMONIALS = [
  { name: "Priya Menon", role: "Product Designer", quote: "Finly is the first budgeting app I've actually stuck with for six months straight." },
  { name: "Rohan Kapoor", role: "Freelance Developer", quote: "The category breakdowns finally showed me where my freelance income was leaking." },
  { name: "Sana Iyer", role: "Marketing Lead", quote: "Clean, fast, and it doesn't guilt-trip me — it just shows the numbers clearly." },
];

export default function Landing() {
  return (
    <div className="bg-surface dark:bg-secondary-950 text-secondary-900 dark:text-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b border-secondary-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
              <Wallet className="text-white" size={18} />
            </div>
            <span className="font-display font-bold text-lg">Finly</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary-500 dark:text-secondary-300">
            <a href="#features" className="hover:text-secondary-900 dark:hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-secondary-900 dark:hover:text-white transition">Pricing</a>
            <a href="#testimonials" className="hover:text-secondary-900 dark:hover:text-white transition">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white transition">
              Log in
            </Link>
            <Link to="/signup" className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-glow hover:bg-primary-600 transition">
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 rounded-full">
            <Sparkles size={12} /> Now with AI-style spending insights
          </span>
          <h1 className="mt-5 font-display font-bold text-4xl sm:text-5xl leading-[1.1] tracking-tight">
            Know exactly where your money goes.
          </h1>
          <p className="mt-5 text-lg text-secondary-500 dark:text-secondary-400 max-w-lg">
            Finly turns messy bank statements and cash spends into clear budgets, goals, and
            insights — so every rupee has a job.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3.5 rounded-xl shadow-glow hover:bg-primary-600 transition">
              Start free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 border border-secondary-200 dark:border-white/15 font-medium px-6 py-3.5 rounded-xl hover:bg-secondary-50 dark:hover:bg-white/5 transition">
              View demo
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-secondary-400">
            <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-accent" /> Bank-grade security</div>
            <div className="flex items-center gap-1.5"><Check size={16} className="text-accent" /> No card required</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-grad-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative rounded-3xl bg-white dark:bg-secondary-900 shadow-2xl border border-secondary-100 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-secondary-400">Total Balance</p>
              <span className="text-xs font-semibold text-accent bg-accent-50 dark:bg-accent-500/10 px-2 py-1 rounded-full">+12.4%</span>
            </div>
            <p className="font-display font-bold text-3xl">₹4,82,600</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-secondary-50 dark:bg-white/5 p-4">
                <p className="text-xs text-secondary-400">Income</p>
                <p className="font-semibold mt-1 text-accent">₹72,000</p>
              </div>
              <div className="rounded-2xl bg-secondary-50 dark:bg-white/5 p-4">
                <p className="text-xs text-secondary-400">Expenses</p>
                <p className="font-semibold mt-1 text-danger">₹38,450</p>
              </div>
            </div>
            <div className="mt-6 h-28 rounded-2xl bg-gradient-to-t from-primary-50 to-transparent dark:from-primary-500/10 flex items-end gap-1.5 p-3">
              {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-primary/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="font-display font-bold text-3xl">Everything you need, nothing you don't</h2>
          <p className="text-secondary-500 dark:text-secondary-400 mt-3">A finance dashboard that feels as good to use as it looks.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white dark:bg-secondary-900 shadow-card border border-secondary-100 dark:border-white/5 p-6"
            >
              <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary flex items-center justify-center mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="font-display font-bold text-3xl">Simple, transparent pricing</h2>
          <p className="text-secondary-500 dark:text-secondary-400 mt-3">Demo pricing — no payment is processed in this project.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-7 border ${
                p.highlighted
                  ? "bg-grad-dark text-white border-transparent shadow-2xl scale-[1.03]"
                  : "bg-white dark:bg-secondary-900 border-secondary-100 dark:border-white/5 shadow-card"
              }`}
            >
              <h3 className="font-display font-semibold text-lg">{p.name}</h3>
              <p className={`text-sm mt-1 ${p.highlighted ? "text-white/60" : "text-secondary-500 dark:text-secondary-400"}`}>{p.desc}</p>
              <p className="font-display font-bold text-3xl mt-5">{p.price}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={15} className={p.highlighted ? "text-accent-500" : "text-accent"} /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-7 block text-center font-medium px-4 py-3 rounded-xl transition ${
                  p.highlighted ? "bg-white text-secondary-900 hover:bg-secondary-100" : "bg-primary text-white hover:bg-primary-600"
                }`}
              >
                Choose {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="font-display font-bold text-3xl">Loved by people who hate spreadsheets</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white dark:bg-secondary-900 shadow-card border border-secondary-100 dark:border-white/5 p-6">
              <div className="flex gap-1 text-warning mb-3">{"★★★★★"}</div>
              <p className="text-sm text-secondary-600 dark:text-secondary-300">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-grad-primary flex items-center justify-center text-white text-sm font-semibold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-secondary-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-grad-primary p-12 text-center text-white relative overflow-hidden">
          <TrendingUp className="absolute -bottom-8 -right-8 opacity-10" size={200} />
          <PieChart className="absolute -top-10 -left-10 opacity-10" size={160} />
          <h2 className="font-display font-bold text-3xl relative">Take control of your money today</h2>
          <p className="mt-3 text-white/80 relative">Free to start. No credit card. Set up in under two minutes.</p>
          <Link to="/signup" className="mt-7 inline-flex items-center gap-2 bg-white text-primary font-medium px-7 py-3.5 rounded-xl hover:bg-secondary-50 transition relative">
            Create your account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-secondary-100 dark:border-white/5 py-8 text-center text-sm text-secondary-400">
        © {new Date().getFullYear()} Finly. Built as a portfolio demo project.
      </footer>
    </div>
  );
}
