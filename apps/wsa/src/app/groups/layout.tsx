"use client";

export default function GroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-theme-background via-theme-background-secondary to-theme-background flex min-h-screen w-full flex-1 flex-col bg-gradient-to-br">
      {children}
    </div>
  );
}
