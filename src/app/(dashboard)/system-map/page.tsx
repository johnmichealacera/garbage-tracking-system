import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Network } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { PrintButton } from "@/components/dashboard/print-button";

// Static SVG markup — author-controlled, no user input, dangerouslySetInnerHTML is safe here.
const CHART_SVG = `
<svg viewBox="0 0 780 1268" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Role dependency flowchart for Socorro Garbage Tracking System"
     style="width:100%;height:auto;display:block;">
  <defs>
    <marker id="arr"       markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#64748b"/></marker>
    <marker id="arr-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#16a34a"/></marker>
    <marker id="arr-teal"  markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0d9488"/></marker>
    <marker id="arr-blue"  markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#2563eb"/></marker>
    <marker id="arr-purple"markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#7c3aed"/></marker>
  </defs>

  <!-- LGU HEADER -->
  <rect x="40" y="10" width="700" height="68" rx="12" fill="#0f172a"/>
  <text x="390" y="36" font-family="'Segoe UI',sans-serif" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">Municipality of Socorro, Surigao del Norte</text>
  <text x="390" y="57" font-family="'Segoe UI',sans-serif" font-size="11.5" fill="#94a3b8" text-anchor="middle">Local Government Unit  ·  Waste Management Operations  ·  Bucas Grande Foundation College Capstone Project</text>

  <line x1="390" y1="78" x2="390" y2="106" stroke="#64748b" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arr)"/>

  <!-- ADMIN / DISPATCHER -->
  <rect x="40" y="108" width="700" height="216" rx="12" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <rect x="40" y="108" width="700" height="44" rx="12" fill="#15803d"/>
  <rect x="40" y="130" width="700" height="22" fill="#15803d"/>
  <text x="390" y="136" font-family="'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">ADMIN &amp; DISPATCHER</text>
  <rect x="56" y="119" width="82" height="18" rx="9" fill="rgba(255,255,255,0.18)"/>
  <text x="97" y="131.5" font-family="'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#ffffff" text-anchor="middle">ROLE: STAFF</text>
  <text x="64" y="172" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="700" fill="#14532d">ADMIN ONLY</text>
  <text x="64" y="190" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Manage &amp; activate/deactivate user accounts</text>
  <text x="64" y="207" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Register and manage fleet trucks</text>
  <text x="64" y="224" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Configure barangay collection areas</text>
  <text x="64" y="241" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Full reporting and analytics access</text>
  <line x1="314" y1="158" x2="314" y2="306" stroke="#bbf7d0" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="328" y="172" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="700" fill="#14532d">DISPATCHER</text>
  <text x="328" y="190" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Create routes (name, date, barangay area)</text>
  <text x="328" y="207" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Add stops (address, type, expected kg)</text>
  <text x="328" y="224" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Assign truck + driver to each route</text>
  <text x="328" y="241" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Monitor route status and completion</text>
  <text x="328" y="258" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534">▸  Edit or update existing routes</text>
  <rect x="56" y="272" width="668" height="38" rx="7" fill="#dcfce7" stroke="#86efac" stroke-width="1.5"/>
  <text x="390" y="288" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="700" fill="#14532d" text-anchor="middle">⚠  SYSTEM ENTRY POINT</text>
  <text x="390" y="304" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#166534" text-anchor="middle">No route can be tracked, no pickup logged, and no report is generated until a route is created here.</text>

  <line x1="390" y1="324" x2="390" y2="358" stroke="#16a34a" stroke-width="2.5" marker-end="url(#arr-green)"/>
  <rect x="248" y="330" width="284" height="22" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="390" y="344.5" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="600" fill="#15803d" text-anchor="middle">Route created &amp; driver assigned</text>

  <!-- DRIVER -->
  <rect x="40" y="360" width="700" height="204" rx="12" fill="#f0fdfa" stroke="#0d9488" stroke-width="2"/>
  <rect x="40" y="360" width="700" height="44" rx="12" fill="#0f766e"/>
  <rect x="40" y="382" width="700" height="22" fill="#0f766e"/>
  <text x="390" y="388" font-family="'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">DRIVER</text>
  <rect x="56" y="371" width="72" height="18" rx="9" fill="rgba(255,255,255,0.18)"/>
  <text x="92" y="383.5" font-family="'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#ffffff" text-anchor="middle">ROLE: FIELD</text>
  <text x="64" y="422" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#134e4a">▸  Opens <tspan font-weight="700">My Route</tspan> page — data auto-refreshes every <tspan font-weight="700">10 seconds</tspan> via SWR polling</text>
  <text x="64" y="440" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#134e4a">▸  Views ordered stop list: barangay area, truck code, scheduled date, and stop sequence</text>
  <text x="64" y="458" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#134e4a">▸  Taps each stop to log its outcome:</text>
  <rect x="200" y="466" width="180" height="36" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
  <text x="290" y="481" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="700" fill="#065f46" text-anchor="middle">✓  MARK COMPLETED</text>
  <text x="290" y="496" font-family="'Segoe UI',sans-serif" font-size="10" fill="#047857" text-anchor="middle">Log volume (kg) + notes</text>
  <rect x="400" y="466" width="180" height="36" rx="8" fill="#fef3c7" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="490" y="481" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="700" fill="#92400e" text-anchor="middle">✗  MARK MISSED</text>
  <text x="490" y="496" font-family="'Segoe UI',sans-serif" font-size="10" fill="#b45309" text-anchor="middle">Log reason (road blocked, etc.)</text>
  <rect x="56" y="514" width="668" height="36" rx="7" fill="#ccfbf1" stroke="#5eead4" stroke-width="1.5"/>
  <text x="390" y="529" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="700" fill="#0f766e" text-anchor="middle">Atomic database transaction on every action:</text>
  <text x="390" y="545" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#0f766e" text-anchor="middle">Pickup/missed record saved  →  Route status auto-advances  (PLANNED → IN_PROGRESS → COMPLETED)</text>

  <line x1="390" y1="564" x2="390" y2="596" stroke="#0d9488" stroke-width="2.5" marker-end="url(#arr-teal)"/>
  <rect x="246" y="570" width="288" height="22" rx="7" fill="#ccfbf1" stroke="#0d9488" stroke-width="1.5"/>
  <text x="390" y="584.5" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="600" fill="#0f766e" text-anchor="middle">Pickup data written to database</text>

  <!-- ROUTE STATUS LIFECYCLE -->
  <rect x="100" y="598" width="580" height="82" rx="12" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
  <rect x="100" y="598" width="580" height="36" rx="12" fill="#78350f"/>
  <rect x="100" y="618" width="580" height="16" fill="#78350f"/>
  <text x="390" y="622" font-family="'Segoe UI',sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">ROUTE STATUS LIFECYCLE</text>
  <rect x="138" y="644" width="112" height="24" rx="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="194" y="660" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="700" fill="#334155" text-anchor="middle">PLANNED</text>
  <text x="264" y="660" font-family="'Segoe UI',sans-serif" font-size="18" fill="#d97706" text-anchor="middle">→</text>
  <rect x="284" y="644" width="134" height="24" rx="12" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5"/>
  <text x="351" y="660" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="700" fill="#0c4a6e" text-anchor="middle">IN_PROGRESS</text>
  <text x="432" y="660" font-family="'Segoe UI',sans-serif" font-size="18" fill="#d97706" text-anchor="middle">→</text>
  <rect x="452" y="644" width="114" height="24" rx="12" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
  <text x="509" y="660" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="700" fill="#14532d" text-anchor="middle">COMPLETED</text>

  <line x1="390" y1="680" x2="390" y2="712" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr-blue)"/>
  <rect x="226" y="686" width="328" height="22" rx="7" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="390" y="700.5" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="600" fill="#1d4ed8" text-anchor="middle">All data aggregated into dashboard KPIs &amp; reports</text>

  <!-- DASHBOARD & REPORTING -->
  <rect x="40" y="714" width="700" height="212" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <rect x="40" y="714" width="700" height="44" rx="12" fill="#1d4ed8"/>
  <rect x="40" y="736" width="700" height="22" fill="#1d4ed8"/>
  <text x="390" y="742" font-family="'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">DASHBOARD &amp; REPORTING  —  All Authenticated Roles</text>
  <rect x="56" y="725" width="68" height="18" rx="9" fill="rgba(255,255,255,0.18)"/>
  <text x="90" y="737.5" font-family="'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#ffffff" text-anchor="middle">SHARED</text>
  <text x="64" y="780" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="700" fill="#1e3a8a">KPI CARDS</text>
  <text x="64" y="797" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Total pickups (all routes)</text>
  <text x="64" y="813" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Total volume collected (kg)</text>
  <text x="64" y="829" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Today's pickups (PHT)</text>
  <text x="64" y="845" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Today's volume in kg (PHT)</text>
  <line x1="290" y1="768" x2="290" y2="894" stroke="#bfdbfe" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="304" y="780" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="700" fill="#1e3a8a">REPORTING CHARTS</text>
  <text x="304" y="797" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Pickups per day (bar chart)</text>
  <text x="304" y="813" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Pickups per barangay (bar chart)</text>
  <text x="304" y="829" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Barangay summary table</text>
  <text x="304" y="845" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Missed stops per barangay</text>
  <text x="304" y="861" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Date-range filterable</text>
  <line x1="536" y1="768" x2="536" y2="894" stroke="#bfdbfe" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="550" y="780" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="700" fill="#1e3a8a">TOP BARANGAYS</text>
  <text x="550" y="797" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Ranked by pickup count</text>
  <text x="550" y="813" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Volume per barangay</text>
  <text x="550" y="829" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Missed-stop indicators</text>
  <text x="550" y="845" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e40af">▸  Pickup history activity feed</text>
  <rect x="56" y="876" width="668" height="36" rx="7" fill="#dbeafe" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="390" y="890" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="700" fill="#1e3a8a" text-anchor="middle">Role-scoped access:</text>
  <text x="390" y="906" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#1e3a8a" text-anchor="middle">ADMIN — full access  ·  DISPATCHER — full access  ·  DRIVER — own pickups only in Pickup History</text>

  <line x1="390" y1="926" x2="390" y2="960" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#arr-purple)"/>
  <rect x="226" y="932" width="328" height="22" rx="7" fill="#f3e8ff" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="390" y="946.5" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="600" fill="#6d28d9" text-anchor="middle">Route &amp; stop status exposed to the public</text>

  <!-- PUBLIC SCHEDULE -->
  <rect x="40" y="962" width="700" height="178" rx="12" fill="#faf5ff" stroke="#7c3aed" stroke-width="2"/>
  <rect x="40" y="962" width="700" height="44" rx="12" fill="#6d28d9"/>
  <rect x="40" y="984" width="700" height="22" fill="#6d28d9"/>
  <text x="390" y="990" font-family="'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">PUBLIC SCHEDULE  —  /schedule  (No Login Required)</text>
  <rect x="56" y="973" width="70" height="18" rx="9" fill="rgba(255,255,255,0.18)"/>
  <text x="91" y="985.5" font-family="'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#ffffff" text-anchor="middle">PUBLIC</text>
  <text x="64" y="1028" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#4c1d95">▸  Any resident can visit /schedule — no account, no login needed</text>
  <text x="64" y="1045" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#4c1d95">▸  Select any calendar date to view all scheduled routes by barangay</text>
  <text x="64" y="1062" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#4c1d95">▸  Per-stop live status:  ✓ Completed  ·  ✗ Missed  ·  ○ Pending  — updates as drivers log</text>
  <text x="64" y="1079" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#4c1d95">▸  Interactive Leaflet map with color-coded stop markers (green = done, gray = pending)</text>
  <text x="64" y="1096" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#4c1d95">▸  Shows truck, plate number, assigned driver, and route progress per barangay</text>
  <rect x="56" y="1110" width="668" height="18" rx="6" fill="#ede9fe" stroke="#c4b5fd" stroke-width="1"/>
  <text x="390" y="1122.5" font-family="'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#5b21b6" text-anchor="middle">LGU accountability layer — community transparency without requiring any staff action</text>

  <line x1="390" y1="1140" x2="390" y2="1174" stroke="#64748b" stroke-width="2.5" marker-end="url(#arr)"/>
  <rect x="228" y="1146" width="324" height="22" rx="7" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="390" y="1160.5" font-family="'Segoe UI',sans-serif" font-size="10.5" font-weight="600" fill="#334155" text-anchor="middle">Direct service visibility to the community</text>

  <!-- COMMUNITY -->
  <rect x="120" y="1176" width="540" height="70" rx="12" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
  <rect x="120" y="1176" width="540" height="34" rx="12" fill="#334155"/>
  <rect x="120" y="1196" width="540" height="14" fill="#334155"/>
  <text x="390" y="1199" font-family="'Segoe UI',sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">COMMUNITY — Residents of Socorro, Surigao del Norte</text>
  <text x="390" y="1232" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="#475569" text-anchor="middle">Know which barangays were served today  ·  Trust in LGU waste management service delivery</text>

  <!-- FOOTER -->
  <line x1="40" y1="1254" x2="740" y2="1254" stroke="#e2e8f0" stroke-width="1"/>
  <text x="390" y="1264" font-family="'Segoe UI',sans-serif" font-size="9.5" fill="#94a3b8" text-anchor="middle">Next.js 16  ·  React 19  ·  PostgreSQL  ·  Prisma ORM  ·  NextAuth.js (RBAC)  ·  SWR  ·  Leaflet  ·  Recharts  ·  Tailwind CSS v4  ·  Philippine Time (UTC+8)</text>
</svg>
`;

export default async function SystemMapPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Reference"
        icon={<Network className="size-5" />}
        title="System map"
        description="Role dependency flowchart showing how each account type connects and depends on the others to deliver waste management transparency for Socorro."
        actions={<PrintButton />}
      />

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-lg ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
        <div
          className="p-4 sm:p-6"
          dangerouslySetInnerHTML={{ __html: CHART_SVG }}
        />
      </div>
    </div>
  );
}
