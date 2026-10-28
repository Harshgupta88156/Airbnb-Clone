"use client";

import { HeartIcon, ShareIcon } from "@/components/ui/icons";
import { useShareAndSave } from "./useShareAndSave";
import styles from "./ListingTitle.module.css";

export function ListingTitle({ title }: { title: string }) {
  const { isSaved, share, toggleSave } = useShareAndSave();

  return (
    <section className={styles.titleRow}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <button type="button" className={styles.action} onClick={share}>
          <ShareIcon />
          <span>Share</span>
        </button>
        <button type="button" className={styles.action} onClick={toggleSave} aria-pressed={isSaved}>
          <HeartIcon filled={isSaved} />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </section>
  );
}
