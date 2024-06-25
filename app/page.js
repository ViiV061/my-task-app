import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">
        Welcome to My Task Kanban
      </h1>
      <p className="text-xl text-gray-600 mt-10">
        Start managing your tasks with ease.
      </p>
      <Link href="/boards">
        <button className="bg-gray-800 text-white py-2 px-4 rounded mt-10">
          My Workspace
        </button>
      </Link>
      <div className="flex justify-center my-10">
        <Image
          src="/welcome.png"
          alt="Task Management Kanban Board"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
