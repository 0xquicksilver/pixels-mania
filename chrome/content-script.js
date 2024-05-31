injectScript();

var nodeNames = {
    sidebar: 'sidebar',
    loader: '.pixel-mania-loader',
    toggle: 'sidebar-toggle',
    pixel_mania_sidebar_content: '.pixel-mania-sidebar-content',
    pixel_mania_menu: '.pixel-mania-menu',
    pixel_mania_stats: '.pixel-mania-stats',
    pixel_mania_timer: '.pixel-mania-timer',
    pixel_mania_lands: '.pixel-mania-lands',
    pixel_mania_land: '.pixel-mania-land',
    pixel_mania_industries: '.pixel-mania-industries',
    pixel_modal_backdrop: '.commons_modalBackdrop__EOPaN',
    pixel_modal_title: '.Crafting_craftingFontTitle__lGiIZ',
    pixel_modal_menu: '.Crafting_tierSection__RThnx',
    pixel_Ui_Container: '.UIContainer_uiContainer__k_NnG.pixelfont',
    pixel_mania_page_detail: '.pixel-mania-page-detail',
    Pixel_Mania_Crafting_Time: '.Pixel_Mania_Crafting_Time'
}

var innerHtmls = {
    modal: `<div style="pointer-events: all;position: absolute;left: 0;top: 0;bottom: 0;right: 0;backdrop-filter: blur(9px);background-color: transparent;"> <div style=" display: flex; align-items: center; justify-content: center; width: 670px; position: absolute; top: calc(-335px + 50vh); left: calc(50% - 360px); " > <div style=" display: flex; align-items: center; justify-content: center; padding: 0px; " > <div style=" width: 1014px; height: 676px; background-image: url('https://d31ss916pli4td.cloudfront.net/game/ui/crafting/crafting_background_notabs.png'); background-repeat: no-repeat; background-size: cover; transform: scale3d(1, 1, 1); " > <div style="display: flex; flex-direction: row"> <div style=" margin-left: 128px; display: flex; flex-direction: column; width: 894px; " > <div style="display: flex; flex-direction: row"> <div style=" display: flex; flex-direction: column; padding-top: 10px; padding-left: 32px; width: 50%; " > <div style=" display: flex; flex-direction: column; width: 344px; height: 580px; max-height: 580px; " > <div style=" display: flex; flex-direction: column; padding: 4px; margin-top: 16px; " > <div style=" display: flex; width: 100%; flex-direction: row; align-items: center; " > <div style=" background-image: url('https://d31ss916pli4td.cloudfront.net/game/ui/crafting/crafting_titleline_mechanic.png'); background-repeat: no-repeat; background-position: center bottom; background-size: contain; flex-grow: 1; margin-top: 10px; text-align: center; margin-bottom: 10px; max-width: 100%; overflow-x: clip; " > <div class="Crafting_craftingFontTitle__lGiIZ" style=" padding-left: 18px; padding-right: 18px; " > Winemaking </div> </div> </div> </div> <div class="Crafting_recipeList__EhkOV"> <div class="Crafting_craftingSection__QPjg4 Crafting_subgroup__OVNCf" > <div class="Crafting_recipesTitle__2xc_1"> <div class="Crafting_craftingFontSubtitle__RPZ5i" > Recipes </div> </div> <div class="commons_scrollArea__dCnqw Crafting_recipeScroll__h4kg4" > <div>Tier I</div> <ul class="Crafting_tierSection__RThnx" ></ul> </div> </div> </div> </div> </div> <div style=" display: flex; flex-direction: column; padding-top: 48px; width: 50%; height: 566px; " > <div style=" display: flex; flex-direction: column; width: 344px; height: 566px; padding-right: 10px; justify-content: space-between; " > <div class="pixel-mania-page-detail"> </div> </div> </div> </div> </div> </div> </div> </div> <button type="button" class="Crafting_craftingCloseButton__ZbHQF" style="top: 15px; right: -92px; transform: scale3d(1, 1, 1)" id="close" > <img src="https://d31ss916pli4td.cloudfront.net/game/ui/crafting/crafting_exitbutton.png" width="100%" /> </button> </div></div>`,
    modal_menu_item: (data) => `<div class="Crafting_craftingRecipeItem__vnhBH"> <span class="Crafting_craftingFontText__EeNSQ clickable" style=" color: black; text-shadow: none; margin-left: 4px; display: block; padding: 4px; width: 100%; overflow: hidden; " >${data}</span></div>`,
    addLandButton: '<span className="text-md">add current location +</span>',
    addStorageButton: '<span className="text-md">add current Storage +</span>',
    closeButton: '<img src="https://d31ss916pli4td.cloudfront.net/game/ui/kit/closebtn.png" width="44" alt=""/>',
    reloadButton: '<img src="https://d31ss916pli4td.cloudfront.net/game/ui/hud/cycle.png" width="44" alt="" style="rotate: -90deg;"/>',
    detail_info: (item) => `<div style="display: flex;flex-direction: row;justify-content: space-evenly;align-items: center;"><div style="background-image: url('https://d31ss916pli4td.cloudfront.net/game/ui/crafting/crafting_border_recipe_details.png)');background-repeat: no-repeat;background-position: center center;background-size: contain;height: 66px;width: 66px;display: flex;justify-content: center;align-items: center;position: relative;"><img src="${item.img}" alt="${item.name}" height="44" /></div><div class="Crafting_detailsTitle__bGjKU"><div class="Crafting_craftingFontText__EeNSQ">${item.name}</div></div></div><div style="width: 100%;display: flex;flex-direction: row;justify-content: space-between;margin-top: 6px;padding-right: 12px;padding-left: 12px;"><div style="display: flex;flex-direction: row;align-items: center;justify-content: space-evenly;flex-grow: 1;"><div class="Crafting_craftingFontText__EeNSQ">Craft Time</div><div class="Pixel_Mania_Crafting_Time">${convertMinutesToTime(item.time.replace('m', ''))}</div></div></div>`,
    sidebar: '<button class="pixel-mania-sidebar-toggle" id="sidebar-toggle"><span>pixel mania</span></button><div class="pixel-mania-sidebar-content"><div class="pixel-mania-brand"><span>Pixel Mania</span></div><div class="pixel-mania-loader"><div class="loader"></div></div></div>'
}
var styles = {
    reloadButton: 'position: absolute;top: 0.5rem;right: 4rem;display: flex;width: max-content;background-color: transparent;border: none;outline: none;',
    closeButton: 'position: absolute;top: 0.5rem;right: 0.5rem;display: flex;width: max-content;background-color: transparent;border: none;outline: none;',
    addLandButton: 'padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 1rem;padding-right: 1rem; border-radius: 0.5rem; border:none; outline:none; width: max-content; background-color: rgb(225,225,225,0.5); ',
    addStorageButton: 'padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 1rem;padding-right: 1rem; border-radius: 0.5rem; border:none; outline:none; width: max-content; background-color: rgb(225,225,225,0.5); ',
    modal_menu_item: 'line-height: 18px;filter: none;',
    industry: "position: relative;width: 5rem;height: 5rem;display: flex;justify-content: center;align-items: center;",
    industry_backpack: "position: absolute;left: 0;top: 0;right: 0;object-fit: contain;height: 5rem;width: 5rem;",
    button_start: `background-color: transparent;border: none;background-image: url('https://d31ss916pli4td.cloudfront.net/game/ui/crafting/crafting_bg_create.png');background-repeat: no-repeat;background-position: center center;background-size: 100% 100%;color: red;padding: 12px;margin-top: 10px;`,
    sidebar: 'display: flex;  flex-direction: row;  margin: 0px;  height: 100%; position:relative;',
    pixel_mania_menu: '<div class="pixel-mania-item active" id="stats"><span class="text-sm">stats</span></div><div class="pixel-mania-item" id="timer"><span class="text-sm">timer</span></div><div class="pixel-mania-item" id="storage"><span class="text-sm">storage</span></div><div class="pixel-mania-item" id="task"><span class="text-sm">task</span></div>'
}

let players, currentPlayer, currentMap, sidebar, pixel_mania_menu, toggle, activeMenu = 'stats', currentIndex = 0, loading = true;

sidebar = document.createElement('div')
sidebar.id = nodeNames.sidebar;
sidebar.className = 'opened'
sidebar.innerHTML = innerHtmls.sidebar
document.body.style = styles.sidebar
document.body.insertBefore(sidebar, document.getElementById('__NEXT_DATA__'))

pixel_mania_menu = document.createElement('div')
pixel_mania_menu.className = nodeNames.pixel_mania_menu.replace('.', '')
pixel_mania_menu.innerHTML = styles.pixel_mania_menu
document.querySelector(nodeNames.pixel_mania_sidebar_content).appendChild(pixel_mania_menu)

toggle = document.getElementById("sidebar-toggle");
toggle.addEventListener("click", handleToggle);

var interval = setInterval(checkPlayers, 2000);

window.addEventListener('message', async (e) => {
    try {
        const response = await sendMessage(e.data);
        if (response.message && response.message === "Player Logout Change") {
            document.querySelector(nodeNames.loader).style.display = 'flex';
            await chrome.storage.sync.set({ currentPlayer: null });
            if (!interval) {
                interval = setInterval(checkPlayers, 2000);
            }
        }
    } catch (error) {
        // console.error('Error handling message event:', error);
    }
});

// setInterval(check, 10000)
document.addEventListener("keydown", shortcut);
document.addEventListener("keydown", LandModal);
document.addEventListener("keydown", (e) => {
    if (e.key === 'k' || e.key == 'k') {
        handleToggle()
    }
});

const targetElement = document.body;
const stopObservation = element_change_detection(targetElement);

// // Menambahkan event listener untuk custom event
// eventTarget.addEventListener('customEvent', (event) => {
//     console.log('Custom event triggered:', event.detail);
// });

// // Membuat dan memicu custom event
// const customEvent = new CustomEvent('customEvent', {
//     detail: { message: 'Hello, World!' }
// });

// eventTarget.dispatchEvent(customEvent);