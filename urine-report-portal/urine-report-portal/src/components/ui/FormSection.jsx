import Card from "./Card";

export default function FormSection({ title, description, children }) {
  return (
    <Card padding="p-6">
      <div className="mb-5">
        <h2 className="font-display font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="text-sm text-slate-600 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </Card>
  );
}
