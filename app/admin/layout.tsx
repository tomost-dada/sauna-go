export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-surface"
      style={{ maxWidth: "100%", margin: 0, position: "fixed", inset: 0, overflow: "auto", zIndex: 100 }}
    >
      {children}
    </div>
  );
}
