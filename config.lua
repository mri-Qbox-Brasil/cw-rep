Config = {}
Config.Debug = true                        -- Set to "true" to print debugging messages

Config.UpdateFrequency = 5*60*60                -- Seconds interval between removing values (no need to touch this)
Config.UseOxMenu = true                     -- set to "true" to use ox_lib menu instead of qb-menu
Config.SkillsTitle = "Habilidades"            -- Change this to label your skill system as you see fit.
Config.RepTitle = "Reputação"            -- Change this to label your skill system as you see fit.

Config.TypeCommand = true                   -- Set to "false" to disable the "/skills" command (or whatever word you set in the next function)
Config.Skillmenu = "skill"                 -- phrase typed to display skills menu (check readme.md to set to commit to radial menu)
Config.Repmenu = "rep"                 -- phrase typed to display skills menu (check readme.md to set to commit to radial menu)

Config.XPBarColour = "green"
-- Config.EmailWaitTimes = { min = 45000, max =  300000 }
Config.SendUpdateEmails = false -- if true, send emails when hitting the correct levels (if available)
Config.EmailWaitTimes = { min = 4500, max =  7000 }

Config.GenericMaxAmount = 1000000000 -- the max skill level. Can be overrided by adding maxLevel to any skill
Config.GenericIcon = 'fas fa-book'

---------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------
-- Sistema de nível antigo
-- Config.DefaultLevels = {
--     { from = 0, to = 100 },
--     { from = 100, to = 200 },
--     { from = 200, to = 300 },
--     { from = 300, to = 400 },
--     { from = 500, to = 600 },
--     { from = 600, to = 700 },
--     { from = 800, to = 900 },
--     { from = 900, to = 1000 },
-- }
---------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------
-- Sistema de XP Exponencial
-- Função para gerar os níveis exponencialmente
local function generateExponentialLevels(baseExp, scaleFactor, levelCount)
    local levels = {}
    local fromExp = 0
    for i = 1, levelCount do
        local toExp = fromExp + baseExp * scaleFactor ^ (i - 1)
        local nextToExp = fromExp + baseExp * scaleFactor ^ i
        table.insert(levels, { from = fromExp, to = math.round(toExp) })
        fromExp = nextToExp
    end
    return levels
end

-- Configurações para geração de níveis exponencialmente
local baseExp = 10  -- Experiência base para o nível 1
local scaleFactor = 2  -- Fator de escala para aumentar a experiência a cada nível (ajustado para uma progressão mais suave)
local levelCount = 100  -- Número total de níveis

-- Geração dos níveis exponencialmente
Config.DefaultLevels = generateExponentialLevels(baseExp, scaleFactor, levelCount)
---------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------
Config.Skills = {
    fishing = {
        label = 'Pescador',
        icon = 'fas fa-fish-fins',
        type = 'rep'
    },
    hunting = {
        label = 'Caçador',
        icon = 'crosshairs',
        type = 'rep'
    },
    mining = {
        label = 'Minerador',
        icon = 'fa-solid fa-helmet-safety',
        type = 'rep'
    },
    garbage = {
        label = 'Lixeiro',
        icon = 'fa-solid fa-recycle',
        type = 'rep'
    },
    taxi = {
        label = 'Taxista',
        icon = 'taxi',
        type = 'rep'
    },
    cargo = {
        label = 'Transportador',
        icon = 'fa-solid fa-truck-fast',
        type = 'rep'
    },
    cityworker = {
        label = 'Eletricista',
        icon = 'bolt',
        type = 'rep'
    },
    -- streetreputation = {
    --     label = 'Reputação',
    --     icon = 'fas fa-mask',
    --     skillLevels = {
    --         { title = "Desconhecido", from = 00, to = 1000 },
    --         { title = "Rookie", from = 1000, to = 2000 },
    --         { title = "Hustler", from = 2000, to = 3000 },
    --         { title = "Crimer", from = 3000, to = 4000 },
    --         { title = "Urban Enforcer", from = 5000, to = 6000 },
    --         { title = "Renagade", from = 6000, to = 7000 },
    --         { title = "Underboss", from = 8000, to = 9000 },
    --         { title = "Boss", from = 9000, to = 10000 }, 
    --     },
    --     type = 'rep'
    -- },

---------------------------------------------------------------------------------------------------------------------------------
    cooking = {
        label = 'Cozinhar',
        icon = 'fa-solid fa-drumstick-bite',
        type = 'skill'
    },
    crafting = {
        label = 'Fabricação',
        icon = 'gear',
        type = 'skill'
    },
    searching = {
        label = 'Vasculhar',
        icon = 'search',
        type = 'skill'
    },
    lockpicking = {
        label = 'Lockpicking',
        icon = 'fas fa-unlock',
        maxLevel = 350,
        type = 'skill',
        messages = {
            { notify = true, level = 50, message = "You're not horrible with that lockpick anymore" },
            { notify = true, level = 100, message = "You start feeling better with that lockpick in your hand" },
            { notify = true, level = 200, message = "You're getting good with a lockpick" },
            { notify = true, level = 300, message = "You feel like you're nailing lockpicking now" },
            { notify = true, level = 350, message = "No tumbler will go untouched. You're like the Lockpicking Lawyer!" },
        }
    },
    hotwiring = {
        label = 'Ligação direta',
        icon = 'fas fa-car',
        type = 'skill'
    },

    -- taxi = {
    --     label = 'Taxista',
    --     icon = 'fas fa-taxi',
    -- },
    -- crafting = {
    --     label = 'Crafting Geral',
    --     icon = 'fas fa-wrench',
    -- },
    -- gun_crafting = {
    --     label = 'Crafting de Armas',
    --     icon = 'fas fa-gun',
    -- },
    -- househeft = {
    --     label = 'House Theft',
    --     icon = 'fas fa-house',
    -- },
    -- pizza = {
    --     label = 'Pizza',
    --     icon = 'fas fa-house',
    -- },
    -- containers = {
    --     icon = 'fas fa-house',
    -- },

    -- scrapping = {
    --     icon = 'fas fa-cannabis',
    -- },
    -- delivery = {
    --     icon = 'fas fa-truck-arrow-right',
    -- },

    -- garbage = {
    --     icon = 'fas fa-trash-can',
    -- },
    -- hotdog = {
    --     icon = 'fas fa-hotdog',
    -- },
    -- drugSales = {
    --     icon = 'fas fa-pills',
    -- },


    -- foodelivery = {
    --     icon = 'fas fa-star',
    --     label = 'Food delivery job rep',
    --     messages = {
    --         { level = 50, message = "You're doing a great job", sender = "FeedStars HR", subject = "FeedStars" },
    --         { level = 100, message = "We just wanted to tell you that we love you! ❤", sender = "FeedStars HR", subject = "FeedStars" },
    --         { level = 220, message = "Keep up that delivering! ❤", sender = "FeedStars HR", subject = "FeedStars" },
    --         { level = 300, message = "You're a real Food STAR! ⭐", sender = "FeedStars HR", subject = "FeedStars" },
    --         { level = 500, message = "Do you even have a life?? Employee of the year!", sender = "FeedStars HR", subject = "FeedStars" },
    --     }
    -- },
    -- AREAS
    areaexample = {
        hide = true,
        icon = 'fas fa-globe',
    }
}