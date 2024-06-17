import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-300 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-primary text-xl font-bold">
          Task Management App
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-gray-600 hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link href="/boards" className="text-gray-600 hover:text-primary">
              Boards
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-gray-600 hover:text-primary">
              Login
            </Link>
          </li>
          <li>
            <Link href="/sign-up" className="text-gray-600 hover:text-primary">
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
