# Lingoix

Lingoix is a language-learning platform centered on adaptive learning, learner progress, and educational management.

## Language

**Learner**:
A person whose language-learning path is personalized based on their behavior, performance, weaknesses, and progress.
_Avoid_: Student, user

**Learner Profile**:
The learning identity attached to a learner account, containing the learner's goals, CEFR level, language background, learning path, language performance, and adaptive-learning state.
_Avoid_: Account, user profile, student profile

**Learner Profile Setup**:
The required onboarding step where a new learner provides enough language background, CEFR level, and goal information for Lingoix to create the learner profile before dashboard access.
_Avoid_: Signup, account setup, student onboarding

**Student**:
A learner viewed in the context of a class, teacher, school, or institutional management workflow.
_Avoid_: Learner when discussing class administration

**Learning Path**:
The ordered and adjustable sequence of lessons, exercises, reviews, and assessments assigned to a learner.
_Avoid_: Roadmap, training structure, educational structure

**Roadmap**:
The visual representation of a learner's learning path.
_Avoid_: Learning Path when referring only to the UI

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

**Adaptive Decision**:
A system decision that changes a learner's learning path, difficulty, exercise type, review schedule, or feedback based on learning events and inferred skill weaknesses.
_Avoid_: Recommendation, adjustment, personalization

**Synthetic Learner Dataset**:
Generated learner profiles, simulated learning behavior, learning events, error patterns, adaptive decisions, and progress states used for development and demos before real learner data exists. Synthetic data can support product development, but it is not evidence that an adaptive model is accurate.
_Avoid_: Real data, training data, research data

**German for Persian-Speaking Learners**:
The initial learning domain for Lingoix, focused on Persian-speaking learners studying German.
_Avoid_: Generic language learning when referring to the first dataset

**Admin Panel**:
The management and reporting area for learners, students, learning paths, learning events, skill weaknesses, error patterns, targeted exercises, adaptive decisions, resources, exercises, teachers, schools, and performance summaries.
_Avoid_: Dashboard when referring to platform-wide management

**Language Performance**:
A learner's measurable ability across skill areas, including vocabulary recall, grammar accuracy, listening comprehension, reading comprehension, writing quality, response speed, consistency over time, and error-pattern reduction.
_Avoid_: Score, progress, grade

**CEFR Level**:
The learner's broad language level using the Common European Framework of Reference scale: A1, A2, B1, B2, C1, or C2. CEFR level is not the same as language performance; a learner can have uneven performance across skills within one level.
_Avoid_: Level when discussing skill-specific performance

**Resource**:
Learning material the learner consumes, such as a PDF, audio file, video, vocabulary list, or grammar explanation.
_Avoid_: Exercise, task

**Exercise**:
An activity that produces evidence about learner performance, such as a quiz, flashcard review, listening answer, writing submission, translation task, or pronunciation task.
_Avoid_: Resource, content

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
