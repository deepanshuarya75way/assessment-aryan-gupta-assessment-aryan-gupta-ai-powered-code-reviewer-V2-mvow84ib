export type PrFile = {
  /** Source file path this chunk came from, e.g. `src/foo.ts` */
  filePath: string;
  /** code inside file */
  patch: string;
};

export type CodeChunk = {
  /** Unique id used as the Pinecone record id, e.g. `pr-42--src/foo.ts--part-0` */
  id: string;
  /** Source file path this chunk came from */
  filePath: string;
  /** Raw text stored in Pinecone and searched at review time */
  text: string;
};

export type PullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    user: { login: string } | null;
    head: { sha: string };                                        // head: latest commit & sha: its id
    base: { ref: string };                                        // Which branch do you want to merge into, e.g. main* branch (ref: "main")
  };
};
