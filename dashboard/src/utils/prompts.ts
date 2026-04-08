export interface EnginCTA {
  label: string;
  prompt: string;
}

export function getMissionCTAs(task: string, theme: string, due: string, attention: string | null): EnginCTA[] {
  const ctx = `Task: "${task}" (Theme: ${theme}, Due: ${due || 'no date'}${attention ? `, ${attention}` : ''}).`;
  return [
    {
      label: '¿Qué hago primero?',
      prompt: `${ctx}\n\nAs a PM advisor, tell this PM the single most important next step for this task. ONE sentence only, in Spanish. Be specific and actionable.`,
    },
    {
      label: '¿Cómo desbloquear?',
      prompt: `${ctx}\n\nAs a PM advisor, suggest how to unblock this task. ONE sentence only, in Spanish. Name a specific person, meeting, or action.`,
    },
    {
      label: '¿Cuál es el riesgo?',
      prompt: `${ctx}\n\nAs a PM advisor, identify the main risk of not resolving this task soon. ONE sentence only, in Spanish.`,
    },
  ];
}

export function getQuestionCTAs(question: string, theme: string, daysPending: number): EnginCTA[] {
  const ctx = `Open question (${daysPending}d unresolved, theme: ${theme}): "${question}".`;
  return [
    {
      label: '¿Cómo resolver?',
      prompt: `${ctx}\n\nAs a PM advisor, suggest the fastest way to get this answered. ONE sentence only, in Spanish. Be specific.`,
    },
    {
      label: '¿A quién preguntarle?',
      prompt: `${ctx}\n\nAs a PM advisor, identify who specifically should answer this question and why. ONE sentence only, in Spanish.`,
    },
    {
      label: '¿Qué data necesito?',
      prompt: `${ctx}\n\nAs a PM advisor, tell the PM what specific data or evidence they need to gather to resolve this. ONE sentence only, in Spanish.`,
    },
  ];
}
