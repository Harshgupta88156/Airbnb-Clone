"use client";

import type { AnchorHTMLAttributes } from "react";

// Links whose real destination lives outside this single-page clone (host sign-up, policy pages).
// They keep link semantics and styling but don't jump the page to the top.
export function PlaceholderLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href="#" {...props} onClick={(event) => event.preventDefault()} />;
}
