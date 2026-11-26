"use client";

import type { ReactNode } from "react";
import { Dialog, DropdownMenu, Toast } from "radix-ui";
import { Button } from "./controls";

export function Menu({ label, items }: { label: string; items: readonly { label: string; onSelect: () => void }[] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild><Button variant="secondary">{label}</Button></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="ui-menu" align="start" sideOffset={4} collisionPadding={12}>
          {items.map((item) => (
            <DropdownMenu.Item className="ui-menu-item" key={item.label} onSelect={item.onSelect}>{item.label}</DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function ConfirmDialog({ trigger, title, description, confirmLabel, onConfirm }: {
  trigger: string;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild><Button variant="secondary">{trigger}</Button></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="ui-dialog-overlay" />
        <Dialog.Content className="ui-dialog">
          <Dialog.Title className="section-title">{title}</Dialog.Title>
          <Dialog.Description className="muted">{description}</Dialog.Description>
          <div className="actions">
            <Dialog.Close asChild><Button variant="secondary">Annuler</Button></Dialog.Close>
            <Dialog.Close asChild><Button onClick={onConfirm}>{confirmLabel}</Button></Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return <Toast.Provider label="Notification" swipeDirection="right">{children}<Toast.Viewport className="ui-toast-viewport" /></Toast.Provider>;
}

export function ToastNotice({ message, open, onOpenChange }: { message: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Toast.Root className="ui-toast" open={open} onOpenChange={onOpenChange}>
      <Toast.Title>{message}</Toast.Title>
      <Toast.Close asChild><Button variant="secondary">Fermer</Button></Toast.Close>
    </Toast.Root>
  );
}
