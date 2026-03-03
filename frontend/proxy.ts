import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  const subdomain = host.split(".")[0];

  // Allow localhost and root domain
  if (
    host.includes("localhost") ||
    subdomain === "www" ||
    subdomain === "intellifolio-subdomain"
  ) {
    return NextResponse.next();
  }

  // Ignore Next.js internals and static assets
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Rewrite subdomain → /slug
  return NextResponse.rewrite(new URL(`/${subdomain}`, req.url));
}