# Manual do cw-rep (Sistema CW de Reputação e Habilidades)

## Introdução
O cw-rep é um sistema leve de reputação e habilidades para FiveM baseado no QBCore, com total compatibilidade retroativa com os exports do mz-skills. Ele gerencia habilidades pessoais (`skill`) e reputação baseada em emprego (`rep`) com níveis XP exponenciais.

## Funcionalidades Principais
- Dois tipos de progressão: `skill` (pessoal) e `rep` (baseada em emprego)
- Níveis XP exponenciais (padrão 30 níveis)
- Compatibilidade retroativa total com mz-skills
- UI moderna via ox_lib (padrão) ou suporte a qb-menu
- Envio de e-mails via qb-phone ao alcançar níveis específicos
- Integração com verificações de habilidade do ox_lib
- Armazenamento MySQL otimizado com migração automática do mz-skills
- Totalmente configurável (habilidades, ícones, mensagens, intervalos de nível)

## Dependências
| Dependência | Obrigatório | Notas |
|------------|----------|-------|
| qb-core | Sim | Framework |
| ox_lib | Sim | UI, notificações |
| qb-phone | Não | Para notificações por e-mail |
| cw-skills | Não | Sistema de habilidades alternativo |

## Configuração
### Definição de Habilidades (`config.lua`)
```lua
Config.Skills = {
    fishing = {
        label = 'Pescador',
        icon = 'fas fa-fish-fins',
        type = 'rep'              -- 'rep' ou 'skill'
    },
    lockpicking = {
        label = 'Lockpicking',
        icon = 'fas fa-unlock',
        maxLevel = 350,
        type = 'skill',
        messages = {
            { notify = true, level = 50, message = "Você não é mais horrível com essa lockpick" },
            { notify = true, level = 100, message = "Você começa a se sentir melhor..." },
        }
    },
    cooking = { label = 'Cozinhar', icon = 'fa-solid fa-drumstick-bite', type = 'skill' },
    crafting = { label = 'Fabricação', icon = 'gear', type = 'skill' },
}
```

### Configuração de Níveis
```lua
-- Sistema de níveis exponencial (padrão)
Config.DefaultLevels = generateExponentialLevels(10, 1.5, 30)
Config.GenericMaxAmount = 1000000000
Config.XPBarColour = "green"
```

### Configurações de UI
```lua
Config.UseOxMenu = true            -- true = ox_lib, false = qb-menu
Config.SkillsTitle = "Habilidades"
Config.RepTitle = "Reputação"
Config.Skillmenu = "skill"         -- comando para abrir menu de habilidades
Config.Repmenu = "rep"             -- comando para abrir menu de reputação
```

## Comandos
| Comando | Descrição | Permissão |
|----------|-------------|-------------|
| `/skill` | Abrir menu de habilidades | Todos |
| `/rep` | Abrir menu de reputação | Todos |
| `/giveskill [id] [skill] [amount]` | Dar/remover XP do jogador | Admin |
| `/fetchSkills [source]` | Imprimir habilidades do jogador no console | Admin |

## Eventos
### Servidor
| Evento | Parâmetros | Descrição |
|--------|-------------|-------------|
| `cw-rep:server:update` | `data` (JSON de habilidades) | Atualizar habilidades no DB |
| `cw-rep:server:triggerEmail` | `citizenid, sender, subject, message` | Enviar e-mail de level-up |

### Cliente
| Evento | Parâmetros | Descrição |
|--------|-------------|-------------|
| `cw-rep:client:updateSkills` | `skill, amount` | Atualizar XP local |
| `cw-rep:client:CheckSkills` | — | Abrir menu de habilidades |

## Exports
### Servidor
| Export | Descrição | Exemplo |
|--------|-------------|---------|
| `updateSkill(source, skillName, amount)` | Atualizar habilidade do jogador | `exports["cw-rep"]:updateSkill(source, 'lockpicking', 10)` |
| `fetchSkills(source)` | Obter todas as habilidades | `local skills = exports["cw-rep"]:fetchSkills(source)` |
| `getCurrentSkill(skill)` | Obter XP atual | `local xp = exports["cw-rep"]:getCurrentSkill('fishing')` |
| `getCurrentLevel(skill)` | Obter nível atual | `local lvl = exports["cw-rep"]:getCurrentLevel('fishing')` |
| `getSkillInfo(skill)` | Obter config da habilidade | `local info = exports["cw-rep"]:getSkillInfo('lockpicking')` |

### Cliente
| Export | Descrição | Exemplo |
|--------|-------------|---------|
| `updateSkill(skill, amount)` | Atualizar habilidade local | `exports["cw-rep"]:updateSkill('searching', 1)` |
| `checkSkill(skill, val)` | Verificar se habilidade >= valor (callback) | `exports["cw-rep"]:checkSkill('lockpicking', 100, function(has) ... end)` |
| `playerHasEnoughSkill(skill, val)` | Verificar se habilidade >= valor (direto) | `if exports["cw-rep"]:playerHasEnoughSkill('crafting', 200) then ...` |
| `getCurrentSkill(skill)` | Obter XP atual | `local xp = exports["cw-rep"]:getCurrentSkill('cooking')` |
| `getCurrentLevel(skill)` | Obter nível atual | `local lvl = exports["cw-rep"]:getCurrentLevel('hunting')` |
| `getSkillInfo(skill)` | Obter info da habilidade | `local label = exports["cw-rep"]:getSkillInfo('mining').label` |

## Integração com Menu Radial
Adicione ao `qb-radialmenu/config.lua`:
```lua
[3] = {
    id = 'skills',
    title = 'Ver Habilidades',
    icon = 'triangle-exclamation',
    type = 'client',
    event = 'cw-rep:client:CheckSkills',
    shouldClose = true,
}
```

## Notificações por E-mail
Habilite em `config.lua`:
```lua
Config.SendUpdateEmails = true
Config.EmailWaitTimes = { min = 4500, max = 7000 }
```

Adicione mensagens às habilidades:
```lua
foodelivery = {
    icon = 'fas fa-star',
    messages = {
        { level = 50, message = "Você está indo muito bem!", sender = "FeedStars RH", subject = "FeedStars" },
        { level = 300, message = "Você é uma verdadeira ESTRELA do Food! ⭐", sender = "FeedStars RH", subject = "FeedStars" },
    }
}
```

## Solução de Problemas
- **Habilidades não carregam**: Verifique se o SQL foi importado corretamente para o banco de dados.
- **Compatibilidade com mz-skills**: Mantenha os mesmos nomes de habilidades que eram usados no mz-skills.
- **E-mails não enviam**: Certifique-se de que o qb-phone está instalado e o `Config.SendUpdateEmails` está habilitado.
