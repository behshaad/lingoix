import {
  forgetRememberedLoginEmail,
  getRememberedLoginEmails,
  rememberLoginEmail,
} from "./rememberedLoginEmails";

beforeEach(() => {
  localStorage.clear();
});

test("remembers successful login emails locally in most-recent order", () => {
  rememberLoginEmail(" Learner@Example.COM ");
  rememberLoginEmail("teacher@example.com");
  rememberLoginEmail("learner@example.com");

  expect(getRememberedLoginEmails()).toEqual([
    "learner@example.com",
    "teacher@example.com",
  ]);
});

test("ignores invalid emails and removes remembered emails locally", () => {
  rememberLoginEmail("learner@example.com");
  rememberLoginEmail("not an email");

  expect(getRememberedLoginEmails()).toEqual(["learner@example.com"]);
  expect(forgetRememberedLoginEmail("learner@example.com")).toEqual([]);
});
