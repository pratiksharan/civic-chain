// src/lib/api.ts
import type { IssueAnalysis, DeptInfo, EscalationLevel } from '@/types';

async function callAI(prompt: string, systemPrompt: string): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' })) as { error?: string };
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  const data = await res.json() as { text: string };
  return data.text || '';
}

export async function extractIssue(text: string): Promise<IssueAnalysis | null> {
  const system = `You are a civic issue analysis AI for Bengaluru. Return ONLY valid JSON:
{"issueType":"garbage|pothole|water|electricity|streetlight|sewage|noise|encroachment|health|general","issueSummary":"one sentence","location":"extracted or 'Not specified'","ward":"ward number or null","duration":"e.g. 5 days","durationHours":number,"severity":"low|medium|high|critical","governmentLevel":"Local|State|Central","keyFacts":["fact1","fact2","fact3"],"urgencyReason":"brief","confidenceScore":number}
No markdown, only JSON.`;

  const raw = await callAI(text, system);
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim()) as IssueAnalysis;
  } catch {
    return null;
  }
}

export async function generateComplaint(issue: IssueAnalysis, dept: DeptInfo): Promise<string> {
  return callAI(
    `Issue: ${issue.issueSummary}\nLocation: ${issue.location}\nDuration: ${issue.duration}\nSeverity: ${issue.severity}\nDepartment: ${dept.dept}\nSLA: ${dept.sla} hours\n\nGenerate a COMPLETE formal complaint letter with ALL of the following sections:\n1. Subject line\n2. Addressee block (To, The Commissioner, ${dept.dept}, Bruhat Bengaluru Mahanagara Palike, Bengaluru)\n3. Salutation (Respected Sir/Madam)\n4. Opening paragraph: who you are and the purpose of this letter\n5. Detailed body: describe the issue fully — exact location, how long it has persisted, health and safety impact on residents\n6. Legal paragraph: reference the SLA of ${dept.sla} hours under the Sakala Guarantee of Services Act and state it has been violated\n7. Specific demands with a clear 48-hour deadline for resolution\n8. Escalation warning: state you will file an RTI and Sakala First Appeal if not resolved\n9. Closing: Yours sincerely, [Your Name], [Your Address], [Date: ${new Date().toLocaleDateString('en-IN')}]\n\nWrite the FULL letter. Do not truncate. Minimum 350 words.`,
    'You are an expert Indian civic legal writer. Generate a complete, detailed formal complaint letter using Indian bureaucratic language. The letter must be thorough — minimum 350 words. All 9 sections must be fully written. Do not abbreviate, summarise, or cut short any section.'
  );
}

export async function generateRTI(issue: IssueAnalysis, dept: DeptInfo): Promise<string> {
  return callAI(
    `Issue: ${issue.issueSummary}\nLocation: ${issue.location}\nDuration: ${issue.duration}\nDepartment: ${dept.dept}\nGov Level: ${dept.level}\n\nGenerate complete RTI application starting with "To,"`,
    'You are an RTI Act 2005 expert for India. Generate a complete, legally structured RTI application with all mandatory fields. Use formal language.'
  );
}

export async function generateReopenDraft(
  issue: IssueAnalysis,
  dept: DeptInfo,
  refNo: string,
  level: number,
  escalChain: EscalationLevel[]
): Promise<string> {
  const officer = escalChain[Math.min(level, escalChain.length - 1)];
  return callAI(
    `Issue: ${issue.issueSummary}\nLocation: ${issue.location}\nRef No: ${refNo}\nDepartment: ${dept.dept}\nEscalating to: ${officer.title}\nPrior claim: Department falsely claimed resolution.\n\nGenerate formal reopen/escalation letter starting with "Subject:". After the letter body, add a clearly separated section titled "HOW TO SUBMIT THIS LETTER" with actionable steps.`,
    'You are a civic enforcement expert. Write a formal reopen request letter citing false resolution claim. Formal Indian bureaucratic language.'
  );
}

export async function generateFirstAppeal(
  issue: IssueAnalysis,
  dept: DeptInfo,
  refNo: string,
  daysSince: number
): Promise<string> {
  return callAI(
    `Issue: ${issue.issueSummary}\nLocation: ${issue.location}\nRef No: ${refNo}\nDepartment: ${dept.dept}\nDays elapsed: ${daysSince} (SLA: ${dept.sla}h)\n\nGenerate First Appeal letter starting with "Subject:".`,
    'You are a civic legal expert. Write a formal First Appeal under Sakala Act / RTI Act citing SLA breach. Include reference number, original submission date, SLA violation details, legal provisions violated, and demand for resolution.'
  );
}

export async function generateSocialDraft(
  issue: IssueAnalysis,
  dept: DeptInfo,
  refNo: string,
  daysOverdue: number
): Promise<string> {
  return callAI(
    `Issue: ${issue.issueSummary}\nLocation: ${issue.location}\nRef No: ${refNo}\nDepartment: ${dept.dept}\nDays overdue: ${daysOverdue}\n\nGenerate two social media posts: one for Twitter/X (max 280 chars) and one for Instagram caption. Label each clearly.`,
    'You are a civic accountability advocate. Create factual, non-inflammatory social media posts demanding government accountability. Include reference number, issue, days overdue, relevant handles and hashtags.'
  );
}

export async function generateLokayuktaDraft(
  issue: IssueAnalysis,
  dept: DeptInfo,
  refNo: string,
  history: string
): Promise<string> {
  return callAI(
    `Issue: ${issue.issueSummary}\nLocation: ${issue.location}\nRef No: ${refNo}\nDepartment: ${dept.dept}\nEscalation history: ${history}\n\nGenerate Lokayukta Form I complaint starting with "To, The Honourable Lokayukta,"`,
    'You are a Lokayukta complaint specialist. Generate a formal Lokayukta Form I complaint citing maladministration and dereliction of duty under Karnataka Lokayukta Act.'
  );
}
