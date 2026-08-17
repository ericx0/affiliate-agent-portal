import { apiFetch } from "./api";

export interface AgentNotification {
  id: string;
  category:
    | "commission_pending"
    | "commission_paid"
    | "commission_reversed"
    | "payout_sent"
    | "payout_failed"
    | "new_kol"
    | "team_order"
    | "system";
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  link: string;
}

export interface AgentNotificationPreferences {
  email_enabled: boolean;
  commission_pending: boolean;
  commission_paid: boolean;
  commission_reversed: boolean;
  payout_sent: boolean;
  payout_failed: boolean;
  new_kol: boolean;
  team_order: boolean;
}

const READ_STORAGE_KEY = "lcm_agent_read_notifications_v1";

function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function markAsRead(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const set = getReadIds();
    set.add(id);
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore storage quota error
  }
}

export function markAllAsRead(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const set = getReadIds();
    ids.forEach((id) => set.add(id));
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore storage quota error
  }
}

export async function fetchAgentNotifications(): Promise<AgentNotification[]> {
  const readSet = getReadIds();
  const notifications: AgentNotification[] = [];

  try {
    const [statsRes, commsRes, kolsRes] = await Promise.allSettled([
      apiFetch<{ data: { level?: number; team_size?: number; pending_payout_cents?: number; lifetime_paid_cents?: number } }>("/api/affiliate/agent/stats"),
      apiFetch<{ data: { commissions?: Array<{ id: string; amount_cents: number; status: string; created_at: string; kol_name?: string }> } }>("/api/affiliate/agent/commissions"),
      apiFetch<{ data: { kols?: Array<{ id: string; name: string; created_at: string; status: string }> } }>("/api/affiliate/agent/kols"),
    ]);

    if (commsRes.status === "fulfilled" && commsRes.value?.data?.commissions) {
      for (const comm of commsRes.value.data.commissions.slice(0, 15)) {
        const dollars = (comm.amount_cents / 100).toFixed(2);
        const isPaid = comm.status === "paid";
        const isReversed = comm.status === "reversed";
        const category = isPaid ? "commission_paid" : isReversed ? "commission_reversed" : "commission_pending";
        notifications.push({
          id: `agent_comm_${comm.id}`,
          category,
          title: isPaid ? "代理提成已结算入账" : isReversed ? "代理提成已被撤回" : "产生新的代理团队提成",
          description: `金额: $${dollars} USD · 队员: ${comm.kol_name || "下级 KOL"}`,
          createdAt: comm.created_at || new Date().toISOString(),
          read: readSet.has(`agent_comm_${comm.id}`),
          link: "/commissions",
        });
      }
    }

    if (kolsRes.status === "fulfilled" && kolsRes.value?.data?.kols) {
      for (const kol of kolsRes.value.data.kols.slice(0, 10)) {
        notifications.push({
          id: `kol_${kol.id}`,
          category: "new_kol",
          title: "新 KOL 队员成功加入团队",
          description: `KOL ${kol.name || "推广者"} 已绑定至您的代理团队`,
          createdAt: kol.created_at || new Date().toISOString(),
          read: readSet.has(`kol_${kol.id}`),
          link: `/kols/${kol.id}`,
        });
      }
    }
  } catch (err) {
    console.warn("fetchAgentNotifications error:", err);
  }

  // Sort by timestamp desc
  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function fetchAgentNotificationPrefs(): Promise<AgentNotificationPreferences> {
  try {
    const res = await apiFetch<{ data: Record<string, boolean> }>("/api/affiliate/me/notification-prefs");
    const raw = res?.data ?? {};
    return {
      email_enabled: raw.email_enabled !== false,
      commission_pending: raw.commission_pending !== false,
      commission_paid: raw.commission_paid !== false,
      commission_reversed: raw.commission_reversed !== false,
      payout_sent: raw.payout_sent !== false,
      payout_failed: raw.payout_failed !== false,
      new_kol: raw.new_kol !== false,
      team_order: raw.team_order !== false,
    };
  } catch {
    return {
      email_enabled: true,
      commission_pending: true,
      commission_paid: true,
      commission_reversed: true,
      payout_sent: true,
      payout_failed: true,
      new_kol: true,
      team_order: true,
    };
  }
}

export async function updateAgentNotificationPrefs(
  prefs: Partial<AgentNotificationPreferences>,
): Promise<void> {
  await apiFetch("/api/affiliate/me/notification-prefs", {
    method: "PATCH",
    body: { prefs },
  });
}
