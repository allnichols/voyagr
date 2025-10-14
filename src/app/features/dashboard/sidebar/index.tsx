import Menu from "./components/menu";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  //   add very light grey to background then refactor how the tirps cards look
  return (
    <div className="flex h-full">
      <aside className="w-[225px] bg-white p-1 border-r-1 border-base-200">
        {/* Sidebar content can go here */}
        <div className="p-2 ">
          <h2 className="text-xl font-bold text-secondary">Voyagr</h2>
        </div>
        <div className="divider mt-0" />
        <Menu />
      </aside>
      <main className="flex-1 p-1 overflow-y-hidden">{children}</main>
    </div>
  );
}
