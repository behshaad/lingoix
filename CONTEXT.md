# Lingoix

Lingoix is a language-learning platform centered on adaptive learning, learner progress, and educational management.

## Language

**Learner**:
A person whose language-learning path is personalized based on their behavior, performance, weaknesses, and progress.
_Avoid_: Student, user

**Learner Profile**:
The learning identity attached to a learner account, containing the learner's goals, CEFR level, language background, learning path, language performance, and adaptive-learning state. In the current product scope, each learner account has exactly one learner profile.
_Avoid_: Account, user profile, student profile

**Learner Archetype**:
A synthetic learner's latent behavioral pattern used to generate realistic learning events, such as vocabulary weakness, slow learning, fast improvement, plateauing, or balanced performance. A learner archetype may explain a skill weakness, but it is not the same thing as the final weakness category predicted by a classifier.
_Avoid_: Weakness label, learner type, class label

**Learner Profile Setup**:
The required onboarding step where a new learner provides enough language background, CEFR level, and goal information for Lingoix to create the learner profile before dashboard access.
_Avoid_: Signup, account setup, student onboarding

**Profile-Incomplete Learner Account**:
An authenticated learner account that does not yet have its required learner profile and must complete learner profile setup before accessing learner routes that depend on learning data.
_Avoid_: Guest, logged-out user, broken learner

**Learner Entry Intent**:
The learner's intended learner-only destination when they enter the account and learner profile setup flow, such as opening the dashboard, learning path, or resources after setup. Auth pages and learner profile setup itself are not valid learner entry intents.
_Avoid_: Button action, redirect flag, generic onboarding source

**Remembered Login Email**:
An email address that successfully signed in or signed up on the current device and can be suggested on the login form. A remembered login email is local convenience history, not proof that an account currently exists.
_Avoid_: Account directory, registered email list, backend email suggestion

**Account Profile**:
The authenticated person's general identity and contact surface, such as display name, avatar, phone, and bio. It is separate from the learner profile because it does not define language background, CEFR level, learning goals, or adaptive-learning state.
_Avoid_: Learner profile, learner profile setup, learning identity

**Student**:
A learner viewed in the context of a class, teacher, school, or institutional management workflow.
_Avoid_: Learner when discussing class administration

**Learning Path**:
The ordered and adjustable sequence of lessons, exercises, reviews, and assessments assigned to a learner.
_Avoid_: Roadmap, training structure, educational structure

**Learning Path Item**:
One structured step inside a learner's learning path, such as a lesson, exercise, review, assessment, or targeted exercise insertion, with a status that supports roadmap progress.
_Avoid_: Path string, roadmap card, task

**Path Progress**:
The learner's completion through their learning path based on finished learning path items. Path progress is separate from language performance and exercise accuracy.
_Avoid_: Accuracy, score, language performance

**Today's Path**:
The learner's current set of next learning path items for daily work. Today's path is the primary learner dashboard flow.
_Avoid_: Free practice, recommended exercises, task list

**Learner Dashboard**:
The learner-facing home surface organized around what the learner should do next today. It prioritizes today's path, path progress, targeted exercise insertions or assigned practice, relevant resources, language performance, and optional free practice.
_Avoid_: Student dashboard, admin dashboard, generic homepage

**Free Practice**:
Optional learner-initiated practice from the exercise bank that can create learning events and affect language performance, but does not advance path progress unless linked to a learning path item.
_Avoid_: Today's path, assignment, targeted exercise insertion

**Roadmap**:
The visual representation of a learner's learning path.
_Avoid_: Learning Path when referring only to the UI

**Learning Path Preview**:
A public explanation of how Lingoix personalizes learning paths before a learner has an assigned path. It is not the learner's actual learning path or roadmap.
_Avoid_: Learning Path, Roadmap

**Gamified Roadmap**:
A game-like roadmap presentation where learning path items appear as interactive stations that a learner can scroll through and open to start the lesson, exercise, review, or assessment for that station.
_Avoid_: Dashboard, generic course list, lesson menu

**Roadmap Station**:
An interactive visual station in the gamified roadmap that represents one learning path item and opens the learner's next lesson, exercise, review, or assessment for that item.
_Avoid_: Section, card, generic lesson button

**Roadmap Station Target**:
The concrete lesson, exercise, review, assessment, or resource opened by a roadmap station. If a roadmap station does not yet have a concrete target, it should be shown as unavailable rather than opening generic practice.
_Avoid_: Generic practice redirect, fallback page

**Learning Event**:
A timestamped record of one meaningful learner action, such as answering a question, requesting a hint, replaying audio, searching a word, submitting writing, or completing an exercise.
_Avoid_: Log, activity, interaction data

**Skill Weakness**:
A learner's demonstrated difficulty in a specific language skill or subskill, inferred from repeated error patterns, slow responses, hint usage, retries, or failed assessments.
_Avoid_: Weak point, problem area, learner problem

**Error Pattern**:
A repeated kind of learner mistake tied to a skill, such as vocabulary recall error, grammar tense error, listening misrecognition, spelling error, translation direction error, or slow-but-correct response. A single wrong answer is not an error pattern unless supported by repeated or related learning events.
_Avoid_: Error, mistake, wrong answer

**Targeted Exercise**:
An exercise selected or generated specifically to address a learner's current skill weakness, using recent learning events and error patterns. A targeted exercise is matched to the weakness; it is not necessarily easier.
_Avoid_: Practice, task, assignment

**Targeted Exercise Insertion**:
The act of adding targeted exercises to a learner's learning path to address a specific skill weakness.
_Avoid_: Assignment, task insertion, generic practice

**Adaptive Decision**:
A system decision that changes a learner's learning path, difficulty, exercise type, review schedule, or feedback based on learning events and inferred skill weaknesses.
_Avoid_: Recommendation, adjustment, personalization

**Proposed Adaptive Decision**:
A system-suggested adaptive decision that has not yet changed the learner's learning path and requires review before it can be applied.
_Avoid_: Active decision, applied decision

**Adaptive Decision Review**:
The teacher or school-admin evaluation of a proposed adaptive decision, resulting in approval, rejection, or an override before the decision is applied.
_Avoid_: Audit, status update, teacher review queue

**Adaptive Decision Evidence**:
The learning events, error patterns, response speed, hint usage, retries, and targeted-exercise matches used to justify a proposed adaptive decision.
_Avoid_: Explanation, metadata, debug data

**Adaptive Decision Explanation**:
A plain-language learner-facing summary of why an approved adaptive decision affected the learner's path, without exposing raw evidence snapshots or review internals.
_Avoid_: Evidence snapshot, debug reason, reviewer evidence

**Evidence Snapshot**:
The adaptive decision evidence captured at the moment a proposed adaptive decision is created, so reviewers can see what the system knew when it made the proposal.
_Avoid_: Live evidence, debug snapshot, audit log

**Adaptive Evaluation Metrics**:
Operational measures used to inspect adaptive learning behavior, such as proposed-decision approval rate, scoring reliability, learner improvement after targeted exercise insertion, time-to-mastery proxies, and exercise effectiveness. These metrics support research methodology but are not proof that the adaptive model is effective without a study design and real research data.
_Avoid_: Research validation, proof, model accuracy

**Research Results Index**:
An admin-accessible navigation surface for generated research artifacts, including reports, figures, tables, datasets, model comparisons, guidance, and research-result pages. It organizes research outputs; it is not the same thing as the operational admin panel.
_Avoid_: Admin overview, learner dashboard, resource library

**Interactive Research Explainer**:
A research-facing interface that lets admins inspect synthetic-data research outputs through filters, chart views, and plain-language interpretation. It explains generated research artifacts and does not apply adaptive decisions to learner paths.
_Avoid_: Adaptive decision console, live intervention tool, learner dashboard

**Scoring Reliability**:
The confidence that an exercise's scoring rule provides useful evidence for adaptive learning. Scoring reliability is not the same as educational correctness or teacher assessment.
_Avoid_: Correctness, grading accuracy, assessment validity

**Time-to-Mastery Proxy**:
An operational estimate of how many learning events or days it takes for a learner to show stable recent performance in a skill or subskill. It is a proxy for mastery, not proof of mastery.
_Avoid_: Mastery, final proficiency, CEFR achievement

**Simulated Mastery Proxy**:
A bounded score generated in a synthetic-data research simulation from recent accuracy, retention, response efficiency, and consistency. It is useful for comparing simulated learning outcomes, but it is not proof of CEFR mastery or real-world proficiency.
_Avoid_: True mastery, CEFR mastery, real proficiency score

**Synthetic Learner Dataset**:
Generated learner profiles, simulated learning behavior, learning events, error patterns, adaptive decisions, and progress states used for development and demos before real learner data exists. Synthetic data can support product development, but it is not evidence that an adaptive model is accurate.
_Avoid_: Real data, training data, research data

**Synthetic-Data Research Simulation**:
A controlled research prototype that evaluates whether adaptive-learning models can detect injected skill weaknesses and simulated outcome differences under explicitly stated synthetic-data assumptions. It can support academic method comparison, but it is not a validated learner study or proof of real-world educational effectiveness.
_Avoid_: Validated learner study, real-world effectiveness proof, real learner experiment

**German for Persian-Speaking Learners**:
The initial learning domain for Lingoix, focused on Persian-speaking learners studying German.
_Avoid_: Generic language learning when referring to the first dataset

**Admin Panel**:
The role-scoped management and reporting area for learners, students, learning paths, learning events, skill weaknesses, error patterns, targeted exercises, adaptive decisions, resources, exercises, teachers, schools, and performance summaries.
_Avoid_: Dashboard when referring to platform-wide management

**Language Performance**:
A learner's measurable ability across skill areas, including vocabulary recall, grammar accuracy, listening comprehension, reading comprehension, writing quality, translation direction, speaking ability, response speed, consistency over time, and error-pattern reduction.
_Avoid_: Score, progress, grade

**Language Performance Profile**:
A visual or summarized view of a learner's language performance across multiple skill areas. It can be shown to learners for self-awareness and to teachers or admins when reviewing a student in an institutional context.
_Avoid_: Adaptive evaluation metrics, grade chart, student ability score

**Conversation Practice**:
A speaking exercise where a learner responds to prompts within a practical topic, such as greetings, food, entertainment, travel, or daily life. Conversation practice can support speaking ability before pronunciation analysis is introduced.
_Avoid_: Pronunciation analysis, audio scoring, speaking test

**Conversation Practice Exercise**:
An exercise in the exercise bank that presents a topic-based conversation prompt and collects a learner response as evidence for speaking ability.
_Avoid_: Writing prompt, pronunciation exercise, speaking test

**Dictionary Workspace**:
The learner-facing translator and word-lookup surface where a learner can translate a full text, inspect a selected word's meaning, save useful words, and optionally hear pronunciation.
_Avoid_: Translator when referring to the full learning surface

**Full-Text Translation**:
A meaning-preserving translation of a learner-provided text from one language to another inside the dictionary workspace. Full-text translation is distinct from selected word lookup because it handles phrases, sentences, and context rather than one isolated word.
_Avoid_: Dictionary lookup, word lookup, identity fallback

**Selected Word Lookup**:
The act of selecting one word inside source or translated text and seeing a short learner-facing meaning for that word.
_Avoid_: Highlight, text selection, search when referring to the dictionary behavior

**Dictionary Lookup**:
A provider-backed lookup for one valid word that may return definition, translation, part of speech, pronunciation, example sentence, synonyms, antonyms, and spelling suggestions. A dictionary lookup should fail softly when providers cannot answer.
_Avoid_: Hardcoded word match, local word list

**Pronunciation Playback**:
Optional audio playback of a selected word so the learner can hear how it sounds in the word's language.
_Avoid_: Pronunciation analysis, speaking assessment

**CEFR Level**:
The learner's broad language level using the Common European Framework of Reference scale: A1, A2, B1, B2, C1, or C2. CEFR level is not the same as language performance; a learner can have uneven performance across skills within one level.
_Avoid_: Level when discussing skill-specific performance

**Resource**:
Learning material the learner consumes, such as a PDF, audio file, video, vocabulary list, or grammar explanation.
_Avoid_: Exercise, task

**Resource Library**:
The learner-facing collection of published resources available for browsing and consumption. Teachers, school admins, and platform admins may view the resource library to see what learners can access, but resource editing belongs in the admin panel.
_Avoid_: Resource editor, admin content management

**Published Resource**:
A resource that is visible to learners in resource browsing and can be recommended or linked from learning paths according to learner profile fit.
_Avoid_: Draft resource, admin-only resource, uploaded file

**Draft Resource**:
A resource being prepared or reviewed inside the admin panel that is not visible to learners.
_Avoid_: Published resource, hidden file, incomplete upload

**Archived Resource**:
A resource removed from learner visibility while being kept for history, references, or later recovery.
_Avoid_: Deleted resource, destroyed file, published resource

**Resource Attachment**:
A typed URL or path reference attached to a resource, such as a PDF, audio file, video, image, link, or text body that learners can consume.
_Avoid_: Uploaded file, exercise asset, resource type

**Exercise**:
An activity that produces evidence about learner performance, such as a quiz, flashcard review, listening answer, writing submission, translation task, or pronunciation task.
_Avoid_: Resource, content

**Exercise Interaction Type**:
The learner-facing response format of an exercise, such as multiple choice, flashcard, listening check, writing prompt, or conversation practice.
_Avoid_: Resource type, skill area, exercise category

**Exercise Bank**:
A structured collection of exercises tagged by CEFR level, skill, subskill, difficulty, and source resource. Targeted exercises should be selected from the exercise bank before dynamic generation is introduced.
_Avoid_: Dataset, question list, content bank

**Teacher**:
A person who manages students, assignments, attendance, and class-level reports.
_Avoid_: Admin, instructor

**Teacher Assignment**:
Work assigned by a teacher to students in a class. A teacher assignment is separate from a learner's adaptive today's path unless explicitly linked into the learning path.
_Avoid_: Today's path, free practice, targeted exercise insertion

**School Admin**:
A person who manages teachers, classes, students, and institution-level reports for one school.
_Avoid_: Admin, platform admin

**Platform Admin**:
A person who manages platform-wide content, resources, the exercise bank, synthetic data, adaptive rules, and system reports.
_Avoid_: Admin, school admin

**Role Permission**:
The access boundary attached to an account role. Learners access their own learning data, teachers access assigned classes and students, school admins access their school, and platform admins access platform-wide management.
_Avoid_: Visibility rule, access setting

**Role Home**:
The default destination for an authenticated account after login or an invalid route attempt. Learner accounts use valid learner entry intent when present; teacher, school-admin, and platform-admin accounts always return to the admin panel.
_Avoid_: Redirect fallback, previous page

**Class**:
A group where a teacher manages enrolled students. A learner may exist independently, but becomes a student when enrolled in a class.
_Avoid_: Course, group

**Account**:
An authenticated identity used to access Lingoix with a role such as learner, teacher, school admin, or platform admin. An account is not the same as a learner profile; teacher and admin accounts do not require learner profiles.
_Avoid_: Learner, Student, User

**Account Profile**:
The personal account settings surface where an authenticated account manages display name, contact details, short bio, and profile photo. An account profile is not the same as a learner profile and does not define learning goals, CEFR level, or adaptive-learning state.
_Avoid_: Learner Profile, Student Profile, learning profile

**Display Name**:
The personal name shown for an account across Lingoix. For learner accounts in the current product scope, the display name is also the learner name shown in learner-facing and student-facing views; for teacher and admin accounts, it does not rename institutional teacher, class, or school records.
_Avoid_: Username, legal name, profile name

**Profile Photo**:
The account-owned image used to visually represent a person across Lingoix. Learner-facing and student-facing surfaces may show the account profile photo when representing the same learner, but the learner profile does not own a separate photo.
_Avoid_: Learner photo, student avatar, profile picture

**Persistent Account Session**:
An authenticated account session that remains available across browser restarts until logout or session expiry. This is the expected result when an account chooses to be remembered during login.
_Avoid_: Permanent login, saved user

**Browser-Session Account Session**:
An authenticated account session intended to last only for the current browser session or until its shorter session expiry. This is the expected result when an account does not choose to be remembered during login.
_Avoid_: Temporary user, guest session

**Account Session Navigation**:
The navigation behavior that shows logged-out accounts a clear login entry, shows authenticated accounts their role home and logout actions, and returns accounts to public browsing after logout.
_Avoid_: Navbar polish, auth buttons

**Learner Detail Report**:
A report focused on one learner's language performance, learning path, learning events, skill weaknesses, targeted exercises, and adaptive decisions.
_Avoid_: Student report when the report is about personalization

**Class Report**:
A report comparing students in one class by skill performance, progress, attendance, and assignment completion.
_Avoid_: Learner detail report, platform report

**Platform Report**:
A report aggregating platform-wide trends such as common error patterns, exercise effectiveness, resource usage, and learner progress.
_Avoid_: Admin dashboard, class report

**Trilingual Interface**:
The product interface available in Persian, German, and English across learner, teacher, school, and platform-admin workflows.
_Avoid_: Multilingual when referring to the required product languages
