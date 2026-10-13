import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-narrow section">
      <h1>Page not found</h1>
      <p className="lead">This page doesn&apos;t exist, or it moved.</p>
      <Link href="/" className="btn btn-primary">
        Back to case studies
      </Link>
    </div>
  );
}
