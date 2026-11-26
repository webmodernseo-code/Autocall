import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={["card", className].filter(Boolean).join(" ")} {...props} />;
}

export function Status({ kind, children }: { kind: "success" | "warning" | "danger" | "info" | "ai"; children: ReactNode }) {
  return <span className={`chip status-${kind}`}>{children}</span>;
}

export function KpiCard({ title, value, icon }: { title: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card kpi">
      <dt>{icon}{title}</dt>
      <dd><span className="metric">{value}</span></dd>
    </div>
  );
}

export function BarChart({ data }: { data: readonly { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map(({ value }) => value));

  return (
    <ul className="chart">
      {data.map(({ label, value }) => (
        <li key={label}>
          <span>{label}</span>
          <span className="chart-track" aria-hidden="true">
            <span className="chart-fill" style={{ width: `${Math.max(0, value) / max * 100}%` }} />
          </span>
          <span className="mono">{value}</span>
        </li>
      ))}
    </ul>
  );
}

type Column<Row> = { id: string; heading: string; cell: (row: Row) => ReactNode };

export function DataTable<Row>({ caption, columns, rows, rowKey }: { caption: string; columns: readonly Column<Row>[]; rows: readonly Row[]; rowKey: (row: Row) => string }) {
  return (
    <div className="ui-table-wrap" role="region" tabIndex={0} aria-label={caption}>
      <table className="ui-table">
        <caption>{caption}</caption>
        <thead><tr>{columns.map(({ id, heading }) => <th key={id} scope="col">{heading}</th>)}</tr></thead>
        <tbody>{rows.map((row) => (
          <tr key={rowKey(row)}>{columns.map(({ id, cell }) => <td key={id}>{cell(row)}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="ui-state"><p>{title}</p><p className="muted">{description}</p></div>;
}

export function ErrorState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="ui-state">
      <div role="alert"><p>{title}</p><p className="muted">{description}</p></div>
      {action}
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="ui-state" role="status">
      <span>{label}</span>
      <div className="ui-skeleton" aria-hidden="true" />
      <div className="ui-skeleton" aria-hidden="true" />
    </div>
  );
}
