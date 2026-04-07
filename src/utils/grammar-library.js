const grammarTopics = [
  {
    id: "be-introductions",
    level: "A1",
    title: "Be verbs for introductions",
    summary: "Use am, is, and are to introduce yourself and describe other people clearly.",
    rules: [
      "Use I am for your own name, country, or role.",
      "Use he is, she is, and they are for other people.",
      "Keep the order simple: subject + be + information."
    ],
    examples: [
      "I am Sofia. I am from Spain.",
      "She is a designer from Krakow.",
      "They are new students."
    ],
    coachNote: "When the learner is still building confidence, short clean be-verb sentences are better than long mixed sentences.",
    relatedLessonIds: [
      "a1-foundations-unit-1-lesson-1",
      "a1-foundations-unit-1-lesson-2",
      "a1-foundations-unit-1-lesson-3"
    ]
  },
  {
    id: "present-simple-routines",
    level: "A1",
    title: "Present simple for routines",
    summary: "Describe repeated daily actions with simple present verbs in time order.",
    rules: [
      "Use the base verb with I, you, we, and they.",
      "Put routine actions in a clear sequence from morning to evening.",
      "Add time phrases to make the routine easier to follow."
    ],
    examples: [
      "I wake up at 7:00 and go to work at 8:15.",
      "We study in the morning and relax in the evening.",
      "I leave home at 8:00 and do homework after dinner."
    ],
    coachNote: "This topic works best when learners say the actions aloud in order, not as isolated verbs.",
    relatedLessonIds: [
      "a1-foundations-unit-2-lesson-1",
      "a1-foundations-unit-2-lesson-3"
    ]
  },
  {
    id: "frequency-and-habits",
    level: "A1",
    title: "Frequency words and habits",
    summary: "Place words like usually and every day in natural positions to describe habits.",
    rules: [
      "Put usually, often, and sometimes before the main verb.",
      "Put every day and every week near the end of the sentence.",
      "Do not repeat the same frequency word twice in one short sentence."
    ],
    examples: [
      "She usually studies at night.",
      "I walk home every day.",
      "We sometimes eat lunch outside."
    ],
    coachNote: "Frequency words make beginner routines sound more natural without making the grammar much harder.",
    relatedLessonIds: [
      "a1-foundations-unit-2-lesson-2"
    ]
  },
  {
    id: "weekly-time-patterns",
    level: "A2",
    title: "Weekly time patterns",
    summary: "Use on + day and part-of-day phrases to describe a weekly schedule with more detail.",
    rules: [
      "Use on Monday, on Friday, or on weekends for day-based habits.",
      "Use in the morning, in the afternoon, and in the evening for wider time blocks.",
      "Mix fixed routines with weekly variation to sound more natural."
    ],
    examples: [
      "On Tuesday, I go to the gym.",
      "She visits clients in the afternoon.",
      "We work from home on Fridays."
    ],
    coachNote: "A2 learners benefit from combining one day phrase and one time-of-day phrase in the same sentence.",
    relatedLessonIds: [
      "a2-confidence-unit-1-lesson-1"
    ]
  },
  {
    id: "time-connectors",
    level: "A2",
    title: "Before, after, and during",
    summary: "Connect two routine actions or place an action inside a time block.",
    rules: [
      "Use before and after to connect one action to another.",
      "Use during to place an action inside a period such as class or work.",
      "Keep both linked actions in a simple, readable order."
    ],
    examples: [
      "I read after dinner.",
      "She stretches before work.",
      "We check messages during the break."
    ],
    coachNote: "These connectors give the learner more control over sequence without needing complex clauses.",
    relatedLessonIds: [
      "a2-confidence-unit-1-lesson-2"
    ]
  },
  {
    id: "time-ranges",
    level: "A2",
    title: "From ... to ... time ranges",
    summary: "Explain start and finish times clearly when describing schedules and shifts.",
    rules: [
      "Use from before the start time and to before the end time.",
      "Keep the same unit across the range, such as hours or dates.",
      "Use the structure once per sentence for clarity."
    ],
    examples: [
      "I work from 10:00 to 4:00.",
      "She studies from Monday to Thursday.",
      "The class runs from 9:00 to 12:00."
    ],
    coachNote: "Time-range sentences are strong portfolio content because they look practical and work-oriented.",
    relatedLessonIds: [
      "a2-confidence-unit-1-lesson-3"
    ]
  },
  {
    id: "third-person-present",
    level: "A2",
    title: "Third-person present simple",
    summary: "Add -s or -es correctly when describing another person's routine.",
    rules: [
      "Use the base verb for I, you, we, and they.",
      "Add -s or -es for he, she, and it.",
      "Watch common verbs like goes, does, and watches."
    ],
    examples: [
      "He takes the bus to work.",
      "Maria gets home at 6:00.",
      "She watches videos after class."
    ],
    coachNote: "This topic is one of the most common weak spots in A2 routine writing, so surface it often.",
    relatedLessonIds: [
      "a2-confidence-unit-2-lesson-1"
    ]
  },
  {
    id: "contrast-and-comparison",
    level: "A2",
    title: "Contrast and weekend comparison",
    summary: "Compare habits with but and with day-based contrasts such as Saturday versus Sunday.",
    rules: [
      "Use but to contrast two routine ideas.",
      "Use on Saturdays and on Sundays to compare repeated habits.",
      "Keep the compared actions parallel when possible."
    ],
    examples: [
      "I want to go out, but I usually stay home.",
      "On Saturdays, she wakes up late. On Sundays, she plans the week.",
      "He meets friends on Friday, but rests on Sunday."
    ],
    coachNote: "Contrast language helps the learner sound less robotic without needing advanced grammar.",
    relatedLessonIds: [
      "a2-confidence-unit-2-lesson-2",
      "a2-confidence-unit-2-lesson-3"
    ]
  }
];

export function getGrammarTopics() {
  return structuredClone(grammarTopics);
}

export function getGrammarTopicById(topicId) {
  const topic = grammarTopics.find((candidate) => candidate.id === topicId);
  return topic ? structuredClone(topic) : null;
}

export function getGrammarTopicForLesson(lessonId) {
  const topic = grammarTopics.find((candidate) => candidate.relatedLessonIds.includes(lessonId));
  return topic
    ? {
        id: topic.id,
        level: topic.level,
        title: topic.title,
        summary: topic.summary
      }
    : null;
}
