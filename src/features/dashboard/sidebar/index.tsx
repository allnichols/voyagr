import Menu from "./components/menu";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex h-full">
      <Menu />

      <main className="flex-1 p-1 overflow-y-hidden bg-base-200">
        <div className="md:pt-0 pt-10">{children}</div>
      </main>
    </div>
  );
}
