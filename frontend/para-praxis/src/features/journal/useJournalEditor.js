import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

// A small stateful hook that owns the draft + save flow and exposes simple ops.
// This keeps JournalPage lean and makes each bit testable in isolation.
export function useJournalEditor({ current, update }) {
  const [draft, setDraft] = useState({ title: "", content: "" });
  const [dirty, setDirty] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [titleErrorToastShown, setTitleErrorToastShown] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (current) {
      setDraft({ title: current.title, content: current.content || "" });
      setDirty(false);
      setTitleError(false);
      setTitleErrorToastShown(false);
    }
  }, [current]);

  const doSave = useCallback(async () => {
    if (!current) return;
    const titleTrimmed = (draft.title || "").trim();
    if (!titleTrimmed) {
      setTitleError(true);
      if (!titleErrorToastShown) {
        toast.error("Please enter a title");
        setTitleErrorToastShown(true);
      }
      // Focus title input next tick
      requestAnimationFrame(() => {
        const titleInput = document.querySelector('input[placeholder="Title"]');
        titleInput && titleInput.focus();
      });
      return;
    }
    try {
      await update(current.id, draft);
      setDirty(false);
      setTitleError(false);
      setTitleErrorToastShown(false);
  } catch {
      if (!(draft.title || "").trim()) setTitleError(true);
      // Optionally log e
    }
  }, [current, draft, update, titleErrorToastShown]);

  const onField = (field, value) => {
    setDraft((d) => ({ ...d, [field]: value }));
    setDirty(true);
    if (field === "title" && (value || "").trim().length > 0) {
      setTitleError(false);
      setTitleErrorToastShown(false);
    }
  };

  return {
    draft,
    setDraft,
    dirty,
    setDirty,
    titleError,
    setTitleError,
    titleErrorToastShown,
    setTitleErrorToastShown,
    textareaRef,
    doSave,
    onField,
  };
}
