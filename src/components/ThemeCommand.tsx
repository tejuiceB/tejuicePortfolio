'use client'

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import dynamic from 'next/dynamic';
import * as githubService from '@/services/github';

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
}

const Snake = dynamic(() => import('./games/Snake'), { ssr: false });
const Tetris = dynamic(() => import('./games/Tetris'), { ssr: false });
const MorseCode = dynamic(() => import('./games/MorseCode'), { ssr: false });

export async function getRepositories(): Promise<GitHubRepo[]> {
  const username = getGithubUsername();
  if (!username) {
    throw new Error('GitHub username not set');
  }

  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&direction=desc`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }

  return response.json();
}

const marvelQuotes = [
  "JARVIS: All systems operational, sir.",
  "JARVIS: At your service, as always.",
  "JARVIS: Running diagnostics...",
  "JARVIS: Power at optimal levels.",
];

interface GithubData {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GithubCommit {
  sha: string;
  message: string;
}

interface GithubPR {
  number: number;
  title: string;
  state: string;
}

// Add skillTree type definition
interface SkillTreeItem {
  [key: string]: SkillTreeItem | string;
}

const skillTree: SkillTreeItem = {
  // ...existing skillTree object...
};

export default function ThemeCommand() {
  const { theme, setTheme } = useTheme();
  const [stage, setStage] = useState(0);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [morseMode, setMorseMode] = useState<'encode' | 'decode' | 'learn'>('encode');
  const inputRef = useRef<HTMLInputElement>(null);

  type ThemeKey = keyof typeof themes;
  
  const themes = {
    powershell: { bg: '#012456', text: '#16C60C', desc: 'Classic PowerShell Blue' },
    ubuntu: { bg: '#300A24', text: '#FFFFFF', desc: 'Ubuntu Terminal Purple' },
    matrix: { bg: '#000000', text: '#00FF00', desc: 'The Matrix Digital Rain' },
    dracula: { bg: '#282a36', text: '#ff79c6', desc: 'Dracula Dark Theme' },
    monokai: { bg: '#272822', text: '#F92672', desc: 'Monokai Classic' },
    cyberpunk: { bg: '#000B1E', text: '#0ABDC6', desc: 'Cyberpunk Neon' },
    nord: { bg: '#2E3440', text: '#88C0D0', desc: 'Nord Arctic' },
    synthwave: { bg: '#241B2F', text: '#FF7EDB', desc: '80s Synthwave' },
    hacker: { bg: '#0D0208', text: '#39FF14', desc: 'Classic Hacker Green' },
    marvel: { 
      bg: '#8B0000', 
      text: '#64D2FF', 
      desc: 'Iron Man\'s Interface' 
    },
  };

  const getPromptStyle = () => {
    if (theme === 'marvel') {
      return {
        prefix: 'JARVIS>',
        color: '#64D2FF',
        className: 'marvel-prompt'
      };
    }
    if (theme === 'ubuntu') {
      return {
        user: '#E95420',
        separator: '#FFFFFF',
        path: '#AEA79F'
      };
    }
  };

  // Reset history index when new command is typed
  useEffect(() => {
    setHistoryIndex(-1);
  }, [command]);

  type SkillTree = { [key: string]: SkillTree | string };
  
  const renderSkillTree = (tree: SkillTree, level = 0): string[] => {
    const lines: string[] = [];
    Object.entries(tree).forEach(([key, value], index, array) => {
      const isLast = index === array.length - 1;
      const prefix = level === 0 ? '' : '│   '.repeat(level - 1) + (isLast ? '└── ' : '├── ');
      
      if (typeof value === 'string') {
        lines.push(`${prefix}${key}: ${value}`);
      } else {
        lines.push(`${prefix}${key}`);
        lines.push(...renderSkillTree(value, level + 1));
      }
    });
    return lines;
  };

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    if (cmd === 'clear') {
      setHistory([]);
      setStage(0);
      setCommand('');
      if (!commandHistory.includes('clear')) {
        setCommandHistory(prev => [...prev, cmd]);
      }
      return;
    }
    
    // Add command to history only if it's not a duplicate
    if (!commandHistory.includes(cmd)) {
      setCommandHistory(prev => [...prev, cmd]);
    }
    
    setHistory(prev => [...prev, cmd]);
    
    if (cmd === 'theme --list') {
      setStage(1);
    } else if (cmd === 'help') {
      setHistory(prev => [...prev, 
        'Available commands:',
        '  theme --list  : Show available themes',
        '  clear        : Clear terminal',
        '  help         : Show this help message',
        '  game --list  : Show available games',
        '  play <game>  : Play a game',
        '  get-resume   : Download resume',
        '  tree skills  : Show skills tree',
        '  git --help   : Show GitHub commands',  // Only show git --help here
        '  morse --help : Show Morse code commands'
      ]);
    } else if (cmd === 'git --help') {
      setHistory(prev => [...prev,
        'GitHub Commands:',
        '',
        'Status & Information:',
        '  gh status    : Show GitHub profile status',
        '  gh repos     : List repositories',
        '  gh commits   : Show recent commits',
        '  gh prs       : List pull requests',
        '',
        'Authentication:',
        '  gh login     : Set GitHub username',
        '  gh logout    : Clear GitHub username',
        '  gh user      : Show current GitHub user',
        '',
        'Usage:',
        '  1. First set your GitHub username using "gh login <username>"',
        '  2. Then you can use any of the above commands',
        '  3. Use "gh logout" to clear your username'
      ]);
    } else if (cmd === 'morse --help') {
      setHistory(prev => [...prev,
        'Morse Code Commands:',
        '',
        '  morse encode <text> : Convert text to Morse code',
        '  morse decode <code> : Convert Morse code to text',
        '  morse learn        : Interactive learning mode',
        '  morse close        : Close Morse code translator',
        '',
        'Usage:',
        '  - Use dots (.) and dashes (-) for Morse code',
        '  - Use spaces between letters',
        '  - Use forward slash (/) for word spaces'
      ]);
    } else if (cmd === 'game --list') {
      setHistory(prev => [...prev,
        'Available games:',
        '  snake    : Classic Snake game',
        '  tetris   : Classic Tetris game',
        '  tictactoe: Coming soon...',
        '',
        'Type "play <game>" to start playing'
      ]);
    } else if (cmd === 'close') {
      setCurrentGame(null);
      setHistory(prev => [...prev, 'Game closed']);
    } else if (cmd.startsWith('play ')) {
      const gameName = cmd.split(' ')[1];
      if (gameName === 'snake' || gameName === 'tetris') {
        setCurrentGame(gameName);
        setHistory(prev => [...prev, 
          `Starting ${gameName} game...`,
          'Controls:',
          gameName === 'snake' 
            ? '  Arrow keys - Move snake | P - Pause/Resume | R - Restart'
            : '  Arrow keys - Move/Rotate | P - Pause/Resume | R - Restart',
          '  Type "close" to exit game'
        ]);
      } else {
        setHistory(prev => [...prev, `Game "${gameName}" not found or not yet available`]);
      }
    } else if (cmd === 'get-resume') {
      setHistory(prev => [...prev, 'Opening resume in new tab...']);
      window.open('/pdf/Tejas.Bhurbhure-resume.pdf', '_blank');
    } else if (cmd === 'tree skills') {
      setHistory(prev => [
        ...prev,
        'Generating skills tree...',
        '',
        ...renderSkillTree(skillTree)
      ]);
    } else if (cmd === 'gh status') {
      setHistory(prev => [...prev, 'Fetching GitHub status...']);
      githubService.getGithubStats()
        .then((data: GithubData) => {
          setHistory(prev => [...prev,
            '',
            `GitHub Profile: ${data.login}`,
            `Public Repos: ${data.public_repos}`,
            `Followers: ${data.followers}`,
            `Following: ${data.following}`,
            `Created: ${new Date(data.created_at).toLocaleDateString()}`
          ]);
        })
        .catch(() => setHistory(prev => [...prev, 'Error fetching GitHub status']));
    } else if (cmd === 'gh repos') {
      setHistory(prev => [...prev, 'Fetching repositories...']);
      getRepositories()
        .then((repos) => {
          setHistory(prev => [
            ...prev,
            '',
            'Repositories:',
            ...repos.map((repo: GitHubRepo) => 
              `${repo.name} - ${repo.description || 'No description'} (⭐ ${repo.stargazers_count})`
            )
          ]);
        })
        .catch(() => setHistory(prev => [...prev, 'Error fetching repositories']));
    } else if (cmd === 'gh commits') {
      setHistory(prev => [...prev, 'Fetching recent commits...']);
      githubService.getCommits()
        .then((commits: GithubCommit[]) => {
          setHistory(prev => [
            ...prev,
            '',
            'Recent commits:',
            ...commits.slice(0, 5).map((commit: GithubCommit) => {
              return `${commit.sha.substring(0, 7)} - ${commit.message}`;
            })
          ]);
        })
        .catch(() => setHistory(prev => [...prev, 'Error fetching commits']));
    } else if (cmd === 'gh prs') {
      setHistory(prev => [...prev, 'Fetching pull requests...']);
      githubService.getPullRequests()
        .then((data: { items: GithubPR[] }) => {
          setHistory(prev => [
            ...prev,
            '',
            'Pull Requests:',
            ...data.items.map((pr: GithubPR) => 
              `#${pr.number} - ${pr.title} (${pr.state})`
            )
          ]);
        })
        .catch(() => setHistory(prev => [...prev, 'Error fetching pull requests']));
    } else if (cmd.startsWith('gh login ')) {
      const username = cmd.split(' ')[2];
      if (username) {
        githubService.setGithubUsername(username);
        setHistory(prev => [...prev, `GitHub username set to: ${username}`]);
      } else {
        setHistory(prev => [...prev, 'Usage: gh login <username>']);
      }
    } else if (cmd === 'gh logout') {
      githubService.setGithubUsername('');
      setHistory(prev => [...prev, 'GitHub user logged out']);
    } else if (cmd === 'gh user') {
      const username = githubService.getGithubUsername();
      setHistory(prev => [...prev, 
        username ? `Current GitHub user: ${username}` : 'No GitHub user set. Use "gh login <username>" to set'
      ]);
    } else if (cmd.startsWith('gh ')) {
      if (!githubService.getGithubUsername()) {
        setHistory(prev => [...prev, 'Please set GitHub username first using "gh login <username>"']);
        return;
      }
      // ...rest of existing gh command handling...
    } else if (cmd.startsWith('morse ')) {
      const [, action] = cmd.split(' '); // Ignore first part (command)
      handleMorseCommand(action);
    } else if (Object.keys(themes).includes(cmd)) {
      setTheme(cmd as ThemeKey);
      setHistory(prev => [...prev, `Switching to ${cmd} theme...`]);
      setTimeout(() => {
        setHistory(prev => [...prev, `Theme changed to ${cmd}`]);
        setStage(0);
      }, 1000);
    } else {
      setHistory(prev => [...prev, 'Unknown command. Type "help" for available commands']);
    }

    if (theme === 'marvel') {
      const quote = marvelQuotes[Math.floor(Math.random() * marvelQuotes.length)];
      setHistory(prev => [...prev, quote]);
    }

    setCommand('');
  };


  const handleMorseCommand = (action: string) => {
    if (['encode', 'decode', 'learn'].includes(action)) {
      setMorseMode(action as 'encode' | 'decode' | 'learn');
      setCurrentGame('morse');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim()) {
      handleCommand(command.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Command History */}
      <div className="space-y-2">
        {history.map((entry, idx) => (
          <div key={idx} className="text-[#16C60C]">
            {entry.startsWith('theme') || entry === 'clear' || entry === 'help' || entry.startsWith('game') || entry.startsWith('play') ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">$</span>
                <span>{entry}</span>
              </div>
            ) : (
              <div className="pl-4">{entry}</div>
            )}
          </div>
        ))}
      </div>

      {/* Theme List */}
      {stage === 1 && (
        <div className="pl-4 space-y-1 text-[#16C60C]">
          <p>Available themes:</p>
          {Object.entries(themes).map(([name, { text, desc }]) => (
            <div key={name} className="flex items-center gap-3 group">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: text }}></span>
              <span className="w-20">{name}</span>
              <span className="text-gray-400 text-sm">{desc}</span>
              {theme === name && (
                <span className="text-gray-400 ml-2">(current)</span>
              )}
            </div>
          ))}
          <p className="text-gray-400 mt-2">Type a theme name to switch...</p>
        </div>
      )}

      {/* Game Display */}
      {currentGame === 'snake' && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Type &quot;close&quot; to exit game</span>
          </div>
          <Snake />
        </div>
      )}
      {currentGame === 'tetris' && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Type &quot;close&quot; to exit game</span>
          </div>
          <Tetris />
        </div>
      )}
      {currentGame === 'morse' && (
        <div className="mt-4 space-y-2">
          <MorseCode mode={morseMode} />
        </div>
      )}

      {/* Command Input */}
      <div className="flex items-center gap-2" style={{ color: theme === 'marvel' ? getPromptStyle()?.color ?? '#64D2FF' : '#gray-400' }}>
        <span>{theme === 'marvel' ? getPromptStyle()?.prefix || 'JARVIS>' : '$'}</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-[#16C60C] w-full"
          placeholder='Type "help" to see available commands'
          autoFocus
        />
      </div>
    </div>
  );
}
function getGithubUsername(): string | null {
  return localStorage.getItem('github-username');
}

