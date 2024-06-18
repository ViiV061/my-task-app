import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">
        Welcome to My Task Kanban
      </h1>
      <p className="text-xl text-gray-600 mt-10">
        Select a board to get started.
      </p>
      <Link href="/boards">
        <button className="bg-gray-800 text-white py-2 px-4 rounded mt-10">
          My Boards
        </button>
      </Link>
    </div>
  );
}
