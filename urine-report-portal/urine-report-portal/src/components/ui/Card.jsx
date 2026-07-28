export default function Card({ children, className = "", padding = "p-6" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-mist-200 shadow-[0_1px_2px_rgba(15,61,92,0.04),0_8px_24px_-16px_rgba(15,61,92,0.15)] ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
