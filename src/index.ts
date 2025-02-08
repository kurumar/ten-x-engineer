interface Env {
  GITHUB_API_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_OWNER: string;
}

export default {
  async scheduled(_: ScheduledEvent, env: Env): Promise<void> {
    try {
      const commits = Math.floor(Math.random() * 10) + 1;  // Random number of commits (1-10)
      for (let i = 0; i < commits; i++) {
        await commit(i + 1, commits, env);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Delay between commits 5 seconds
      }
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
    }
  },
};

async function commit(index: number, total: number, env: Env) {
  const path = "README.md";
  const randomNumber = Math.floor(Math.random() * 100);
  const content = `# Random Number\n\nToday's number is: ${randomNumber}\n\nCommit ${index} of ${total}`;
  const message = `Update random number to ${randomNumber} (${index}/${total})`;
  const currentFile = await fetchFile(path, env);
  await updateFile(path, content, message, currentFile?.sha, env);
}

async function fetchFile(path: string, env: Env) {
  const response = await fetchGitHub(`contents/${path}`, "GET", env);
  return response.status === 404 ? null : response.json() as Promise<{ sha: string }>;
}

async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string | undefined,
  env: Env
) {
  const payload = { message, content: btoa(content), ...(sha && { sha }) };
  await fetchGitHub(`contents/${path}`, "PUT", env, payload);
}

async function fetchGitHub(endpoint: string, method: string, env: Env, body?: any) {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${env.GITHUB_API_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Cloudflare-Worker',
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const error = await response.json() as { message: string };
    throw new Error(`GitHub API error: ${error.message}`);
  }
  return response;
}