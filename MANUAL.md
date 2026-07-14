# cw-rep — Manual

Sistema de reputação e habilidades para QBCore, com níveis de XP exponenciais e compatibilidade retroativa com os exports do `mz-skills`.

---

## Sumário

1. [Dependências](#dependências)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Habilidades e reputações](#habilidades-e-reputações)
5. [Níveis e XP](#níveis-e-xp)
6. [Comandos](#comandos)
7. [Integrações](#integrações)
8. [Entrypoints para outros recursos](#entrypoints-para-outros-recursos)
9. [Estrutura de arquivos](#estrutura-de-arquivos)

---

## Dependências

| Recurso | Obrigatório | Observação |
|---|---|---|
| `qb-core` | Sim | Framework base (`GetCoreObject`, callbacks, comandos, notificações) |
| `ox_lib` | Sim | Carregado como `@ox_lib/init.lua`; usado no menu de contexto (`lib.registerContext`) |
| `oxmysql` | Sim | Persistência das habilidades na coluna `players.skills` |
| `qb-menu` | Não | Só é usado quando `Config.UseOxMenu = false` |
| `qb-phone` | Não | Recebe os e-mails de progressão (`qb-phone:server:sendNewMail`) |

---

## Instalação

1. Copie a pasta `cw-rep` para `resources/`.
2. Importe o `skills.sql` no banco de dados:
   ```sql
   ALTER table players
   ADD COLUMN `skills` LONGTEXT;
   ```
3. Adicione ao `server.cfg`:
   ```
   ensure cw-rep
   ```
4. **Conflitos** — não rode junto com o `mz-skills`. O `cw-rep` registra os exports `GetCurrentSkill`, `UpdateSkill` e `CheckSkill` também sob o nome `mz-skills` (via handler `__cfx_export_mz-skills_*`), e os dois recursos colidiriam. Mantendo os mesmos nomes de habilidade, os recursos que chamavam `mz-skills` continuam funcionando sem alteração.

---

## Configuração

Todas as opções ficam em `config.lua`.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `Config.Debug` | bool | Sim | Imprime logs de diagnóstico no console (fetch, update de skill). Padrão: `true` |
| `Config.UpdateFrequency` | number | Sim | Intervalo em segundos do decaimento periódico de habilidades. Padrão: `5*60*60` |
| `Config.UseOxMenu` | bool | Sim | `true` usa o menu de contexto do `ox_lib`; `false` usa o `qb-menu` |
| `Config.SkillsTitle` | string | Sim | Título do menu das habilidades do tipo `skill`. Padrão: `Habilidades` |
| `Config.RepTitle` | string | Sim | Título do menu das habilidades do tipo `rep`. Padrão: `Reputação` |
| `Config.TypeCommand` | bool | Sim | Se `false`, os comandos continuam registrados mas não abrem menu nenhum |
| `Config.Skillmenu` | string | Sim | Nome do comando que abre o menu de habilidades. Padrão: `skill` |
| `Config.Repmenu` | string | Sim | Nome do comando que abre o menu de reputação. Padrão: `rep` |
| `Config.XPBarColour` | string | Sim | `colorScheme` da barra de progresso do menu `ox_lib`. Padrão: `green` |
| `Config.SendUpdateEmails` | bool | Não | Presente no config, mas **não é lido por nenhum arquivo do recurso**. O envio de e-mail é decidido por `notify` em cada mensagem (ver [Habilidades e reputações](#habilidades-e-reputações)) |
| `Config.EmailWaitTimes` | tabela `{min, max}` | Sim | Faixa em ms do atraso aleatório antes de disparar o e-mail no `qb-phone` |
| `Config.GenericMaxAmount` | number | Sim | Teto de XP global de qualquer habilidade. Pode ser reduzido por habilidade com `maxLevel`. Padrão: `1000000000` |
| `Config.GenericIcon` | string | Sim | Ícone Font Awesome usado quando a habilidade não define `icon`. Padrão: `fas fa-book` |
| `Config.DefaultLevels` | tabela | Sim | Faixas de XP por nível. Gerada por `generateExponentialLevels(baseExp, scaleFactor, levelCount)` |
| `Config.Skills` | tabela | Sim | Catálogo de habilidades e reputações |

> `client/client.lua` consulta `Config.LoseSkillsOverTime` para ligar o loop de decaimento (`-1` XP em todas as habilidades a cada `Config.UpdateFrequency`). Esse campo **não existe** no `config.lua` atual, então o decaimento fica desligado. Para ativar, adicione `Config.LoseSkillsOverTime = true`.

---

## Habilidades e reputações

Cada entrada de `Config.Skills` é uma habilidade. A chave da tabela é o identificador usado nos exports e no banco.

```lua
Config.Skills = {
    fishing = {
        label = 'Pescador',
        icon = 'fas fa-fish-fins',
        type = 'rep'
    },
    lockpicking = {
        label = 'Lockpicking',
        icon = 'fas fa-unlock',
        maxLevel = 350,
        type = 'skill',
        messages = {
            { notify = true, level = 50, message = "You're not horrible with that lockpick anymore" },
        }
    },
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `label` | string | Não | Nome exibido no menu. Se omitido, usa a própria chave |
| `icon` | string | Não | Ícone Font Awesome. Se omitido, usa `Config.GenericIcon` |
| `type` | string | Sim | `skill` aparece no menu `/skill`; `rep` aparece no menu `/rep` |
| `maxLevel` | number | Não | Teto de XP específico desta habilidade. Ao atingi-lo, novos ganhos são ignorados |
| `hide` | bool | Não | Oculta a habilidade dos menus, mas ela continua sendo persistida |
| `skillLevels` | tabela | Não | Substitui `Config.DefaultLevels` só nesta habilidade. Cada faixa aceita `title` para exibir um nome em vez do número do nível |
| `messages` | tabela | Não | Mensagens disparadas ao cruzar um limiar de XP |

### Mensagens de progressão

Cada item de `messages` tem `level` (limiar de XP) e `message`. O disparo acontece uma única vez, no momento em que o XP cruza o limiar para cima.

- Com `notify = true` — mostra um `QBCore.Functions.Notify` de sucesso no cliente.
- Sem `notify` — envia um e-mail no `qb-phone`, usando os campos `sender` e `subject` da mensagem. O envio é atrasado aleatoriamente entre `Config.EmailWaitTimes.min` e `.max`.

### Habilidades padrão do config

| Tipo `rep` | Tipo `skill` |
|---|---|
| `fishing`, `hunting`, `mining`, `garbage`, `taxi`, `cargo`, `cityworker`, `busdriver`, `trucker` | `cooking`, `crafting`, `searching`, `lockpicking`, `hotwiring` |

A entrada `areaexample` existe com `hide = true` e serve de modelo para habilidades ocultas.

---

## Níveis e XP

O XP de cada habilidade é um número inteiro; o nível é derivado dele pelas faixas de `Config.DefaultLevels` (ou `skillLevels` da habilidade).

```lua
local function generateExponentialLevels(baseExp, scaleFactor, levelCount)
    local levels = {}
    local fromExp = 0
    for i = 1, levelCount do
        local toExp = fromExp + baseExp * scaleFactor ^ (i - 1)
        table.insert(levels, { from = fromExp, to = math.round(toExp) })
        fromExp = math.round(toExp)
    end
    return levels
end

local baseExp = 10       -- XP necessário para o nível 1
local scaleFactor = 1.5  -- multiplicador de XP a cada nível
local levelCount = 30    -- total de níveis

Config.DefaultLevels = generateExponentialLevels(baseExp, scaleFactor, levelCount)
```

Ao ultrapassar a última faixa, o nível exibido vira `Maestria`. Se a faixa tiver `title`, o título é exibido no lugar do número.

Os valores de todas as habilidades são gravados como JSON na coluna `players.skills`, atualizados a cada mudança de XP. Na primeira vez que um jogador é carregado sem registro, o recurso grava todas as habilidades zeradas.

---

## Comandos

| Comando | Permissão | Descrição |
|---|---|---|
| `/skill` | Todos | Abre o menu das habilidades do tipo `skill`. O nome vem de `Config.Skillmenu` |
| `/rep` | Todos | Abre o menu das habilidades do tipo `rep`. O nome vem de `Config.Repmenu` |
| `/giveskill [id] [skill] [amount]` | `admin` (QBCore) | Adiciona XP a um jogador. Use valor negativo para remover |
| `/fetchSkills [source]` | `admin` (QBCore) | Imprime no console do servidor o XP de `lockpicking` do jogador |

---

## Integrações

### mz-skills

O `cw-rep` responde aos exports do `mz-skills` sem que os outros recursos precisem ser alterados. Além de expor `GetCurrentSkill`, `UpdateSkill` e `CheckSkill` no próprio nome, ele registra os handlers `__cfx_export_mz-skills_GetCurrentSkill`, `__cfx_export_mz-skills_UpdateSkill` e `__cfx_export_mz-skills_CheckSkill`, fazendo com que `exports['mz-skills']:...` caia no `cw-rep`.

O evento `mz-skills:client:CheckSkills` também é escutado e abre o menu.

### qb-phone

As mensagens sem `notify` viram e-mail no telefone do jogador via `qb-phone:server:sendNewMail`. Sem o `qb-phone` instalado, o evento simplesmente não é tratado e nada quebra.

### qb-menu

Quando `Config.UseOxMenu = false`, o menu é montado com `exports['qb-menu']:openMenu`. Nesse modo, `/skill` e `/rep` abrem a mesma lista com todas as habilidades.

### ox_lib

Com `Config.UseOxMenu = true` (padrão), o menu usa `lib.registerContext` com `menu = 'menu_jogador'`, ou seja, o botão "voltar" retorna para um contexto de id `menu_jogador` — útil se o servidor tiver um menu de jogador central com esse id.

### Menu radial

Para abrir o menu por um menu radial, aponte a entrada para o evento de cliente:

```lua
[3] = {
    id = 'skills',
    title = 'Ver Habilidades',
    icon = 'triangle-exclamation',
    type = 'client',
    event = 'mz-skills:client:CheckSkills',
    shouldClose = true,
}
```

---

## Entrypoints para outros recursos

### Exports de servidor (`server/server.lua`)

```lua
-- Adiciona (ou remove, com valor negativo) XP de um jogador
exports['cw-rep']:updateSkill(source, 'lockpicking', 10)

-- Retorna a tabela completa de habilidades do jogador, lida do banco
local skills = exports['cw-rep']:fetchSkills(source)
```

### Exports de cliente (`client/functions.lua`)

```lua
-- Adiciona XP à habilidade e persiste no servidor
exports['cw-rep']:updateSkill('searching', 1)

-- XP atual de uma habilidade
local xp = exports['cw-rep']:getCurrentSkill('fishing')

-- Nível atual (número ou title da faixa) e a faixa correspondente
local level = exports['cw-rep']:getCurrentLevel('fishing')

-- Config da habilidade (label, icon, type, maxLevel...)
local info = exports['cw-rep']:getSkillInfo('lockpicking')

-- Recarrega as habilidades do servidor
exports['cw-rep']:fetchSkills()

-- Comparação direta de XP
if exports['cw-rep']:playerHasEnoughSkill('crafting', 200) then end

-- Comparação por callback
exports['cw-rep']:checkSkill('lockpicking', 100, function(hasEnough) end)
```

Exports de cliente com nomes do `mz-skills` (mesma implementação):

```lua
local data = exports['cw-rep']:GetCurrentSkill('fishing')  -- retorna { Current = <xp> }
exports['cw-rep']:UpdateSkill('fishing', 5)
exports['cw-rep']:CheckSkill('fishing', 100, function(hasEnough) end)
```

### Eventos

| Evento | Lado | Parâmetros | Descrição |
|---|---|---|---|
| `cw-rep:client:updateSkills` | Cliente | `skill`, `amount` | Aplica XP no cliente e persiste. É o que o export de servidor dispara |
| `cw-rep:server:update` | Servidor | `data` (JSON das habilidades) | Grava a tabela de habilidades na coluna `players.skills` |
| `cw-rep:server:triggerEmail` | Servidor | `citizenid`, `sender`, `subject`, `message` | Agenda o envio do e-mail no `qb-phone` |
| `mz-skills:client:CheckSkills` | Cliente | — | Abre o menu de habilidades |

### Callback

```lua
QBCore.Functions.TriggerCallback('cw-rep:server:fetchStatus', function(skills) end)
```

Retorna a tabela `{ [skill] = xp }` do jogador que chamou, criando o registro zerado se ele ainda não existir.

---

## Estrutura de arquivos

```
cw-rep/
├── client/
│   ├── client.lua        — loop de decaimento de XP e evento de update vindo do servidor
│   ├── functions.lua     — cálculo de nível, exports de cliente, bridge do mz-skills, notificações
│   └── gui.lua           — menus (ox_lib e qb-menu) e comandos /skill e /rep
├── server/
│   └── server.lua        — persistência em players.skills, callback de fetch, comandos de admin
├── web/                  — fonte React da UI (NÃO é carregada: o fxmanifest não declara ui_page)
├── config.lua            — habilidades, níveis, textos e opções gerais
├── skills.sql            — ALTER TABLE que adiciona a coluna players.skills
└── fxmanifest.lua
```
