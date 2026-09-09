import Link from "next/link";

export default function NotFound() {
  return (
    <main className="system-message">
      <span className="system-message__code">404</span>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="button button--primary" href="/dashboard">
        Return to dashboard
      </Link>
    </main>
  );
}
