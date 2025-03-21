const GITHUB_API = 'https://api.github.com';

let currentUsername = '';

export function setGithubUsername(username: string) {
  currentUsername = username;
}

export function getGithubUsername() {
  return currentUsername;
}

export async function getGithubStats() {
  if (!currentUsername) throw new Error('GitHub username not set');
  const response = await fetch(`${GITHUB_API}/users/${currentUsername}`);
  if (!response.ok) throw new Error('Failed to fetch GitHub stats');
  return response.json();
}

export async function getRepos() {
  if (!currentUsername) throw new Error('GitHub username not set');
  const response = await fetch(`${GITHUB_API}/users/${currentUsername}/repos?sort=updated`);
  if (!response.ok) throw new Error('Failed to fetch repositories');
  return response.json();
}

interface GithubEvent {
  type: string;
  payload: {
    commits: Array<{
      sha: string;
      message: string;
    }>;
  };
}

export async function getCommits() {
  if (!currentUsername) throw new Error('GitHub username not set');
  const response = await fetch(`${GITHUB_API}/users/${currentUsername}/events`);
  if (!response.ok) throw new Error('Failed to fetch commits');
  const events = await response.json();
  return events.filter((event: GithubEvent) => event.type === 'PushEvent').slice(0, 5);
}

export async function getPullRequests() {
  if (!currentUsername) throw new Error('GitHub username not set');
  const response = await fetch(`${GITHUB_API}/search/issues?q=author:${currentUsername}+type:pr`);
  if (!response.ok) throw new Error('Failed to fetch pull requests');
  return response.json();
}
export function getRepositories() {
  throw new Error('Function not implemented.');
}

