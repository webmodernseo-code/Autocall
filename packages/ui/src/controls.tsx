import { useId, type ComponentPropsWithRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ComponentPropsWithRef<"button"> & { variant?: "primary" | "secondary" }) {
  const classes = ["action", variant === "primary" && "action-primary", className].filter(Boolean);
  return <button type={type} className={classes.join(" ")} {...props} />;
}

export function TextField({ label, hint, error, id, ...props }: {
  label: string;
  hint?: string;
  error?: string;
} & Omit<ComponentPropsWithoutRef<"input">, "className">) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const description = error ?? hint;

  return (
    <div className="ui-field">
      <label htmlFor={inputId}>{label}</label>
      <input {...props} id={inputId} className="ui-control" aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={description ? descriptionId : props["aria-describedby"]} />
      {description && <small className={error ? "ui-field-error" : "muted"} id={descriptionId}>{description}</small>}
    </div>
  );
}

export function SelectField({ label, children, ...props }: { label: string } & Omit<ComponentPropsWithoutRef<"select">, "className">) {
  return (
    <label className="ui-field">
      <span>{label}</span>
      <select className="ui-control" {...props}>{children}</select>
    </label>
  );
}

export function Filters({ children }: { children: ReactNode }) {
  return <fieldset className="ui-filters"><legend>Filtres</legend><div>{children}</div></fieldset>;
}

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages < 2) return null;

  return (
    <nav className="ui-pagination" aria-label="Pagination">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Précédent</Button>
      <p aria-live="polite">Page {page} sur {totalPages}</p>
      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Suivant</Button>
    </nav>
  );
}
