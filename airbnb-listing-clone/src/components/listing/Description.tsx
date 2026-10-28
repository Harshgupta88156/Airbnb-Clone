"use client";

import { useId, useState } from "react";
import { ChevronRightIcon } from "@/components/ui/icons";
import { PlaceholderLink } from "@/components/ui/PlaceholderLink";
import buttons from "@/components/ui/buttons.module.css";
import section from "./section.module.css";
import styles from "./Description.module.css";

export function Description({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();

  return (
    <div className={`${section.block} ${styles.description}`}>
      <p className={styles.notice}>
        Some info has been automatically translated.{" "}
        <PlaceholderLink className={buttons.link}>Show original</PlaceholderLink>
      </p>
      <p id={bodyId} className={styles.body} data-expanded={expanded || undefined}>
        {text}
      </p>
      <button
        type="button"
        className={`${buttons.chevronLink} ${styles.toggle}`}
        aria-expanded={expanded}
        aria-controls={bodyId}
        onClick={() => setExpanded((open) => !open)}
      >
        <span>{expanded ? "Show less" : "Show more"}</span>
        <ChevronRightIcon size={14} />
      </button>
    </div>
  );
}
