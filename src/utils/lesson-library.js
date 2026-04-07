function makeBlock(type, title, content, accent) {
  return { type, title, content, accent };
}

function makeQuestion(prompt, correct, distractorOne, distractorTwo, explanation = `Correct answer: ${correct}.`) {
  return {
    prompt,
    explanation,
    options: [
      { text: correct, isCorrect: true },
      { text: distractorOne, isCorrect: false },
      { text: distractorTwo, isCorrect: false }
    ]
  };
}

const lessonBlueprints = {
  "a1-foundations-unit-1-lesson-1": {
    summary: "Learn how to introduce yourself, say where you are from, and ask simple personal questions.",
    objectives: [
      "Introduce yourself with name, country, and city.",
      "Ask where another person is from.",
      "Build a three-sentence personal profile."
    ],
    blocks: [
      makeBlock("reading", "Meet Sofia", "Hi, I am Sofia. I am from Spain and I live in Madrid. I am a student.", "Read it twice and notice the order: name, country, city, role."),
      makeBlock("grammar", "I am / You are", "Use I am for your own information and you are when you ask or answer about another person.", "Example: I am from Italy. You are from Brazil."),
      makeBlock("vocabulary", "Core personal words", "name, country, city, student, teacher, live, from", "Use these words to build a short self-introduction."),
      makeBlock("practice", "Three-sentence intro", "Write or say three sentences about yourself using your name, country, and city.", "Keep it short and accurate before adding more details.")
    ],
    quiz: {
      title: "Introduce yourself checkpoint",
      description: "Check your understanding of simple introductions and personal details.",
      questions: [
        makeQuestion("Choose the best introduction.", "Hi, I am Leo. I am from Italy.", "Hi, Leo from Italy am.", "I from Italy Leo."),
        makeQuestion("Which question asks about country?", "Where are you from?", "What is your job?", "How old are you?"),
        makeQuestion("Complete the sentence: I ___ from France.", "am", "is", "are")
      ]
    }
  },
  "a1-foundations-unit-1-lesson-2": {
    summary: "Describe age and work with basic be-verbs and simple job vocabulary.",
    objectives: [
      "Say a person's age with years old.",
      "Describe basic jobs with he is and she is.",
      "Ask and answer simple work questions."
    ],
    blocks: [
      makeBlock("reading", "Meet Omar", "Omar is 24 years old. He is a chef. He works in a small restaurant.", "Notice how age and job appear in separate short sentences."),
      makeBlock("grammar", "He is / She is", "Use he is and she is to talk about another person. Use years old after a number for age.", "Example: She is 30 years old. He is a doctor."),
      makeBlock("vocabulary", "Jobs and age", "chef, doctor, driver, engineer, years old, work, office", "Try to match each job with one person you know."),
      makeBlock("practice", "Ask and answer", "Write two questions and two answers about age and work.", "Example: How old are you? I am 19 years old.")
    ],
    quiz: {
      title: "Age and work checkpoint",
      description: "Review age questions, jobs, and simple third-person patterns.",
      questions: [
        makeQuestion("Choose the correct sentence.", "She is a doctor.", "She are a doctor.", "She doctor is."),
        makeQuestion("What question asks about work?", "What do you do?", "Where do you live?", "What time is it?"),
        makeQuestion("Complete the sentence: He is 28 ___ old.", "years", "year", "age")
      ]
    }
  },
  "a1-foundations-unit-1-lesson-3": {
    summary: "Introduce another person using short listening-style recall and simple third-person sentences.",
    objectives: [
      "Introduce a classmate or friend clearly.",
      "Use she is or he is correctly in short profiles.",
      "Organize profile details in a natural order."
    ],
    blocks: [
      makeBlock("reading", "Classmate profile", "This is Anna. She is from Poland. She is a designer and she lives in Krakow.", "Read once for meaning, then once for details."),
      makeBlock("grammar", "Talking about another person", "Use she is or he is when you introduce a classmate or friend.", "Keep each sentence clear and short."),
      makeBlock("vocabulary", "Profile details", "friend, classmate, designer, from, live, in, work", "These words help you describe another learner."),
      makeBlock("practice", "Introduce a partner", "Write four short sentences about a classmate or an imaginary partner.", "Use name, country, city, and job.")
    ],
    quiz: {
      title: "Classmate introduction checkpoint",
      description: "Check if you can describe another person correctly.",
      questions: [
        makeQuestion("Choose the correct sentence.", "He lives in Rome.", "He live in Rome.", "He living in Rome."),
        makeQuestion("Which word shows another person?", "she", "I", "my"),
        makeQuestion("Best order for a short profile?", "Name, country, city, job", "Job, city, where, country", "Country, question, age, hello")
      ]
    }
  },
  "a1-foundations-unit-2-lesson-1": {
    summary: "Build the vocabulary for a simple morning routine using high-frequency actions.",
    objectives: [
      "Recognize common morning routine actions.",
      "Describe routine steps in time order.",
      "Use simple verbs for daily habits."
    ],
    blocks: [
      makeBlock("reading", "Tom's morning", "Tom wakes up at 7:00, takes a shower, eats breakfast, and goes to work at 8:15.", "Follow the actions in time order."),
      makeBlock("vocabulary", "Morning routine verbs", "wake up, get dressed, eat breakfast, go to work, drink coffee", "Say each verb with a time expression."),
      makeBlock("grammar", "Action order", "Use and to connect actions in a routine: I wake up and drink coffee.", "This helps your routine sound natural."),
      makeBlock("practice", "Put it in order", "Write four morning actions in the correct sequence.", "Start with wake up and end with work or class.")
    ],
    quiz: {
      title: "Morning routine checkpoint",
      description: "Review the main vocabulary for morning habits.",
      questions: [
        makeQuestion("Which action usually comes first?", "Wake up", "Go to bed", "Eat dinner"),
        makeQuestion("Choose the best sentence.", "I eat breakfast at 7:30.", "I breakfast eat at 7:30.", "I am eat breakfast."),
        makeQuestion("Which phrase is part of a morning routine?", "get dressed", "watch stars", "sleep late at night")
      ]
    }
  },
  "a1-foundations-unit-2-lesson-2": {
    summary: "Use every day and usually to describe repeated habits in simple present.",
    objectives: [
      "Place usually in the correct position.",
      "Use every day to show repetition.",
      "Write short habit sentences with frequency words."
    ],
    blocks: [
      makeBlock("reading", "Nina's week", "Nina usually studies in the library. She goes there every day after lunch.", "Notice where usually and every day appear."),
      makeBlock("grammar", "Frequency words", "Use usually before the main verb and every day at the end of the sentence.", "Example: I usually walk home. I study English every day."),
      makeBlock("vocabulary", "Habit markers", "always, usually, sometimes, every day, after lunch", "These words make your routine more specific."),
      makeBlock("practice", "Habit sentences", "Write three sentences about habits using usually or every day.", "Keep the subject and verb in the simple present.")
    ],
    quiz: {
      title: "Frequency checkpoint",
      description: "Check your control of simple adverbs and routine phrases.",
      questions: [
        makeQuestion("Choose the best sentence.", "She usually studies at night.", "She studies usually at night usually.", "She usually study at night."),
        makeQuestion("Which expression shows repetition?", "every day", "right now", "at the moment"),
        makeQuestion("Complete the sentence: I go to class ___ lunch.", "after", "under", "between")
      ]
    }
  },
  "a1-foundations-unit-2-lesson-3": {
    summary: "Describe a weekday from morning to evening with clear simple present sentences.",
    objectives: [
      "Describe a weekday in sequence from morning to evening.",
      "Use simple present verbs for repeated actions.",
      "Add time phrases to make routines clearer."
    ],
    blocks: [
      makeBlock("reading", "My weekday", "I leave home at 8:00, study until 1:00, have lunch with friends, and do homework in the evening.", "Use the text as a model for your own weekday."),
      makeBlock("grammar", "Simple present sequence", "Use simple present verbs to describe your routine from start to finish.", "Add time phrases to make the order easy to follow."),
      makeBlock("vocabulary", "Weekday actions", "leave home, study, have lunch, go home, do homework, relax", "Choose the actions that match your own day."),
      makeBlock("practice", "Your weekday paragraph", "Write five sentences about your weekday in time order.", "Start with the morning and finish with the evening.")
    ],
    quiz: {
      title: "Weekday description checkpoint",
      description: "Review weekday actions and simple routine structure.",
      questions: [
        makeQuestion("Choose the correct sentence.", "I do homework in the evening.", "I does homework in the evening.", "I doing homework in the evening."),
        makeQuestion("Which phrase shows time order?", "in the evening", "beautiful", "because"),
        makeQuestion("Best activity after study?", "have lunch", "wake up", "go to sleep at midnight")
      ]
    }
  },
  "a2-confidence-unit-1-lesson-1": {
    summary: "Describe a full weekly routine with clearer sequencing and more natural time expressions.",
    objectives: [
      "Describe weekly patterns with day names.",
      "Use part-of-day phrases more naturally.",
      "Combine fixed habits and weekly variation."
    ],
    blocks: [
      makeBlock("reading", "A busy week", "On weekdays, Laura starts work at 9:00, visits clients in the afternoon, and goes to the gym on Tuesday and Thursday.", "Notice the mix of weekday routine and weekly variation."),
      makeBlock("grammar", "Weekly routine patterns", "Use on + days and in the afternoon to describe repeated weekly actions.", "Example: On Monday, I work from home."),
      makeBlock("vocabulary", "Weekly schedule language", "weekdays, client, afternoon, twice a week, gym, meeting", "These terms help you describe a more detailed routine."),
      makeBlock("practice", "Your weekly pattern", "Write four sentences about what you do during the week.", "Include at least one day name and one time phrase.")
    ],
    quiz: {
      title: "Weekly routine checkpoint",
      description: "Check your control of weekly schedules and time language.",
      questions: [
        makeQuestion("Choose the best sentence.", "I go to the gym twice a week.", "I go twice gym a week.", "I goes to the gym twice a week."),
        makeQuestion("Which phrase names a part of the day?", "in the afternoon", "twice a week", "on Monday"),
        makeQuestion("Complete the sentence: ___ Friday, I work from home.", "On", "At", "In")
      ]
    }
  },
  "a2-confidence-unit-1-lesson-2": {
    summary: "Use common time expressions to talk about habits more naturally and precisely.",
    objectives: [
      "Link two actions with before and after.",
      "Use during inside a time block.",
      "Write more precise routine sentences."
    ],
    blocks: [
      makeBlock("reading", "Habit timing", "I normally check email before breakfast, and I often review my tasks after lunch.", "Watch how the speaker places time expressions around the verb."),
      makeBlock("grammar", "Before / after / during", "Use before and after to connect two routine actions. Use during for an action inside a time period.", "Example: I study after dinner."),
      makeBlock("vocabulary", "Timing connectors", "before, after, during, early, late, around", "These words add precision without making sentences long."),
      makeBlock("practice", "Daily timing drill", "Write three sentences using before, after, or during.", "Keep the same subject and build clear action pairs.")
    ],
    quiz: {
      title: "Time expressions checkpoint",
      description: "Review connectors that organize daily habits.",
      questions: [
        makeQuestion("Choose the correct sentence.", "I read after dinner.", "I after dinner read.", "I read dinner after."),
        makeQuestion("Which word connects two actions?", "before", "usually", "office"),
        makeQuestion("Complete the sentence: I stretch ___ work.", "before", "under", "between")
      ]
    }
  },
  "a2-confidence-unit-1-lesson-3": {
    summary: "Read and describe simple work and study schedules using practical timetable language.",
    objectives: [
      "Read simple work and study schedules.",
      "Use from ... to ... for time ranges.",
      "Compare two timetables in clear sentences."
    ],
    blocks: [
      makeBlock("reading", "Two schedules", "Mina studies from 9:00 to 12:00 and works from 2:00 to 6:00. Daniel teaches in the morning and prepares lessons in the evening.", "Compare both schedules and notice the repeated patterns."),
      makeBlock("grammar", "From ... to ...", "Use from ... to ... to explain the start and end of a time block.", "Example: I work from 10:00 to 4:00."),
      makeBlock("vocabulary", "Schedule words", "schedule, shift, class, prepare, break, evening", "Use these words to compare two people's timetables."),
      makeBlock("practice", "Compare two people", "Write three sentences comparing two schedules.", "Use both, but, or and.")
    ],
    quiz: {
      title: "Schedule reading checkpoint",
      description: "Check if you can read and describe simple timetables.",
      questions: [
        makeQuestion("Choose the correct sentence.", "She works from 2:00 to 6:00.", "She works to 2:00 from 6:00.", "She work from 2:00 to 6:00."),
        makeQuestion("Which word means a short stop in the day?", "break", "class", "shift"),
        makeQuestion("What do you use to show start and finish times?", "from ... to ...", "usually", "every day")
      ]
    }
  },
  "a2-confidence-unit-2-lesson-1": {
    summary: "Use present simple confidently to describe regular daily routines in fuller sentences.",
    objectives: [
      "Use third-person present simple accurately.",
      "Describe another person's routine with detail.",
      "Spot common verb ending mistakes."
    ],
    blocks: [
      makeBlock("reading", "Regular day", "Carlos gets up early, takes the bus to work, and usually cooks dinner when he gets home.", "Notice the verb endings with he."),
      makeBlock("grammar", "Third-person simple present", "Add -s or -es with he, she, and it in regular routines.", "Example: She watches videos after class."),
      makeBlock("vocabulary", "Routine verbs", "take the bus, cook dinner, get home, start early, finish work", "Choose verbs that fit your own schedule."),
      makeBlock("practice", "Describe one person", "Write four sentences about another person's routine.", "Use he or she in every sentence.")
    ],
    quiz: {
      title: "Daily routine grammar checkpoint",
      description: "Review third-person routine sentences and common daily actions.",
      questions: [
        makeQuestion("Choose the correct sentence.", "He takes the bus to work.", "He take the bus to work.", "He taking the bus to work."),
        makeQuestion("Which sentence is about a habit?", "She cooks dinner every night.", "She is cooking dinner now.", "She cooked dinner yesterday."),
        makeQuestion("Complete the sentence: Maria ___ home at 6:00.", "gets", "get", "getting")
      ]
    }
  },
  "a2-confidence-unit-2-lesson-2": {
    summary: "Talk about evening plans and after-work habits with more flexible conversation prompts.",
    objectives: [
      "Describe evening habits with natural phrases.",
      "Use but to contrast two routine ideas.",
      "Talk about after-work plans more flexibly."
    ],
    blocks: [
      makeBlock("reading", "After work", "After work, Ben sometimes meets friends, but he often stays home and watches a series with his sister.", "Notice how the sentence contrasts two common evening choices."),
      makeBlock("grammar", "But and often", "Use but to contrast two routine ideas and often to show common frequency.", "Example: I want to go out, but I usually stay home."),
      makeBlock("vocabulary", "Evening activities", "meet friends, stay home, watch a series, cook, rest, go out", "These phrases help you speak about life after work."),
      makeBlock("practice", "Two evening options", "Write two sentences about what you do after work or class.", "Use but in one of them.")
    ],
    quiz: {
      title: "Evening plans checkpoint",
      description: "Check your understanding of evening routine language.",
      questions: [
        makeQuestion("Choose the best sentence.", "I often stay home after class.", "I stay often home after class.", "I often stays home after class."),
        makeQuestion("Which word shows contrast?", "but", "and", "because"),
        makeQuestion("Which phrase is an evening activity?", "watch a series", "take a morning shower", "arrive yesterday")
      ]
    }
  },
  "a2-confidence-unit-2-lesson-3": {
    summary: "Compare weekend routines and speak with more confidence about different habits and preferences.",
    objectives: [
      "Compare Saturday and Sunday routines.",
      "Use repeated weekend patterns clearly.",
      "Show one contrast between different habits."
    ],
    blocks: [
      makeBlock("reading", "Two weekends", "On Saturdays, Kim wakes up late and visits her parents. On Sundays, she stays home, cleans the apartment, and plans the new week.", "Compare what changes from one day to another."),
      makeBlock("grammar", "Weekend comparison", "Use on Saturdays / on Sundays to compare repeated weekend habits.", "You can combine actions with and to build fuller ideas."),
      makeBlock("vocabulary", "Weekend actions", "visit parents, clean the apartment, plan the week, wake up late, relax", "Weekend language often mixes chores and free time."),
      makeBlock("practice", "Compare your weekend", "Write four sentences about Saturday and Sunday.", "Show one difference between the two days.")
    ],
    quiz: {
      title: "Weekend comparison checkpoint",
      description: "Review weekend vocabulary and comparison patterns.",
      questions: [
        makeQuestion("Choose the correct sentence.", "On Sundays, she plans the new week.", "On Sundays, she plan the new week.", "On Sundays, she planning the new week."),
        makeQuestion("Which phrase shows a weekend habit?", "wake up late", "right now", "last month"),
        makeQuestion("What is a good contrast pair?", "Saturday and Sunday", "morning and because", "week and slowly")
      ]
    }
  }
};

export function getLessonBlueprint(lessonId) {
  return lessonBlueprints[lessonId]
    ? structuredClone(lessonBlueprints[lessonId])
    : null;
}
