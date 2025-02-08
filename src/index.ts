interface Env {
  GITHUB_API_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_OWNER: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    try {
      const numberOfCommits = Math.floor(Math.random() * 10) + 1; // Random number between 1-10
      
      for (let i = 0; i < numberOfCommits; i++) {
        const randomNumber = Math.floor(Math.random() * 100);
        const payload = {
          path: "README.md",
          content: `# Random Number\n\nToday's number is: ${randomNumber}\n\nCommit ${i + 1} of ${numberOfCommits}`,
          message: `Update random number to ${randomNumber} (${i + 1}/${numberOfCommits})`
        };

        const currentFile = await getCurrentFile(payload.path, env);
        await createOrUpdateFile(
          payload.path, 
          payload.content, 
          payload.message, 
          currentFile?.sha, 
          env
        );

        // Add a small delay between commits
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
    }
  }
};

async function getCurrentFile(path: string, env: Env) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`,
      {
        headers: {
          'Authorization': `Bearer ${env.GITHUB_API_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Cloudflare-Worker',
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    return response.json() as Promise<{ sha: string }>;
  } catch (error: any) {
    return null;
  }
}

async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  sha: string | undefined,
  env: Env
) {
  const payload = {
    message,
    content: btoa(content), // Base64 encode the content
    ...(sha && { sha }), // Include SHA if updating existing file
  };

  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Worker',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json() as { message: string };
    throw new Error(`GitHub API error: ${error.message}`);
  }

  return response.json();
} 