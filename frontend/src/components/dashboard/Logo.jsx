"use client";

import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`text-2xl font-medium ${className}`}>
      <span className="text-gray-800">&lt;Intelli</span>
      <span className="text-red-500">Folio</span>
      <span className="text-blue-500">-</span>
      <span className="text-gray-800">Her&gt;</span>
    </Link>
  );
}
