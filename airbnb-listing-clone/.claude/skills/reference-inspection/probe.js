// Paste into the reference page. Everything reads rendered output only.
(() => {
  const FONT = '"Airbnb Cereal VF"';
  const WEIGHTS = [300, 400, 500, 600, 700, 800];
  const canvas = document.createElement("canvas").getContext("2d");

  const measure = (text, weight, size) => {
    canvas.font = `${weight} ${size}px ${FONT}`;
    return canvas.measureText(text).width;
  };

  const describe = (el) => {
    if (!el?.tagName) return "?";
    const label = el.getAttribute("aria-label") || el.getAttribute("alt");
    const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 20);
    return (
      el.tagName.toLowerCase() +
      (label ? `[${label.slice(0, 24)}]` : "") +
      (text ? `"${text}"` : "")
    );
  };

  // Content-area height is ~1.29em for Cereal, which gives a size estimate to search around.
  function fitNode(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const [line] = [...range.getClientRects()].filter((r) => r.width > 0);
    const text = node.textContent.replace(/\s+/g, " ");
    const estimate = line.height / 1.29;
    let best = null;
    for (let size = Math.floor(estimate) - 3; size <= Math.ceil(estimate) + 3; size++) {
      for (const weight of WEIGHTS) {
        const error = line.width - measure(text, weight, size);
        if (!best || Math.abs(error) < Math.abs(best.error)) best = { size, weight, error };
      }
    }
    return best;
  }

  // Same style, several strings: the right size/weight is the one where the implied
  // letter-spacing is identical for every sample.
  function fitMany(samples, sizes = [10, 40]) {
    const results = [];
    for (let size = sizes[0]; size <= sizes[1]; size++) {
      for (const weight of WEIGHTS) {
        const spacing = samples.map(
          ([text, width]) => (width - measure(text, weight, size)) / text.length,
        );
        const mean = spacing.reduce((a, b) => a + b, 0) / spacing.length;
        const spread = Math.sqrt(spacing.reduce((a, b) => a + (b - mean) ** 2, 0) / spacing.length);
        results.push({ size, weight, letterSpacing: +mean.toFixed(3), spread: +spread.toFixed(4) });
      }
    }
    return results.sort((a, b) => a.spread - b.spread).slice(0, 5);
  }

  function text(root, tag) {
    const origin = root.getBoundingClientRect();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const value = node.textContent.replace(/\s+/g, " ").trim();
      if (!value) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const lines = [...range.getClientRects()].filter((r) => r.width > 0);
      if (!lines.length) continue;
      const box = range.getBoundingClientRect();
      const pitch = lines.length > 1 ? (lines[1].top - lines[0].top).toFixed(1) : "-";
      const fit = lines.length === 1 ? fitNode(node) : null;
      console.log(
        [
          tag,
          value.slice(0, 26),
          `x${Math.round(box.left - origin.left)}`,
          `y${Math.round(box.top - origin.top)}`,
          `w${box.width.toFixed(1)}`,
          `lines${lines.length}`,
          `pitch${pitch}`,
          fit ? `${fit.weight}@${fit.size}px err${fit.error.toFixed(1)}` : "",
        ].join(" "),
      );
    }
  }

  function boxes(root, tag) {
    const origin = root.getBoundingClientRect();
    const candidates = root.querySelectorAll(
      "img, svg, button, a, input, hr, [role], [aria-label], div",
    );
    for (const el of candidates) {
      if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
      const r = el.getBoundingClientRect();
      const isDivider = el.tagName === "DIV" && r.height > 0 && r.height <= 2 && r.width > 20;
      if (el.tagName === "DIV" && !isDivider) continue;
      if (!r.width || !r.height) continue;
      console.log(
        [
          tag,
          describe(el),
          `x${Math.round(r.left - origin.left)}`,
          `y${Math.round(r.top - origin.top)}`,
          `w${r.width.toFixed(1)}`,
          `h${r.height.toFixed(1)}`,
        ].join(" "),
      );
    }
  }

  function motion(tag) {
    for (const animation of document.getAnimations()) {
      const timing = animation.effect.getTiming();
      const name = animation.transitionProperty
        ? `transition:${animation.transitionProperty}`
        : `animation:${animation.animationName}`;
      const frames = animation.effect
        .getKeyframes()
        .map((frame) =>
          Object.entries(frame)
            .filter(([key]) => !["offset", "computedOffset", "easing", "composite"].includes(key))
            .map(([key, value]) => `${key}=${value}`)
            .join(";"),
        )
        .join(" -> ");
      console.log(
        [
          tag,
          describe(animation.effect.target),
          name,
          `${timing.duration}ms`,
          `delay ${timing.delay}`,
          timing.easing,
          frames,
        ].join(" | "),
      );
    }
  }

  window.probe = { text, boxes, motion, fitNode, fitMany, describe };
})();
