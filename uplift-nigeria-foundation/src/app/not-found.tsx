import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-[#0b2e22] sm:text-6xl">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-800">Page Not Found</h2>
      <p className="mt-2 text-gray-600 max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-[#0b2e22] px-6 py-3 text-white font-medium transition hover:bg-[#0b2e22]/90"
      >
        Go back home
      </Link>
    </div>
  );
}
