local QBCore = exports['qb-core']:GetCoreObject()

local oxmenu = exports.ox_menu

local function getXpText(currentXp, nextLevel)
    if currentXp > nextLevel then return 'XP: '..tostring(currentXp) end
    return 'XP: '..currentXp..'/'..nextLevel
end

local function createSkillMenu()
    skillMenu = {}
    skillMenu[#skillMenu + 1] = {
        isHeader = true,
        header = 'Skills',
        isMenuHeader = true,
        icon = 'fas fa-chart-simple'
    }

    for k,currentValue in pairs(mySkills) do
        local skillData = Config.Skills[k]
        local label = k
        if Config.Skills[k] and Config.Skills[k].label then
            label = Config.Skills[k].label
        end
        if not skillData.hide then
            local level, levelData = getLevel(currentValue, k)
            skillMenu[#skillMenu + 1] = {
                header = label .. ' (Level: ' .. level .. ')',
                txt = getXpText(currentValue, levelData.to),
                icon = skillData.icon or nil,
                params = {
                    args = {
                        v
                    }
                }
            }
        end
    end
    exports['qb-menu']:openMenu(skillMenu)
end

local function createSkillMenuOX(type)
    local options = {}
    local sortedSkills = {}
    
    local keys = {}   

    for key in pairs(Config.Skills) do
        table.insert(keys, key)
    end
    -- Sort keys
    table.sort(keys)
    -- Iterate over sorted keys and access corresponding values
    for _, key in ipairs(keys) do
        if not Config.Skills[key].hide and Config.Skills[key].type == type then
            local currentValue = mySkills[key] or 0
            local SkillLevel
            local min = 0
            local max = 0

            local level, levelData = getLevel(tonumber(currentValue), key)
            -- Calculate progress bar percentage
           
            local label = key
            if Config.Skills[key] and Config.Skills[key].label then
                label = Config.Skills[key].label
            end
            local icon = Config.GenericIcon
            if Config.Skills[key] and Config.Skills[key].icon then
                icon = Config.Skills[key].icon
            end
    
            options[#options + 1] = {
                title = label .. ' (Level: ' .. level .. ')',
                description = getXpText(currentValue, levelData.to),
                icon = icon,
                args = {
                    currentValue = currentValue
                },
                progress = math.floor((currentValue - levelData.from) / (levelData.to - levelData.from) * 100),
                colorScheme = Config.XPBarColour,
            }
        end
    end

    local title = type == 'rep' and Config.RepTitle or Config.SkillsTitle

    lib.registerContext({
        id = 'skill_menu',
        menu = 'menu_jogador',
        title = title,
        options = options
    })

    lib.showContext('skill_menu')
end

RegisterCommand(Config.Skillmenu, function()
    if mySkills == nil then return end
    if Config.TypeCommand and Config.UseOxMenu then
        createSkillMenuOX('skill')
    elseif Config.TypeCommand then
        createSkillMenu()
    else 
        Wait(10)
    end
end)

RegisterCommand(Config.Repmenu, function()
    if mySkills == nil then return end
    if Config.TypeCommand and Config.UseOxMenu then
        createSkillMenuOX('rep')
    elseif Config.TypeCommand then
        createSkillMenu()
    else 
        Wait(10)
    end
end)
        
RegisterNetEvent("mz-skills:client:CheckSkills", function()
    if Config.UseOxMenu then
        createSkillMenuOX()
    elseif not Config.TypeCommand then
        createSkillMenu()
    else 
        Wait(10)
    end
end)
