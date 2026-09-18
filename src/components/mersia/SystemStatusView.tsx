import React from "react";
import { Activity, CheckCircle2, AlertCircle, Clock, Sparkles, Server } from "lucide-react";
import { SYSTEM_STATUSES, SystemServiceStatus } from "@/lib/workspace-store";

export const SystemStatusView: React.FC = () => {
  const getStatusBadge = (status: SystemServiceStatus["status"]) => {
    switch (status) {
      case "Operational":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Operational
          </span>
        );
      case "Prototype":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-gold/15 text-gold border border-gold/30">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Prototype
          </span>
        );
      case "Coming Soon":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-surface-muted text-muted-text border border-line">
            <Clock className="w-3 h-3 text-muted-text" />
            Coming Soon
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-rise-in select-none">
      {/* Header */}
      <div className="space-y-2.5 border-b border-line pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-xs font-mono font-medium">
          <Activity className="w-3.5 h-3.5" />
          <span>ALL OPERATIONAL PIPELINES HEALTHY</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          merSIA System Architecture & Status
        </h1>

        <p className="text-xs sm:text-sm text-muted-text max-w-3xl leading-relaxed">
          Real-time inspection of sectoral intelligence pipelines, vector retrieval indices, and
          prototype inference stages.
        </p>
      </div>

      {/* Services Table */}
      <div className="rounded-xl border border-line bg-surface shadow-2xs overflow-hidden">
        <div className="px-6 py-3.5 border-b border-line bg-surface-muted flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-text font-semibold">
            SERVICE COMPONENT REGISTER
          </span>
          <span className="text-[10px] font-mono text-muted-text">
            Wits REAL / merSETA Infrastructure
          </span>
        </div>

        <div className="divide-y divide-line">
          {SYSTEM_STATUSES.map((srv, idx) => (
            <div
              key={idx}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-muted/70 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-xs sm:text-sm font-semibold text-ink">{srv.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-muted text-muted-text border border-line">
                    {srv.category}
                  </span>
                </div>
                <p className="text-xs text-muted-text leading-relaxed max-w-xl">
                  {srv.description}
                </p>
              </div>

              <div className="flex items-center gap-4 self-start sm:self-center shrink-0">
                <span className="font-mono text-xs text-muted-text">{srv.latency}</span>
                {getStatusBadge(srv.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honesty note */}
      <div className="p-4 sm:p-5 rounded-xl border border-line bg-surface shadow-2xs text-xs text-muted-text space-y-2">
        <div className="flex items-center gap-2 font-semibold text-ink">
          <Server className="w-4 h-4 text-gold" />
          <span>Research Integrity Audit</span>
        </div>
        <p className="leading-relaxed">
          Status indicators strictly reflect actual system maturity. Components labeled{" "}
          <strong className="text-gold">Prototype</strong> or{" "}
          <strong className="text-ink">Coming Soon</strong> are transparently distinguished from
          production-ready machine learning services.
        </p>
      </div>
    </div>
  );
};

export default SystemStatusView;
