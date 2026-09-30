"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, Trash2, X } from "lucide-react";

type ConfirmDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Go back",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const Icon = destructive ? Trash2 : AlertCircle;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="spring-modal-overlay fixed inset-0 z-50 cursor-pointer bg-slate-950/45 backdrop-blur-md" />

        <Dialog.Content
          className="spring-modal-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-white/20 bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 p-6 text-white shadow-2xl shadow-blue-950/35 outline-none sm:p-7"
        >
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-20 z-0 h-64 w-64 rotate-12 text-white/[0.08]"
            strokeWidth={1.25}
          />

          <Dialog.Close
            className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <X size={17} />
          </Dialog.Close>

          <div className="relative z-10">
            <div className={[
              "mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-3xl shadow-xl shadow-blue-950/20",
              destructive ? "text-red-600" : "text-blue-700",
            ].join(" ")}>
              <Icon size={30} strokeWidth={2} />
            </div>

            <Dialog.Title className="mt-4 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </Dialog.Title>

            <Dialog.Description className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-blue-50/90 sm:text-base">
              {description}
            </Dialog.Description>

            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="min-h-11 rounded-xl bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {cancelLabel}
                </button>
              </Dialog.Close>

              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={[
                    "min-h-11 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-blue-50",
                    destructive ? "text-red-600" : "text-blue-700",
                  ].join(" ")}
                >
                  {confirmLabel}
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
