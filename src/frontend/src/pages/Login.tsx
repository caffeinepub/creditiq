import {
  Activity,
  AlertCircle,
  BarChart3,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: Zap,
    label: "AI-Powered Analysis",
    desc: "Multi-source data synthesis in minutes",
  },
  {
    icon: TrendingUp,
    label: "Deep Risk Signals",
    desc: "Early warning detection from unstructured data",
  },
  {
    icon: BarChart3,
    label: "Full CAM Reports",
    desc: "End-to-end appraisal memo generation",
  },
  {
    icon: ShieldCheck,
    label: "Compliance Ready",
    desc: "Audit trails for every decision",
  },
];

export default function Login() {
  const { login, isLoggingIn, isLoginError, loginError } =
    useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex overflow-hidden relative">
      {/* Decorative grid background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Glow blobs */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.58 0.22 255 / 0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.68 0.20 150 / 0.07) 0%, transparent 70%)",
        }}
      />

      {/* Left panel — branding / features */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative z-10 px-16 py-14 border-r border-border">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight">
            Credit<span className="text-primary">IQ</span>
          </span>
        </div>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary tracking-wide uppercase">
                Next-Gen Credit Intelligence
              </span>
            </div>
            <h1 className="font-display text-4xl xl:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
              AI-Powered Credit
              <br />
              <span className="text-primary">Decisioning</span> Engine
            </h1>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed font-body">
              Automate end-to-end credit appraisal for Indian corporates. Ingest
              multi-source data, detect early warning signals, and generate
              comprehensive CAM reports in minutes.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="flex gap-3 p-3.5 rounded-lg bg-card border border-border"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {f.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 relative z-10">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            Credit<span className="text-primary">IQ</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm space-y-8"
        >
          {/* Card */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-card space-y-6">
            {/* Header */}
            <div className="space-y-1.5 text-center">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground font-body">
                Sign in to access your credit appraisal workspace
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Internet Identity Sign-In */}
            <div className="space-y-4">
              <button
                type="button"
                data-ocid="login.primary_button"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full h-11 flex items-center justify-center gap-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-primary-glow"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span data-ocid="login.loading_state">Connecting…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign in with Internet Identity
                  </>
                )}
              </button>

              {/* Error state */}
              {isLoginError && loginError && (
                <motion.div
                  data-ocid="login.error_state"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/30 px-3.5 py-3"
                >
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive leading-relaxed">
                    {loginError.message}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              Secured by{" "}
              <span className="text-foreground font-medium">
                Internet Identity
              </span>{" "}
              — your credentials never leave your device.
            </p>
          </div>

          {/* Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span>All systems operational</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
