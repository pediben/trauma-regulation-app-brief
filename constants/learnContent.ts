export interface LearnCard {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  body: string;
  tag: string;
}

export const learnCards: LearnCard[] = [
  {
    id: 'why-body-reacts',
    title: 'Why your body keeps reacting',
    emoji: '🧠',
    tag: 'The basics',
    summary: "It's not in your head. It's in your nervous system.",
    body: `After something scary or painful, the body doesn't automatically reset to "safe." The nervous system learned that something dangerous happened — and it stays on guard, watching for signs it could happen again.\n\nThis is protective. It kept your ancestors alive. But it becomes a problem when the alert stays on long after the danger has passed.\n\nRacing heart. Tight chest. Feeling frozen or numb. Jumpiness. Trouble sleeping. These are not signs you're weak or broken. They're signs your body is doing exactly what it was designed to do — it just hasn't gotten the message that it's over.\n\nThe goal isn't to stop these reactions. It's to help your nervous system learn, slowly and gently, that it's safe enough to settle.`,
  },
  {
    id: 'fight-flight-freeze',
    title: 'Fight, flight, and freeze',
    emoji: '⚡',
    tag: 'How it works',
    summary: "Three survival responses — and why you can't just 'calm down.'",
    body: `When the nervous system senses danger, it has three automatic responses:\n\n**Fight** — get ready to defend yourself. Anger, tension, restlessness.\n\n**Flight** — get ready to run. Anxiety, panic, the urge to escape or avoid.\n\n**Freeze** — play dead when running or fighting won't help. Numbness, disconnection, feeling stuck.\n\nThese happen automatically, before the thinking brain has a chance to weigh in. That's why "just calm down" doesn't work — by the time you hear those words, your body has already made the decision.\n\nWhat does work is helping the body feel safe enough to come out of the threat response. That's what the exercises in this app are designed to do.`,
  },
  {
    id: 'hypervigilance',
    title: 'What is hypervigilance?',
    emoji: '👁',
    tag: 'Common experiences',
    summary: 'Always on alert. Scanning for danger. Exhausted from watching.',
    body: `Hypervigilance is the nervous system stuck in scanning mode — continuously checking for threats, even in safe situations.\n\nYou might notice: difficulty relaxing even when nothing is wrong, startling easily at sounds, constantly reading people's expressions, trouble concentrating, always sitting with your back to a wall.\n\nIt's exhausting. And it can make people around you say things like "you're too sensitive" or "you need to relax" — which isn't helpful, and misses the point.\n\nHypervigilance is the nervous system doing its job too well. The antidote isn't willpower. It's slowly accumulating experiences of being safe — which is what orienting, grounding, and slow breathing help create.`,
  },
  {
    id: 'window-of-tolerance',
    title: 'The Window of Tolerance',
    emoji: '🪟',
    tag: 'A useful map',
    summary: "There's a zone where you can think, feel, and function. Here's how to find it.",
    body: `Psychiatrist Dan Siegel described a "window of tolerance" — a zone of arousal where you can think clearly, feel your feelings without being overwhelmed, and respond rather than just react.\n\n**Above the window (hyperarousal):** Too activated. Anxiety, panic, anger, racing thoughts, hypervigilance. Hard to think straight.\n\n**In the window:** Regulated. Present. Able to connect, learn, and process.\n\n**Below the window (hypoarousal):** Too shut down. Numb, foggy, disconnected, exhausted, collapsed.\n\nTrauma tends to narrow the window — small things can push you above or below it. The exercises in this app are designed to help you notice where you are and gently move back toward the window.\n\nThe window can widen over time. That's healing.`,
  },
  {
    id: 'what-is-emdr',
    title: 'What is EMDR therapy?',
    emoji: '👁️',
    tag: 'Therapy options',
    summary: 'An evidence-based therapy that works with the body, not just the mind.',
    body: `EMDR stands for Eye Movement Desensitization and Reprocessing. It was developed by Francine Shapiro in the late 1980s and is now recognized by the WHO and APA as an evidence-based treatment for PTSD.\n\nIn EMDR, a trained therapist guides you to briefly hold a painful memory in mind while doing bilateral stimulation — typically slow left-right eye movements, tapping, or audio tones. This process seems to help the brain reprocess traumatic memories so they feel less overwhelming.\n\nEMDR requires a trained therapist. The bilateral stimulation alone (without a therapist guiding the memory work) is not EMDR — it's a calming tool, which is what this app offers.\n\nIf you're interested in EMDR therapy, the EMDR International Association (emdria.org) has a therapist finder.`,
  },
  {
    id: 'not-replacing-therapy',
    title: "This app isn't therapy",
    emoji: '🤝',
    tag: 'Important',
    summary: 'What this tool can do — and what it cannot.',
    body: `This app helps you settle your body, track your patterns, and understand what's happening to you. It does not process trauma.\n\nUnguided trauma processing — revisiting painful memories without a trained therapist present — can be retraumatizing. This app will never ask you to do that.\n\nWhat it can do:\n- Help you regulate in the moment\n- Show you patterns in your nervous system over time\n- Give you language for what you're experiencing\n- Support you between therapy sessions\n\nIf you're working with a therapist, this app works best as a companion to that work. If things feel overwhelming, there are people who can help. The 988 Suicide & Crisis Lifeline is available 24/7 — call or text 988.`,
  },
  {
    id: 'day-tight-compartments',
    title: 'Live in day-tight compartments',
    emoji: '🚪',
    tag: 'Carnegie',
    summary: "The past is gone. The future isn't here. Today is the only place you can actually live.",
    body: `Carnegie borrowed this image from Sir William Osler: a ship with watertight compartments. When one floods, the others stay dry. Your mind can work the same way.\n\nThe past is finished — nothing you do today can change it. The future hasn't arrived — worrying about it now only borrows trouble from days that may never come.\n\nToday is the one place you have any power. The one compartment that's open.\n\nThis isn't denial. It's focus. You can plan for tomorrow — that's today's work. But living inside tomorrow's fears, or yesterday's regrets, is time spent nowhere useful.\n\n**The question to ask when worry pulls you out of the present:** "What can I do today? Just today?"\n\nThat's the compartment you're in. Work with what you have.`,
  },
  {
    id: 'why-worries-never-happen',
    title: 'Why most of what you worry about never happens',
    emoji: '📊',
    tag: 'Carnegie',
    summary: "The math of worry is worse than you think — most of it is about things that don't come true.",
    body: `Studies on what people actually worry about consistently find the same pattern:\n\n**~40% of worries never happen at all.**\nThey exist only in anticipation — the feared event doesn't arrive.\n\n**~30% already happened and can't be changed.**\nThis is backward-facing worry: ruminating on past events. Nothing you do now changes what already occurred.\n\n**~22% are about trivial things.**\nThings that won't matter in a week, let alone a year.\n\n**~8% are real and potentially serious.**\nThis is the fraction that deserves your attention — and most of those are solvable.\n\nThat means roughly **92% of worry energy is misdirected.** Not because the fears don't feel real — they do — but because they're pointed at problems that either aren't coming or are already over.\n\nThe antidote isn't to stop worrying. It's to direct your mental energy at the 8% that is real, and let the rest go. That's not optimism — it's just the math.`,
  },
  {
    id: 'cooperate-with-the-inevitable',
    title: 'Cooperate with the inevitable',
    emoji: '🌊',
    tag: 'Carnegie',
    summary: 'What cannot be changed must be accepted — or it will control you.',
    body: `Carnegie described one of the most powerful mental moves available to a worried person: the willingness to accept what cannot be changed.\n\nThis sounds passive. It isn't.\n\nFighting against a fact — a diagnosis, a loss, a decision that can't be undone — doesn't change the fact. It only keeps you stuck in the fight, burning energy that could go toward what comes next.\n\n**Acceptance doesn't mean approval.** It means: "This is real. This happened. Now what?"\n\nCarnegie quoted William James: "The most useful thing you can do with suffering is to be willing to have it."\n\nThe psychological research backs this up. Acceptance — especially in trauma work — is not giving up. It's stopping the internal war against a reality that isn't going to move. When you stop fighting the fact, you free up the energy to move around it.\n\n**The question that unlocks this:** "Can I change this?"\n- If yes → make a plan and act.\n- If no → accept it and redirect.\n\nThat's the whole move. Simple. Not easy. But simple.`,
  },
];
