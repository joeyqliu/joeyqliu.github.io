import { test } from "node:test";
import assert from "node:assert/strict";
import { jobs, education, workJobs, resumeJobs, type Job } from "./experience.ts";

const job = (company: string, extra: Partial<Job> = {}): Job => ({
  company,
  role: "r",
  dates: "d",
  location: "l",
  work: [],
  resume: [],
  ...extra,
});

test("workJobs includes jobs with onWork omitted and excludes onWork:false", () => {
  const list = [job("a"), job("b", { onWork: false }), job("c", { onWork: true })];
  assert.deepEqual(workJobs(list).map((j) => j.company), ["a", "c"]);
});

test("resumeJobs includes only onResume:true, preserving order", () => {
  const list = [
    job("a", { onResume: true }),
    job("b"),
    job("c", { onResume: false }),
    job("d", { onResume: true }),
  ];
  assert.deepEqual(resumeJobs(list).map((j) => j.company), ["a", "d"]);
});

test("resumeJobs keeps a job with an empty resume list", () => {
  const list = [job("a", { onResume: true, resume: [] })];
  assert.equal(resumeJobs(list).length, 1);
});

test("real data: resume shows handshake + rivian, work shows all five", () => {
  assert.deepEqual(resumeJobs().map((j) => j.company), ["handshake", "rivian"]);
  assert.equal(workJobs().length, 5);
  assert.ok(education.length >= 1);
  for (const j of resumeJobs()) assert.ok(j.resume.length > 0, `${j.company} has resume bullets`);
});

test("no phone number anywhere in data", () => {
  assert.doesNotMatch(JSON.stringify({ jobs, education }), /\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}/);
});
