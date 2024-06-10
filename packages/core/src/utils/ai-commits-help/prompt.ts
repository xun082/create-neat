type CommitType = "" | "conventional";
const commitTypeFormats: Record<CommitType, string> = {
  "": "<commit message>",
  conventional: "<type>(<optional scope>): <commit message>",
};

const commitTypes: Record<CommitType, string> = {
  "": "",
  conventional: `Choose a type from the type-to-description JSON below that best describes the git diff:\n${JSON.stringify(
    {
      docs: "Documentation only changes",
      style:
        "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
      refactor: "A code change that neither fixes a bug nor adds a feature",
      perf: "A code change that improves performance",
      test: "Adding missing tests or correcting existing tests",
      build: "Changes that affect the build system or external dependencies",
      ci: "Changes to our CI configuration files and scripts",
      chore: "Other changes that don't modify src or test files",
      revert: "Reverts a previous commit",
      feat: "A new feature",
      fix: "A bug fix",
    },
    null,
    2,
  )}`,
};

const strengthPrompt = () => `
I hope that the information content of git commit should be combined with the context of the changed content and the programming language used to objectively and accurately explain the content of the commit information.
`;

const specifyCommitFormat = (type: CommitType) =>
  `The output response must be in format:\n${commitTypeFormats[type]}`;

/**
 * @param locale
 * @param maxLength
 * @param type
 */
export const generatePrompt = (locale: string, maxLength: number, type = "conventional") => {
  return [
    "Generate a concise git commit message written in present tense for the following code diff with the given specifications below:",
    `Message language: ${locale}`,
    `Commit message must be a maximum of ${maxLength} characters.`,
    "Exclude anything unnecessary such as translation. Your entire response will be passed directly into git commit.",
    commitTypes[type],
    strengthPrompt(),
    specifyCommitFormat(type as CommitType),
  ]
    .filter(Boolean)
    .join("\n");
};

/**
 * @param diff {string}
 * @param options {{locale: string, maxLength: number}}
 */
export const createChatRequest = (diff: string, options: { locale: string; maxLength: number }) => {
  const { locale, maxLength } = options;
  return {
    model: "gpt-3.5-turbo",
    // model: 'gpt-4-1106-preview',
    messages: [
      { role: "system", content: generatePrompt(locale, maxLength) },
      { role: "user", content: diff },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: false,
    // 建议的答案数量
    n: 1,
  };
};
