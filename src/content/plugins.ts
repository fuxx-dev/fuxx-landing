export const PLUGIN_CAPABILITIES = ['j-plugins', 'j-plugin-settings']

export const plugins = {
  samples: [
    {
      name: 'Sunset Themes',
      repo: 'fitzfitz/fuxx-sunset-themes',
      kind: 'theme plugin',
      blurb: 'Two warm themes, Sunset and Sunset Light. The smallest possible plugin: a conf file and two theme files.',
    },
    {
      name: 'Hello Helper',
      repo: 'fitzfitz/fuxx-hello-helper',
      kind: 'helper plugin',
      blurb: 'Puts a fuxx-hello command on your PATH and a FUXX_HELLO variable in every new terminal. Small enough to read in a minute.',
    },
  ],
  completes: {
    repo: 'fitzfitz/fuxx-completes',
    blurb:
      'Grey ghost-text suggestions from the commands you ran here before, and a numbered list when you pause. Nothing ever runs for you.',
  },
  confSnippet: `# A theme plugin
format      = 1
id          = sunset-themes
name        = Sunset Themes
version     = 1.0.0
description = Warm themes from the design team.
theme       = themes/Sunset
theme       = themes/Sunset Light`,
  docsUrl: 'https://github.com/fitzfitz/fuxx-cli#making-a-plugin',
}
