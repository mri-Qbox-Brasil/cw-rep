# 🏆 cw-rep (Sistema CW de Reputação e Habilidades)

<<<<<<< fork
**Um sistema leve de reputação e habilidades para FiveM** — compatível com QBCore, com total compatibilidade retroativa com os exports do mz-skills.
||||||| base
- A database held skill/XP system for qb (optimized from mz-skills)
- Full backwards compatibility with mz-skills exports (no need to upgrade all your scripts using mz skills)
- Supports QB menu and OX menu
=======
- A database held skill/XP system for qb (optimized from mz-skills)
- Full backwards compatibility with mz-skills exports (no need to upgrade all your scripts using mz skills)
- Supports QB menu and OX menu
- Only updates database every X minutes rather than on-update
>>>>>>> upstream

[![Download](https://img.shields.io/badge/Download-GitHub-blue)](https://github.com/mri-Qbox-Brasil/cw-rep)
[![Preview](https://img.shields.io/badge/Preview-Ox%20Menu-darkgreen)](https://discord.gg/FJY4mtjaKr)
[![Tebex](https://img.shields.io/badge/Tebex-Store-orange)](https://cw-scripts.tebex.io/category/2523396)

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|--------|-------------|
| 🎖️ **Sistema de Habilidades e Reputação** | Dois tipos: `skill` (pessoal) e `rep` (baseada em emprego) |
| 📈 **Níveis XP Exponenciais** | Curva de nível configurável (padrão 30 níveis) |
| 🔔 **Compatibilidade Retroativa** | Substituto direto para mz-skills (mesmos exports) |
| 🎨 **Menu Ox Lib** | UI moderna via ox_lib (padrão) |
| 📋 **Suporte QB Menu** | Também suporta menu QB legado |
| 📧 **E-mails de Level-Up** | Envia e-mails via qb-phone ao alcançar certos níveis |
| 🎯 **Verificação de Habilidade** | Integração com verificações de habilidade do ox_lib |
| 💾 **Banco de Dados Otimizado** | Armazenamento MySQL eficiente (migração automática do mz-skills) |
| 🔧 **Totalmente Configurável** | Habilidades, ícones, mensagens, intervalos de nível personalizados |

---

## 📦 Dependências

| Dependência | Obrigatório | Notas |
|------------|----------|-------|
| [qb-core](https://github.com/qbcore-framework/qb-core) | ✅ | Framework |
| [ox_lib](https://github.com/overextended/ox_lib) | ✅ | UI, notificações |
| [qb-phone](https://github.com/qbcore-framework/qb-phone) | ❌ | Para notificações por e-mail |
| [cw-skills](https://github.com/stars/Coffeelot/lists/cw-scripts) | ❌ | Sistema de habilidades alternativo |

---

## 📂 Estrutura de Arquivos

<<<<<<< fork
||||||| base
# Installation
- Download the resource and drop it to your resource folder. Make sure the folder is named `cw-rep`
- If you're installing from scratch: Import the SQL file to your server's database (i.e. run the sql file and make sure the database runs)
- If you are changing from mz-skills: 
    - Make sure to update the cw-rep skills in the Config to match mz-skills if you want to keep the names you have
    - Remove the mz-skills folder
- Add ``start cw-rep`` to your server.cfg (or simply make sure cw-rep is in your [qb] folder)

> CW-rep has a new (optimized) database format compared to mz-skills, but this conversion is done while the script is being used. This might cause some older unused characters to still have the old format until used

## Setup

You'll probably want to do some setup for this script, so make sure to familiarize yourself with the config. There are some minor differences between this and mz, but the script should be able to rewrite your mz-skills database data into cw-rep on the fly as long as the names in `Config.Skills` match.

You can define skills like this:
```lua
    lockpicking = { -- if you want to use names with spaces you'll need to type it as "['Lockicking Skill'] = {" for example
        icon = 'fas fa-unlock', -- icon that shows in the menu
        label = 'Lockpicking' -- Label that is displayed in the menu (defaults to name of the skill, just like mz skills if this is not defined)
    },
=======
# Installation
- Download the resource and drop it to your resource folder. Make sure the folder is named `cw-rep`
- If you're installing from scratch: Import the SQL file to your server's database (i.e. run the sql file and make sure the database runs)
- If you are changing from mz-skills: 
    - Make sure to update the cw-rep skills in the Config to match mz-skills if you want to keep the names you have
    - Remove the mz-skills folder
- Add ``start cw-rep`` to your server.cfg (or simply make sure cw-rep is in your [qb] folder)

> CW-rep has a new (optimized) database format compared to mz-skills, but this conversion is done while the script is being used. This might cause some older unused characters to still have the old format until used

## Setup

You'll probably want to do some setup for this script, so make sure to familiarize yourself with the config. There are some minor differences between this and mz, but the script should be able to rewrite your mz-skills database data into cw-rep on the fly as long as the names in `Config.Skills` match.

You can define skills like this:
```lua
    lockpicking = { -- if you want to use names with spaces you'll need to type it as "['Lockicking Skill'] = {" for example
        icon = 'fas fa-unlock', -- icon that shows in the menu
        label = 'Lockpicking' -- Label that is displayed in the menu (defaults to name of the skill, just like mz skills if this is not defined)
        skipNotify = true -- Will not notify player when skill up/down if Config.ShowNotificationOnSkillGain is set to true
    },
>>>>>>> upstream
```
cw-rep/
├── fxmanifest.lua
├── config.lua                 # Configuração principal (habilidades, níveis, UI)
├── server/
│   └── server.lua            # Lógica do servidor (buscar/atualizar habilidades, DB)
├── client/
│   ├── client.lua           # Lógica do cliente (perda de habilidade ao longo do tempo)
│   ├── functions.lua         # Funções de habilidade do lado do cliente
│   └── gui.lua              # UI Ox/QB menu
└── (opcional) sql/
    └── cw-rep.sql            # Tabela do banco de dados
```

---

## 🔧 Configuração

### `config.lua` — Definição de Habilidades
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
    -- ... mais habilidades
}
```

### Configuração de Níveis
```lua
-- Sistema de níveis exponencial (padrão)
Config.DefaultLevels = generateExponentialLevels(10, 1.5, 30)
-- Resulta em: Nível 1: 0-10 XP, Nível 2: 10-25 XP, Nível 3: 25-47 XP, etc.

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

---

## 🎮 Comandos

| Comando | Descrição | Permissão |
|----------|-------------|-------------|
| `/skill` | Abrir menu de habilidades (ou o que estiver definido em `Config.Skillmenu`) | Todos |
| `/rep` | Abrir menu de reputação | Todos |
| `/giveskill [id] [skill] [amount]` | Dar/remover XP do jogador | Admin |
| `/fetchSkills [source]` | Imprimir habilidades do jogador no console | Admin |

---

## 📡 Eventos

### Eventos do Servidor
| Evento | Parâmetros | Descrição |
|--------|-------------|-------------|
| `cw-rep:server:update` | `data` (string JSON de habilidades) | Atualizar habilidades do jogador no DB |
| `cw-rep:server:triggerEmail` | `citizenid, sender, subject, message` | Enviar e-mail de level-up |

### Eventos do Cliente
| Evento | Parâmetros | Descrição |
|--------|-------------|-------------|
| `cw-rep:client:updateSkills` | `skill, amount` | Atualizar XP de habilidade local |
| `cw-rep:client:CheckSkills` | — | Abrir menu de habilidades (radial) |

---

## 🔌 Exports

### Exports do Servidor
| Export | Descrição | Exemplo |
|--------|-------------|---------|
| `exports['cw-rep']:updateSkill(source, skillName, amount)` | Atualizar uma habilidade do jogador | `exports["cw-rep"]:updateSkill(source, 'lockpicking', 10)` |
| `exports['cw-rep']:fetchSkills(source)` | Obter todas as habilidades do jogador | `local skills = exports["cw-rep"]:fetchSkills(source)` |
| `exports['cw-rep']:getCurrentSkill(skill)` | Obter XP atual para uma habilidade | `local xp = exports["cw-rep"]:getCurrentSkill('fishing')` |
| `exports['cw-rep']:getCurrentLevel(skill)` | Obter nível para uma habilidade | `local lvl = exports["cw-rep"]:getCurrentLevel('fishing')` |
| `exports['cw-rep']:getSkillInfo(skill)` | Obter config da habilidade (label, ícone) | `local info = exports["cw-rep"]:getSkillInfo('lockpicking')` |

### Exports do Cliente
| Export | Descrição | Exemplo |
|--------|-------------|---------|
| `exports['cw-rep']:updateSkill(skill, amount)` | Atualizar habilidade local | `exports["cw-rep"]:updateSkill('searching', 1)` |
| `exports['cw-rep']:checkSkill(skill, val)` | Verificar se habilidade >= valor (callback) | `exports["cw-rep"]:checkSkill('lockpicking', 100, function(has) ... end)` |
| `exports['cw-rep']:playerHasEnoughSkill(skill, val)` | Verificar se habilidade >= valor (direto) | `if exports["cw-rep"]:playerHasEnoughSkill('crafting', 200) then ...` |
| `exports['cw-rep']:getCurrentSkill(skill)` | Obter XP atual | `local xp = exports["cw-rep"]:getCurrentSkill('cooking')` |
| `exports['cw-rep']:getCurrentLevel(skill)` | Obter nível atual | `local lvl = exports["cw-rep"]:getCurrentLevel('hunting')` |
| `exports['cw-rep']:getSkillInfo(skill)` | Obter info da habilidade | `local label = exports["cw-rep"]:getSkillInfo('mining').label` |

> **Compatibilidade Retroativa:** Todos os exports do `mz-skills` funcionam. Use `GetCurrentSkill` (G maiúsculo) para obter dados no formato antigo (`{Current = XP}`).

---

## 📥 Instalação

### Instalação Nova
1. Coloque `cw-rep` na pasta `resources`.
2. Importe o arquivo SQL para seu banco de dados:
   ```sql
   ALTER TABLE players ADD COLUMN skills TEXT DEFAULT '{}';
   ```
3. Adicione ao `server.cfg`:
   ```
   ensure qb-core
   ensure ox_lib
   ensure cw-rep
   ```
4. Configure `config.lua` (habilidades, níveis, menus).
5. Reinicie seu servidor.

### Migrando do mz-skills
1. Remova `mz-skills` dos seus recursos.
2. Instale `cw-rep`.
3. **Mantenha os mesmos nomes de habilidades** em `Config.Skills` que você tinha no mz-skills.
4. O cw-rep converterá automaticamente os dados antigos do mz-skills para o novo formato quando os jogadores usarem.
5. Reinicie seu servidor.

---

## 🔗 Integração com Menu Radial

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

---

## 📧 Notificações por E-mail

Habilite em `config.lua`:
```lua
Config.SendUpdateEmails = true
Config.EmailWaitTimes = { min = 4500, max = 7000 }  -- milissegundos
```

<<<<<<< fork
Então adicione `messages` a qualquer habilidade:
||||||| base

## Serverside
To Update a skill please use the following export:
=======
### To get a list of all of a players skills with names and labels:
```lua
    exports["cw-rep"]:getAllSkillsAndLevel()
```

Example usage:
```lua
    local allSkillsForThisPlayer = exports['cw-rep']:getAllSkillsAndLevel()
    print(json.encode(allSkillsForThisPlayer,{indent=true}))
    print('My skill in lockpicking is', allSkillsForThisPlayer['lockpicking'].current)
    print('My level in lockpicking is', allSkillsForThisPlayer['lockpicking'].level)
```
> This will be a list similar to the Config.Skills but with `name` and `current` skill level added to it for easy access. 


### If you want to listen to changes of a players skills
```lua
RegisterNetEvent('cw-rep:client:repWasUpdated', function(skills)
    print('new skills', json.encode(skills, {indent=true})) -- remove this line after you know how `skills` look
    -- Add code to do something with this info
end)
```

## Serverside
To Update a skill please use the following export:
>>>>>>> upstream
```lua
foodelivery = {
    icon = 'fas fa-star',
    messages = {
        { level = 50, message = "Você está indo muito bem!", sender = "FeedStars RH", subject = "FeedStars" },
        { level = 300, message = "Você é uma verdadeira ESTRELA do Food! ⭐", sender = "FeedStars RH", subject = "FeedStars" },
    }
}
```

---

## 🔗 Links

- 📦 [Download](https://github.com/mri-Qbox-Brasil/cw-rep)
- 💬 [Suporte Discord](https://discord.gg/FJY4mtjaKr)
- 🛒 [Mais Scripts](https://github.com/stars/Coffeelot/lists/cw-scripts)
- ☕ [Buy Me a Coffee](https://www.buymeacoffee.com/cwscriptbois)

---

## 🏆 Créditos

- **MrZainRP** — [mz-skills](https://github.com/MrZainRP/mz-skills) original
- **CW Scripts** — esta reescrita e otimização

---

## 📄 Licença

Grátis para uso em servidores FiveM.
