// @ts-ignore
import geminiPrompt from "./prompt.txt";
import { console, fetch } from "./unpoison";

const geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const jsonResRegex = /{.*}/is;

const problemBodyRegex = /<div id="output_problem_body".*?>(?<problem>.*)<input id="num_attempts"/is;
const notesRegex = /notes?:.*/i;
const equationContentRegex = /<script.*?>(?<eq>.*?)<\/script>/gi;
const equationImageRegex = /<img[^>]+?src="[^"]+?equations[^>]+?alt="(?<eq>.*?)"/gi;
const inputFieldRegex = /<input.*?id="(.*?)".*?type="?text"?.*?<input.*?>/gi;
const inputFieldRegex2 = /<input.*?type="?text"?.*?id="(.*?)".*?<input.*?>/gi;
const linebreakRegex = /<br>/gi;

const dropdownRegex = /<select.*?id="(.*?)".*?>.*?<\/select>/gis;
const optionsRegex = /<option value="(.*?)".*?>.*?<\/option>/gis;

const radioGroupRegex = /<label><input.*?type="radio".*?id="(.*?)".*?<\/label>(<br><label>.*?<\/label>)+/gis;
const radioOptionRegex = /<label><input.*?type="radio".*?value="(.*?)".*?>(.*?)<\/label>/gis;

const wrappingElRemovalRegex = /<(div|b|i|ul|ol|p|span)( [^<]+?)?>(.*?)<\/\1>/gs;

export async function solve({
  geminiApiKey,
  onProgressUpdate,
  onFinish,
  autosubmit,
  preview,
}: {
  geminiApiKey: string;
  onProgressUpdate: (status: string) => void;
  onFinish: (success: boolean, message: string) => void;
  autosubmit?: boolean;
  preview?: boolean;
}) {
  if (!geminiApiKey) {
    return onFinish(false, "Missing API key!");
  }

  onProgressUpdate("Parsing problem...");

  const doc = await (await fetch(location.href)).text();

  // extract problem content
  let problemBody = doc.match(problemBodyRegex)?.groups?.problem;

  // remove wrapping html elements
  let wrappingCleaned = false;
  while (!wrappingCleaned) {
    const newProblemBody = problemBody.replaceAll(wrappingElRemovalRegex, (...args) => args[3]);
    if (newProblemBody === problemBody) {
      wrappingCleaned = true;
    } else {
      problemBody = newProblemBody;
    }
  }
  problemBody = problemBody.replaceAll("<P>", "");

  // remove footnotes
  problemBody = problemBody.replace(notesRegex, "");

  // sanitize equations
  problemBody = problemBody.replaceAll(equationContentRegex, (_, c) => c);
  problemBody = problemBody.replaceAll(equationImageRegex, (_, c) => c);

  // format input fields
  // make field id lowercase to avoid letter casing hallucinations
  problemBody = problemBody.replaceAll(inputFieldRegex, (_, f) => `{{${f.toLowerCase()}}}`);
  problemBody = problemBody.replaceAll(inputFieldRegex2, (_, f) => `{{${f.toLowerCase()}}}`);

  // format dropdowns
  problemBody = problemBody.replaceAll(
    dropdownRegex,
    (m, f) =>
      `{{${f.toLowerCase()}: ${[...m.matchAll(optionsRegex)]
        .map((e) => e[1])
        .filter((e) => e !== "?")
        .map((e) => `"${e}"`)
        .join(", ")}}}`,
  );

  // format radio groups
  problemBody = problemBody.replaceAll(
    radioGroupRegex,
    (m, f) =>
      `{{${f.toLowerCase().split("&#95;")[0]}: ${[...m.matchAll(radioOptionRegex)]
        .map((e) => e.slice(1))
        .filter((e) => e[1] !== "?")
        .map((e) => `"${e[0]}":"${e[1]}"`)
        .join(", ")}}}`,
  );

  problemBody = problemBody.replaceAll(linebreakRegex, "\n");
  problemBody = problemBody.replaceAll("&#92;", "\\");

  console.log("Problem body: ", problemBody);

  if (preview) {
    console.log("Preview only. Not prompting Gemini.");
    return onFinish(true, "");
  }

  // ask gemini
  onProgressUpdate("Waiting for Gemini...");
  const res = await fetch(geminiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": geminiApiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${geminiPrompt}${problemBody}`,
            },
          ],
        },
      ],
    }),
  }).then((r) => r.json());
  console.log("Raw response:", res);

  if (res.error) {
    return onFinish(false, res.error.message);
  }

  const solutions = JSON.parse(res.candidates[0].content.parts[0].text.match(jsonResRegex)[0]);
  console.log("Solutions:", solutions);

  // fill answers
  onProgressUpdate("Filling answers...");
  for (const [key, value] of Object.entries(solutions) as [string, string][]) {
    const targetId = key.replace("answer", "AnSwEr");
    const el = document.getElementById(targetId) as HTMLInputElement;
    if (el.type === "radio") {
      try {
        (document.querySelector(`[id^='${targetId}'][value='${value}']`) as HTMLInputElement | null)?.click();
      } catch {
        (
          [...document.querySelectorAll(`[id^='${targetId}']`)].find(
            (e) => e.parentElement.innerText.replaceAll(/( |\n)/g, "") == value.replaceAll(/( |\n)/g, ""),
          ) as HTMLInputElement | null
        )?.click();
      }
    } else {
      el.value = value;
    }
  }

  // submit
  if (autosubmit) {
    onProgressUpdate("Submitting answers...");
    document.getElementById("submitAnswers_id").click();
  }
  onFinish(true, "");
}
