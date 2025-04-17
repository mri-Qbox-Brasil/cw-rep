# cw-rep

-   Um sistema de habilidade/XP para qb (otimizado a partir de mz-skills)
-   Compatibilidade total com versões anteriores de exports do mz-skills (não há necessidade de atualizar todos os seus scripts usando mz skills)
-   Suporta menu QB e menu OX

>   Todo o crédito a MrZainRP por [mz-skills](https://github.com/MrZainRP/mz-skills) no qual isso é baseado. Ótimo script.

>   Algo que cw-rep NÃO tem: habilidades de personagem padrão do GTA

>   O menu QB é suportado... mas provavelmente não receberá muitas atualizações ou correções a menos que sejam críticas, e pode ter funcionalidade limitada em comparação com OX

## Instalação

-   Baixe o recurso e coloque-o na pasta de recursos. Certifique-se de que a pasta se chama `cw-rep`
-   Se você estiver instalando do zero: Importe o arquivo SQL para o banco de dados do seu servidor (ou seja, execute o arquivo sql e certifique-se de que o banco de dados está funcionando)
-   Se você estiver mudando de mz-skills:
    -   Certifique-se de atualizar as habilidades cw-rep na Configuração para corresponder a mz-skills se você quiser manter os nomes que você tem
    -   Remova a pasta mz-skills
-   Adicione ``start cw-rep`` ao seu server.cfg (ou simplesmente certifique-se de que cw-rep está na sua pasta [qb])

>   CW-rep tem um novo formato de banco de dados (otimizado) em comparação com mz-skills, mas esta conversão é feita enquanto o script está sendo usado. Isso pode fazer com que alguns personagens antigos não utilizados ainda tenham o formato antigo até serem usados

## Configuração

Você provavelmente vai querer fazer alguma configuração para este script, então certifique-se de se familiarizar com a configuração. Existem algumas pequenas diferenças entre este e mz, mas o script deve ser capaz de reescrever seus dados do banco de dados mz-skills para cw-rep em tempo real, desde que os nomes em `Config.Skills` correspondam.

Você pode definir habilidades assim:

```lua
    lockpicking = { -- se você quiser usar nomes com espaços, você precisará digitá-lo como "['Habilidade de Arrombamento'] = {" por exemplo
        icon = 'fas fa-unlock', -- ícone que aparece no menu
        label = 'Arrombamento' -- Rótulo que é exibido no menu (o padrão é o nome da habilidade, assim como mz skills se isso não estiver definido)
    },
```
> Encontre os nomes dos ícones [aqui](https://fontawesome.com/v5/search?m=free)

> Nota: cw-rep não vem com as mesmas habilidades/rep padrão que mz-skills, então você precisará atualizar a configuração

Se você quiser uma habilidade que também envie notificações ao jogador em certos níveis, você pode defini-las assim:
```lua
    lockpicking = { -- se você quiser usar nomes com espaços, você precisará digitá-lo como "['Habilidade de Arrombamento'] = {" por exemplo
        icon = 'fas fa-unlock', -- ícone que aparece no menu
        label = 'Arrombamento' -- Rótulo que é exibido no menu (o padrão é o nome da habilidade, assim como mz skills se isso não estiver definido)
        messages = {
            { notify = true, level = 50, message = "Você não é mais horrível com essa gazua" },
            { notify = true, level = 100, message = "Você começa a se sentir melhor com essa gazua na sua mão" },
            { notify = true, level = 200, message = "Você está ficando bom com uma gazua" },
            { notify = true, level = 300, message = "Você sente que está arrasando no arrombamento agora" },
            { notify = true, level = 350, message = "Nenhum tambor ficará intocado. Você é como o Advogado do Arrombamento!" },
        }
    },
```
O importante aqui é o `notify = true` porque sem isso você estará enviando e-mails! Notificações por e-mail são ótimas para reputação de trabalho ou reputação de área, por exemplo. Aqui está como definir uma com e-mails:

```lua
    foodelivery = {
        icon = 'fas fa-star',
        label = 'Reputação do trabalho de entrega de comida',
        messages = {
            { level = 50, message = "Você está fazendo um ótimo trabalho", sender = "RH da FeedStars", subject = "FeedStars" },
            { level = 100, message = "Nós só queríamos dizer que amamos você! ❤", sender = "RH da FeedStars", subject = "FeedStars" },
            { level = 220, message = "Continue entregando! ❤", sender = "RH da FeedStars", subject = "FeedStars" },
            { level = 300, message = "Você é uma verdadeira ESTRELA da Comida! ⭐", sender = "RH da FeedStars", subject = "FeedStars" },
            { level = 500, message = "Você sequer tem uma vida?? Funcionário do ano!", sender = "RH da FeedStars", subject = "FeedStars" },
        }
    },
```
## Níveis de Habilidade
Os níveis de habilidade padrão são definidos em `Config.DefaultLevels` e você pode personalizá-los ao seu gosto, mas você também pode criar níveis personalizados para cada habilidade individual, por exemplo, a reputação de rua:
```lua
    streetreputation = {
        icon = 'fas fa-mask',
        skillLevels = {
            { title = "Desconhecido", from = 00, to = 1000 },
            { title = "Novato", from = 1000, to = 2000 },
            { title = "Malandro", from = 2000, to = 3000 },
            { title = "Criminoso", from = 3000, to = 4000 },
            { title = "Executor Urbano", from = 5000, to = 6000 },
            { title = "Renegado", from = 6000, to = 7000 },
            { title = "Subchefe", from = 8000, to = 9000 },
            { title = "Chefe", from = 9000, to = 10000 },
        }
    },
```
> título é opcional

Como você pode ver, você também deve incluir um remetente e um assunto aqui.

Você também pode encontrar esses exemplos na Configuração.

## Usando cw-rep
### Clientside

#### Para atualizar uma habilidade, use o seguinte export:
```lua
    exports["cw-rep"]:updateSkill(skillName, amount)
```
Por exemplo, para atualizar "Searching" de bin-diving (como usado com mz-bins)
```lua
    exports["cw-rep"]:updateSkill("Searching", 1)
```
Você pode randomizar a quantidade de habilidade ganha, por exemplo:
 ```lua
    local searchgain = math.random(1, 3)
    exports["cw-rep"]:updateSkill("Searching", searchgain)
```
#### O export para verificar se uma habilidade é igual ou maior que um valor específico é o seguinte:
```lua
    exports["cw-rep"]:checkSkill(skill, val)
```

Você pode usar isso para bloquear conteúdo atrás de um nível específico, por exemplo:
```lua
exports["cw-rep"]:checkSkill("Searching", 100, function(hasskill)
    if hasskill then
        TriggerEvent('mz-bins:client:Reward')
    else
        QBCore.Functions.Notify('You need at least 100XP in Searching to do this.', "error", 3500)
    end
end)
```
Ou como uma alternativa isso:
```lua
    local hasSkill = exports["cw-rep"]:playerHasEnoughSkill("Searching", 100)
    if hasSkill then
        -- do thing
    end
```

> Os dois acima funcionam mais ou menos da mesma forma, apenas maneiras diferentes de obter o mesmo resultado

#### O export para obter a habilidade atual de um jogador para interagir com outros scripts é o seguinte:
```lua
    exports["cw-rep"]:getCurrentSkill(skill)
```
> Este difere de mz-skills em que retorna diretamente o valor. Em Mz-skills você teria que fazer `.Current` para obter o valor. Se você usar `GetCurrentSkill` (G maiúsculo) ele retorna da mesma forma que mz-skills costumava fazer

#### Para obter o nível, em vez da quantidade de habilidade/xp:
```lua
    exports["cw-rep"]:getCurrentLevel(skill)
```

Exemplo:
```lua
    local xp = exports["cw-rep"]:getCurrentSkill('crafting')
    local level = exports["cw-rep"]:getCurrentLevel('crafting')
    print('You are level ', level, ' in crafting. Your XP is', xp)
```
#### Se você quiser informações de uma habilidade (o que está definido na configuração: rótulo, por exemplo)
```lua
    exports["cw-rep"]:getSkillInfo(skill)
```

Exemplo de uso:
```lua
    local skillInfo = exports["cw-rep"]:getSkillInfo('gun_crafting')
    print('Label of gun_crafting is', skillInfo.label)
    print('Icon of gun_crafting is', skillInfo.icon)
```


## Serverside
Para atualizar uma habilidade, use o seguinte export:
```lua
    exports["cw-rep"]:updateSkill(source, skillName, amount)
```
> `source` deve ser obviamente a fonte do jogador

Um exemplo de como usar isso seria:
```lua
    exports["cw-rep"]:updateSkill(source, 'lockpicking', 10)
```
O export para verificar para obter as habilidades do jogador:
```lua
    exports["cw-rep"]:fetchSkills(source)
```
Um exemplo de como usar isso seria:
```lua
    local playerSkills = exports["cw-rep"]:fetchSkills(source)
    print('Jogador com fonte',source, ' habilidades de lockpicking:',playerSkills.lockpicking)
```

> `source` deve ser obviamente a fonte do jogador

## Menu Radial
Para acesso ao menu radial ao comando "skills", adicione isso a qb-radialmenu/config.lua em algum lugar que pareça adequado:

```lua
    [3] = {
        id = 'skills',
        title = 'Verificar Habilidades',
        icon = 'triangle-exclamation',
        type = 'client',
        event = 'cw-rep:client:CheckSkills',
        shouldClose = true,
    },
```

>

# Download

[Download](https://github.com/mri-Qbox-Brasil/cw-rep)

# Preview
## Ox
<p align="center">
    <img src="https://media.discordapp.net/attachments/1016069642495729715/1227702266119852132/image.png?ex=66295dd5&is=6616e8d5&hm=544bbf052da18b79839863217e8cee7fb700f8971ee1f2b388c448f62d534325&=&format=webp&quality=lossless"/>
</p>

## Links úteis
### ⭐ Confira nossa [Tebex store](https://cw-scripts.tebex.io/category/2523396) para alguns scripts baratos ⭐

### [Mais scripts gratuitos](https://github.com/stars/Coffeelot/lists/cw-scripts)  👈

**Suporte, atualizações e previews de scripts:** [Entre no discord!](https://discord.gg/FJY4mtjaKr)

Se você quiser apoiar o que fazemos, pode nos comprar um café aqui:

[![Nos compre um café](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg)](https://www.buymeacoffee.com/cwscriptbois)