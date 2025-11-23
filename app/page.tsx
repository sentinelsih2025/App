import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Hello</h1>

      <div className="flex gap-4">
        <Link 
          href="/Home" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Home
        </Link>

        <Link 
          href="/login" 
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Login
        </Link>

        <Link 
          href="/signup" 
          className="px-4 py-2 bg-purple-600 text-white rounded-md"
        >
          Signup
        </Link>
      </div>
    </main>
  );
}
