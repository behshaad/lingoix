import "./styles.css";

const StepbyStep = () => {
  return (
    <div className="timeline flex justify-center mt-6">
      <div class="timeline">
        <div class="outer">
          <div class="card">
            <div class="info">
              <h3 class="title">1.🎉 Welcome to Lingoix!</h3>
              <p>
                From the beginning, please specify how you want to use this
                platform:
                <br /> • Student: Learn the language and track progress
                <br /> • Teacher: Teach and manage students
                <br /> • School: Manage classes and student performance
              </p>
            </div>
          </div>
          <div class="card">
            <div class="info">
              <h3 class="title">
                2. Complete your profile and personalize your experience
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.{" "}
              </p>
            </div>
          </div>
          <div class="card">
            <div class="info">
              <h3 class="title">3.🚀 Getting to know the dashboard</h3>
              <p>
                Description: This is your control center! Depending on the role
                you choose, you can: • Student: Follow the learning roadmap,
                tests, and exercises. • Teacher: See student progress and assign
                assignments. • School: Manage student and teacher performance.
              </p>
            </div>
          </div>
          <div class="card">
            <div class="info">
              <h3 class="title">4.Your first experience with Lingoix</h3>
              <p>
                Now it's your turn to take the first step! • Student: View a
                sample lesson and take a mini-test. • Teacher: Create a test
                assignment. • School: View a sample student report.
              </p>
            </div>
          </div>
          <div class="card">
            <div class="info">
              <h3 class="title">5.🎯 Start learning!</h3>
              <p>
                You've learned about the basic features of Lingoix. Now you can
                get started and use this platform for learning, teaching, and
                managing classes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepbyStep;
