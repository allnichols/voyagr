import Link from "next/link";

export default function NavBar() {
  return (
    <div className="navbar container-custom">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Link</a>
          </li>
          <li>
            <a>Link 2</a>
          </li>
          <li>
            <Link href={"/auth/login"} className="btn btn-outline btn-sm btn-info rounded-2xl">Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
