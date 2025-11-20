import Link from "next/link";

export default function NavBar() {
  return (
    <div className="navbar container-custom">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Voyagr</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              href={"/auth/login"}
              className="btn btn-outline btn-sm btn-info rounded-2xl"
            >
              Login
            </Link>
          </li>
          <div className="divider divider-horizontal" />
          <li>
            <Link
              href={"/auth/signup"}
              className="btn btn-outline btn-sm btn-accent rounded-2xl"
            >
              Signup
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
