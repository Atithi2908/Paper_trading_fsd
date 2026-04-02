import { Link } from 'react-router-dom';

interface SnapshotItem {
  title: string;
  value: string;
  note: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface HeaderInfoPageProps {
  title: string;
  subtitle: string;
  snapshots: SnapshotItem[];
  faqs: FaqItem[];
}

export default function HeaderInfoPage({ title, subtitle, snapshots, faqs }: HeaderInfoPageProps) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="sticky top-0 z-40 border-b border-accent bg-page/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">TradeInCase</h1>
          <Link to="/" className="rounded-lg border border-accent px-4 py-2 text-sm text-secondary transition hover:text-ink">
            Back to Landing
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="theme-card mb-10 p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{title}</p>
          <h2 className="mb-3 text-4xl font-bold text-ink">{title} Overview</h2>
          <p className="max-w-3xl text-secondary">{subtitle}</p>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-ink">Snapshots</h3>
            <span className="text-sm text-secondary">Real-time style highlights</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {snapshots.map((item) => (
              <article key={item.title} className="theme-card p-6">
                <p className="text-sm text-secondary">{item.title}</p>
                <p className="my-2 text-3xl font-bold text-primary">{item.value}</p>
                <p className="text-sm text-accent">{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-bold text-ink">FAQ</h3>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details key={item.question} className="theme-card p-5">
                <summary className="cursor-pointer font-semibold text-ink">{item.question}</summary>
                <p className="mt-3 text-secondary">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}