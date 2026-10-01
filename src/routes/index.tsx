import { createFileRoute } from "@tanstack/react-router";

const TITLE = "GAN Fraud Defense — Adversarially Hardened XGBoost";
const DESC =
  "Fraud detection on IEEE-CIS data: a CTGAN attack evaded 53.68% of a baseline XGBoost; adversarial retraining raised GAN detection to 100%.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const pipeline = [
  ["01", "Data", "IEEE-CIS transactions + identity, 590,540 rows, 39 features"],
  ["02", "Blue: Baseline", "XGBoost, 300 trees, class-weighted, categorical-aware"],
  ["03", "Red: CTGAN", "Trained on 16,530 real fraud records, 10,000 synthetic frauds"],
  ["04", "Attack", "Synthetic fraud fed to baseline to measure evasion"],
  ["05", "Blue: Retrain", "Fresh 10k GAN batch added to training data"],
  ["06", "Evaluate", "Untouched real test set + new GAN attack"],
];

const metrics = [
  ["ROC-AUC", "0.9481", "0.9445"],
  ["PR-AUC", "0.6686", "0.6547"],
  ["Fraud Recall", "0.8389", "0.8355"],
  ["Fraud F1-Score", "0.4050", "0.3937"],
  ["GAN Detection Rate", "46.32%", "100.00%"],
  ["GAN Evasion Rate", "53.68%", "0.00%"],
];

const samples = [
  ["316078", "LEGIT", "LEGIT", 12.52, "VERY LOW"],
  ["410211", "LEGIT", "LEGIT", 29.54, "LOW"],
  ["251027", "LEGIT", "LEGIT", 5.17, "VERY LOW"],
  ["72645", "FRAUD", "FRAUD", 99.11, "HIGH"],
  ["153357", "FRAUD", "FRAUD", 99.67, "HIGH"],
  ["143565", "FRAUD", "FRAUD", 85.77, "HIGH"],
] as const;

function Bar({ label, value, tone }: { label: string; value: number; tone: "bad" | "good" }) {
  return (
    <div>
      <div className="mb-2 flex justify-between font-mono text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={tone === "good" ? "text-primary" : "text-accent"}>{value.toFixed(2)}%</span>
      </div>
      <div className="h-3 bg-muted">
        <div
          className={tone === "good" ? "h-full bg-primary" : "h-full bg-accent"}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen font-sans">
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            // red team vs blue team
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Teaching a fraud detector to see <span className="glow text-primary">GAN-made fraud.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A CTGAN generated synthetic fraud that slipped past a strong XGBoost model more than half
            the time. Adversarial retraining closed the gap completely with almost no loss on real data.
          </p>
          <div className="mt-14 grid gap-px bg-border md:grid-cols-3">
            {[
              ["53.68%", "baseline evasion", "text-accent"],
              ["100%", "defended GAN detection", "text-primary"],
              ["+115.9%", "relative detection gain", "text-foreground"],
            ].map(([v, l, c]) => (
              <div key={l} className="bg-background p-6">
                <div className={`font-mono text-4xl font-semibold ${c}`}>{v}</div>
                <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">Pipeline</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pipeline.map(([n, t, d]) => (
            <div key={n} className="border border-border bg-card p-6 transition-colors hover:border-primary">
              <div className="font-mono text-primary">{n}</div>
              <div className="mt-3 text-xl font-semibold">{t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">The attack, before and after</h2>
            <p className="mt-4 text-muted-foreground">
              10,000 synthetic fraud transactions from CTGAN, scored at a 0.5 threshold.
            </p>
            <div className="mt-10 space-y-8">
              <Bar label="Baseline: detected" value={46.32} tone="bad" />
              <Bar label="Defended: detected" value={100} tone="good" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-3 font-normal">Metric</th>
                  <th className="py-3 text-right font-normal">Baseline</th>
                  <th className="py-3 text-right font-normal">Defended</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map(([m, b, d]) => (
                  <tr key={m} className="border-b border-border">
                    <td className="py-3">{m}</td>
                    <td className="py-3 text-right text-muted-foreground">{b}</td>
                    <td className="py-3 text-right text-primary">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">
              Real test set: 118,108 transactions (4,133 fraud).
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Prediction demo · defended model
        </h2>
        <div className="mt-8 grid gap-3">
          {samples.map(([id, a, p, prob, risk]) => (
            <div key={id} className="grid grid-cols-[1fr_auto] items-center gap-4 border border-border p-4 md:grid-cols-[120px_1fr_120px_110px]">
              <span className="font-mono text-muted-foreground">#{id}</span>
              <div className="hidden h-2 bg-muted md:block">
                <div className={prob > 50 ? "h-full bg-accent" : "h-full bg-primary"} style={{ width: `${prob}%` }} />
              </div>
              <span className="font-mono">{prob.toFixed(2)}%</span>
              <span className={`font-mono text-xs ${risk === "HIGH" ? "text-accent" : "text-primary"}`}>
                {p === a ? "✓ " : "✗ "}{risk}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Functional test accuracy: 100%.</p>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center font-mono text-xs text-muted-foreground">
        AI Fraud Detection with GAN-Based Adversarial Defense · XGBoost × CTGAN · IEEE-CIS
      </footer>
    </main>
  );
}
