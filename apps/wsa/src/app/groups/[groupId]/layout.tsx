export default function Layout({
  children,
  groupinfo,
}: {
  children: React.ReactNode;
  groupinfo: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      {children}
      {groupinfo}
    </div>
  );
}
