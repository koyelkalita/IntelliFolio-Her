import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // Extract subdomain
  const subdomain = host.split(".")[0];

  // Allow localhost & root domain
  if (
    host.includes("localhost") ||
    subdomain === "www" ||
    subdomain === "intellifolio"
  ) {
    return NextResponse.next();
  }

  // Rewrite subdomain → /slug
  return NextResponse.rewrite(
    new URL(`/${subdomain}`, req.url)
  );
}