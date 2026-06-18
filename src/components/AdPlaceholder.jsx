export default function AdPlaceholder({ label = "Espacio publicitario", children }) {
  return (
    <section className="ad-placeholder" aria-label={label}>
      {children}
    </section>
  );
}
