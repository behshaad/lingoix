# Lingoix

Lingoix is a language-learning platform centered on adaptive learning, learner progress, and educational management.

## Language

**Learner**:
A person whose language-learning path is personalized based on their behavior, performance, weaknesses, and progress.
_Avoid_: Student, user

**Learner Profile**:
The learning identity attached to a learner account, containing the learner's goals, CEFR level, language background, learning path, language performance, and adaptive-learning state. In the current product scope, each learner account has exactly one learner profile.
_Avoid_: Account, user profile, student profile

**Learner Profile Setup**:
The required onboarding step where a new learner provides enough language background, CEFR level, and goal information for Lingoix to create the learner profile before dashboard access.
_Avoid_: Signup, account setup, student onboarding

**Profile-Incomplete Learner Account**:
An authenticated learner account that does not yet have its required learner profile and must complete learner profile setup before accessing learner routes that depend on learning data.
_Avoid_: Guest, logged-out user, broken learner

**Learner Entry Intent**:
The learner's intended destination when they enter the account and profile setup flow, such as starting free into the dashboard or viewing their learning path after setup.
_Avoid_: Button action, redirect flag, generic onboarding source

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

**Free Practice**:
Optional learner-initiated practice from the exercise bank that can create learning events and affect language performance, but does not advance path progress unless linked to a learning path item.
_Avoid_: Today's path, assignment, targeted exercise insertion

**Roadmap**:
The visual representation of a learner's learning path.
_Avoid_: Learning Path when referring only to the UI

**Gamified Roadmap**:
A game-like roadmap presentation where learning path items appear as interactive stations that a learner can scroll through and open to start the lesson, exercise, review, or assessment for that station.
_Avoid_: Dashboard, generic course list, lesson menu

**Roadmap Station**:
An interactive visual station in the gamified roadmap that represents one learning path item and opens the learner's next lesson, exercise, review, or assessment for that item.
_Avoid_: Section, card, generic lesson button

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

**Scoring Reliability**:
The confidence that an exercise's scoring rule provides useful evidence for adaptive learning. Scoring reliability is not the same as educational correctness or teacher assessment.
_Avoid_: Correctness, grading accuracy, assessment validity

**Time-to-Mastery Proxy**:
An operational estimate of how many learning events or days it takes for a learner to show stable recent performance in a skill or subskill. It is a proxy for mastery, not proof of mastery.
_Avoid_: Mastery, final proficiency, CEFR achievement

**Synthetic Learner Dataset**:
Generated learner profiles, simulated learning behavior, learning events, error patterns, adaptive decisions, and progress states used for development and demos before real learner data exists. Synthetic data can support product development, but it is not evidence that an adaptive model is accurate.
_Avoid_: Real data, training data, research data

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

**CEFR Level**:
The learner's broad language level using the Common European Framework of Reference scale: A1, A2, B1, B2, C1, or C2. CEFR level is not the same as language performance; a learner can have uneven performance across skills within one level.
_Avoid_: Level when discussing skill-specific performance

**Resource**:
Learning material the learner consumes, such as a PDF, audio file, video, vocabulary list, or grammar explanation.
_Avoid_: Exercise, task

**Published Resource**:
A resource that is visible to learners in resource browsing and can be recommended or linked from learning paths according to learner profile fit.
_Avoid_: Draft resource, admin-only resource, uploaded file

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

**School Admin**:
A person who manages teachers, classes, students, and institution-level reports for one school.
_Avoid_: Admin, platform admin

**Platform Admin**:
A person who manages platform-wide content, resources, the exercise bank, synthetic data, adaptive rules, and system reports.
_Avoid_: Admin, school admin

**Role Permission**:
The access boundary attached to an account role. Learners access their own learning data, teachers access assigned classes and students, school admins access their school, and platform admins access platform-wide management.
_Avoid_: Visibility rule, access setting

**Class**:
A group where a teacher manages enrolled students. A learner may exist independently, but becomes a student when enrolled in a class.
_Avoid_: Course, group

**Account**:
An authenticated identity used to access Lingoix with a role such as learner, teacher, school admin, or platform admin. An account is not the same as a learner profile; teacher and admin accounts do not require learner profiles.
_Avoid_: Learner, Student, User

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
