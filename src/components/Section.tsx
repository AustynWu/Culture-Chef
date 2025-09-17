type Props = { title: string; subtitle?: string; className?: string; children: React.ReactNode };

export default function Section({ title, subtitle, className, children }: Props) {
  return (
    <section className={`max-w-7xl mx-auto px-4 md:px-6 lg:px-8 ${className || ""}`}>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
