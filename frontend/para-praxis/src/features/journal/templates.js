// Journal templates: small, opinionated prompts I actually use
// Keeping this separate so it's easy to expand later without touching UI code
export const JOURNAL_TEMPLATES = [
  {
    key: "daily",
    label: "Daily Reflection",
    title: "Daily Reflection",
    content: `# Daily Reflection\n\n**How do I feel today?**\n- \n\n**What did I do? (key activities / progress)**\n- \n\n**What problem(s) did I come across?**\n- \n\n**How did I approach / fix it?**\n- \n\n**What worked? What didn't?**\n- Worked: \n- Didn't: \n\n**What will I do next? (1–3 concrete next steps)**\n1. \n2. \n3. \n\n**Gratitude (optional)**\n- \n\n**Other notes / ideas**\n- `,
  },
  {
    key: "problem",
    label: "Problem Solving",
    title: "Problem-Solving Log",
    content: `# Problem-Solving Log\n\n**Problem Statement**\n- \n\n**Context / Impact**\n- \n\n**Hypotheses / Possible Causes**\n- \n\n**Attempts & Experiments**\n- Attempt 1: (what / result)\n- Attempt 2: (what / result)\n\n**Outcome / Fix**\n- \n\n**What I Learned**\n- \n\n**Preventive Action / Follow-up**\n- `,
  },
  {
    key: "mood",
    label: "Mood Check-In",
    title: "Mood Check-In",
    content: `# Mood Check-In\n\n**Current Mood (1–10 + descriptor)**\n- \n\n**Energy Level**\n- \n\n**Emotions Present**\n- \n\n**What contributed to this?**\n- \n\n**What helped / could help?**\n- \n\n**One intention for the rest of the day**\n- \n`,
  },
  {
    key: "achieve",
    label: "Wins & Gratitude",
    title: "Wins & Gratitude",
    content: `# Wins & Gratitude\n\n**Top 3 Wins / Achievements**\n1. \n2. \n3. \n\n**Challenges I Overcame**\n- \n\n**People / Tools that Helped**\n- \n\n**Grateful For**\n- \n\n**Next Small Step**\n- \n`,
  },
];
