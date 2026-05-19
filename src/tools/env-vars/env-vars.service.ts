export interface EnvVar {
  id: number
  key: string
  value: string
}

export interface Shell {
  id: string
  label: string
  os: string
  setCmd: (key: string, value: string) => string
  unsetCmd: (key: string) => string
  allCmd: (vars: EnvVar[]) => string
}

export const shells: Shell[] = [
  {
    id: 'bash',
    label: 'Bash / Zsh',
    os: 'Linux / macOS',
    setCmd: (k, v) => `export ${k}="${v}"`,
    unsetCmd: k => `unset ${k}`,
    allCmd: vars => vars.map(v => `export ${v.key}="${v.value}"`).join('\n'),
  },
  {
    id: 'fish',
    label: 'Fish',
    os: 'Linux / macOS',
    setCmd: (k, v) => `set -gx ${k} "${v}"`,
    unsetCmd: k => `set -e ${k}`,
    allCmd: vars => vars.map(v => `set -gx ${v.key} "${v.value}"`).join('\n'),
  },
  {
    id: 'ps',
    label: 'PowerShell',
    os: 'Windows',
    setCmd: (k, v) => `$env:${k} = "${v}"`,
    unsetCmd: k => `Remove-Item Env:${k}`,
    allCmd: vars => vars.map(v => `$env:${v.key} = "${v.value}"`).join('\n'),
  },
  {
    id: 'cmd',
    label: 'CMD',
    os: 'Windows',
    setCmd: (k, v) => `set ${k}=${v}`,
    unsetCmd: k => `set ${k}=`,
    allCmd: vars => vars.map(v => `set ${v.key}=${v.value}`).join('\n'),
  },
  {
    id: 'ps-persist',
    label: 'PowerShell (persist)',
    os: 'Windows',
    setCmd: (k, v) => `[System.Environment]::SetEnvironmentVariable('${k}', '${v}', 'User')`,
    unsetCmd: k => `[System.Environment]::SetEnvironmentVariable('${k}', $null, 'User')`,
    allCmd: vars => vars.map(v => `[System.Environment]::SetEnvironmentVariable('${v.key}', '${v.value}', 'User')`).join('\n'),
  },
  {
    id: 'dotenv',
    label: '.env file',
    os: 'All',
    setCmd: (k, v) => `${k}=${v}`,
    unsetCmd: _ => `# remove the line`,
    allCmd: vars => vars.map(v => `${v.key}=${v.value}`).join('\n'),
  },
];
