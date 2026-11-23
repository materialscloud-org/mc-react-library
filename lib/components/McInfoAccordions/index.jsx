import { useState } from "react";
import McInfoAccordion from "../McInfoAccordion";

/**
 * McInfoAccordions: a list of McInfoAccordion, e.g. an app's "About",
 * "How to cite", "Acknowledgements".
 *
 *   <McInfoAccordions items={[{ title: "About", content: <About /> }, ...]} />
 *
 * - single (default true): at most one open; opening one closes the others.
 *   With single={false} each one opens and closes on its own.
 * - defaultOpen: the titles open at first (default none).
 */
export function McInfoAccordions({ items, single = true, defaultOpen = [] }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen.slice(0, single ? 1 : undefined)));
  const toggle = (title) =>
    setOpen((current) => {
      if (current.has(title)) {
        const next = new Set(current);
        next.delete(title);
        return next;
      }
      return new Set(single ? [title] : [...current, title]);
    });
  return items.map(({ title, content }) => (
    <McInfoAccordion key={title} title={title} open={open.has(title)} onToggle={() => toggle(title)}>
      {content}
    </McInfoAccordion>
  ));
}
