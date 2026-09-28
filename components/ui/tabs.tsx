"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <TabsPrimitive.List className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--muted)] outline-none transition data-[state=active]:bg-[var(--muted-bg)] data-[state=active]:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}
