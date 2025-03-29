import "./styles.css";

const steps = [
  {
    title: "1.🎉 Welcome to Lingoix!",
    description: (
      <>
        From the beginning, please specify how you want to use this platform:
        <br /> • Student: Learn the language and track progress
        <br /> • Teacher: Teach and manage students
        <br /> • School: Manage classes and student performance
      </>
    ),
  },
  {
    title: "2. Complete your profile and personalize your experience",
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </>
    ),
  },
  {
    title: "3.🚀 Getting to know the dashboard",
    description: (
      <>
        Description: This is your control center! Depending on the role you
        choose, you can: • Student: Follow the learning roadmap, tests, and
        exercises. • Teacher: See student progress and assign assignments. •
        School: Manage student and teacher performance.
      </>
    ),
  },
  {
    title: "4.Your first experience with Lingoix",
    description: (
      <>
        Now it's your turn to take the first step! • Student: View a sample
        lesson and take a mini-test. • Teacher: Create a test assignment. •
        School: View a sample student report.
      </>
    ),
  },
  {
    title: "5.🎯 Start learning!",
    description: (
      <>
        You've learned about the basic features of Lingoix. Now you can get
        started and use this platform for learning, teaching, and managing
        classes.
      </>
    ),
  },
];

const StepbyStep = () => {
  return (
    <div className="timeline flex justify-center ">
      <div className="timeline-inner ">
        {" "}
        {/* فاصله‌ی کارت‌ها به‌طور عمودی */}
        {steps.map((step, index) => (
          <div key={index} className="card">
            <div className="info">
              <h3 className="title text-xl font-semibold">{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepbyStep;