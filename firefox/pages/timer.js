

function removeTimer() {
  document.querySelector(nodeNames.pixel_mania_timer)?.remove()
}


async function createTimerModal(data, player, land_id) {
  const modal = createModalElement(data.craft_name);
  const modal_menu = modal.querySelector(nodeNames.pixel_modal_menu);
  modal_menu.style = 'list-style: none;';
  
  data.items.forEach((item) => {
    const modal_menu_item = createModalMenuItem(item);
    modal_menu_item.addEventListener('click', () => handleMenuItemClick(item, player, land_id, data, modal));
    modal_menu.appendChild(modal_menu_item);
  });

  appendOrReplaceModal(modal);
}

function createModalElement(craftName) {
  const modal = document.createElement('div');
  modal.id = 'pixel-mania-modal-timer';
  modal.className = nodeNames.pixel_modal_backdrop.replace('.', '');
  modal.innerHTML = innerHtmls.modal;
  const modal_title = modal.querySelector(nodeNames.pixel_modal_title);
  modal_title.innerText = craftName;
  modal.querySelector('button[id="close"]').addEventListener('click', () => modal.remove());
  return modal;
}

function createModalMenuItem(item) {
  const modal_menu_item = document.createElement('li');
  modal_menu_item.style = styles.modal_menu_item;
  modal_menu_item.innerHTML = innerHtmls.modal_menu_item(item.name);
  return modal_menu_item;
}

async function handleMenuItemClick(item, player, land_id, data, modal) {
  const page_detail = document.querySelector(nodeNames.pixel_mania_page_detail);
  const detail_info = document.createElement('div');
  detail_info.className = 'Crafting_craftingSection__QPjg4 Crafting_craftingColumn__v6ueF';
  detail_info.innerHTML = innerHtmls.detail_info(item);

  const detail_action = document.createElement('div');
  detail_action.className = 'pixel-mania-page-button';
  const button_start = createStartButton(item, player, land_id, data, modal);

  detail_action.appendChild(button_start);

  if (page_detail.children.length > 0) {
    page_detail.replaceChildren(detail_info, detail_action);
  } else {
    page_detail.appendChild(detail_info);
    page_detail.appendChild(detail_action);
  }
}

function createStartButton(item, player, land_id, data, modal) {
  const button_start = document.createElement('button');
  button_start.className = 'Crafting_craftingButton__Qd6Ke';
  button_start.style = styles.button_start;
  button_start.innerHTML = '<span>Start</span>';

  button_start.addEventListener('click', async () => {
    var players = await get_data('players');
    var expire = addTimeToNow(convertMinutesToTime(item.time.replace('m', '')));
    var craftElement = document.querySelector(`div[data-key="${land_id}"]`).querySelector(`div[data-key="${data.craft_name.toLowerCase()}"]`);

    player.lands.forEach((land) => {
      if (land.landId === land_id) {
        const isWork = land.work.some((work) => work.id === item.id);
        if (!isWork) {
          land.work.push({ id: item.id, expire });
          startCountdown(expire, craftElement, true);
        }
      }
    });

    players = players.map((old_player) => old_player.username === player.username ? player : old_player);
    removeTimer();
    await set_data({ players, currentPlayer: player });
    await initTimer(player);
    modal.remove();
  });

  return button_start;
}

function appendOrReplaceModal(modal) {
  const pixel_ui_container = document.querySelector(nodeNames.pixel_Ui_Container);
  const existingModal = Array.from(pixel_ui_container.children).find(child => child.id === 'pixel-mania-modal-timer');
  
  if (existingModal) {
    pixel_ui_container.replaceChild(modal, existingModal);
  } else {
    pixel_ui_container.appendChild(modal);
  }
}


async function InjectIndustry(datas, industryElement, land_data) {
  // Bersihkan konten sebelumnya
  industryElement.innerHTML = '';

  datas.forEach(craft => {
      // Membuat elemen industri
      const industry = document.createElement('div');
      industry.setAttribute('data-key', craft.craft_name.toLowerCase());
      industry.style = styles.industry;

      // Membuat elemen gambar dan waktu
      const industry_backpack = document.createElement('img');
      const img = document.createElement('img');
      const time = document.createElement('div');

      // Mengatur atribut dan style elemen
      industry_backpack.src = 'https://d31ss916pli4td.cloudfront.net/game/ui/backpack/backpack_button_slot.png';
      industry_backpack.style = styles.industry_backpack;
      
      img.src = craft.craft_image;
      img.alt = craft.craft_name;
      img.style = "height: 2.5rem; position: absolute;";

      time.style = "height: 2.5rem; position: absolute;";

      // Menambahkan elemen ke dalam industri
      industry.appendChild(industry_backpack);
      industry.appendChild(img);
      industryElement.appendChild(industry);

      // Memeriksa dan mengatur waktu jika diperlukan
      land_data.work.forEach(wrk => {
          const filteredByid = filterItemsById(datas, wrk.id);
          if (filteredByid[0].craft_name === craft.craft_name) {
              img.remove();
              industry.appendChild(time);
              startCountdown(wrk.expire, time);
          }
      });

      // Menambahkan event listener klik ke elemen industri
      industry.addEventListener('click', async () => {
          await handleIndustryClick(industry, craft, datas, land_data);
      });
  });
}


async function initTimer(player) {
  var industries = await loadJSONData('industries.json');

  const timer = document.createElement('div');
  timer.className = nodeNames.pixel_mania_timer.replace('.', '');

  const addLandButton = document.createElement('button');
  addLandButton.style = styles.addLandButton;
  addLandButton.innerHTML = innerHtmls.addLandButton;

  addLandButton.addEventListener('click', () => {
      updateLand(player);
  });

  timer.appendChild(addLandButton);

  const lands = document.createElement('div');
  lands.className = 'hide-scrollbar ' + nodeNames.pixel_mania_lands.replace('.', '');
  timer.appendChild(lands);

  player.lands.forEach(land_data => {
      const land = document.createElement('div');
      land.setAttribute('data-key', land_data.landId);
      land.className = nodeNames.pixel_mania_land.replace('.', '');

      const closeButton = document.createElement('button');
      closeButton.style = styles.closeButton;
      closeButton.innerHTML = innerHtmls.closeButton;
      closeButton.addEventListener('click', () => {
        removeLand(player, land_data.landId)
      })

      const land_name = document.createElement('span');
      land_name.textContent = land_data.landId;

      const filter = document.createElement('div');
      filter.innerHTML = '<input type="text" class="filter" placeholder="search">';
      filter.addEventListener('keydown', (e) => {
          e.stopPropagation();
      });

      const industryElement = document.createElement('div');
      industryElement.className = nodeNames.pixel_mania_industries.replace('.', '');

      InjectIndustry(industries, industryElement, land_data);

      filter.addEventListener('input', (e) => {
          e.preventDefault();
          const filteredData = filterItemsByName(industries, e.target.value);
          InjectIndustry(filteredData, industryElement, land_data);
      });

      land.appendChild(land_name);
      land.appendChild(filter);
      land.appendChild(closeButton);
      land.appendChild(industryElement);
      lands.appendChild(land);
  });

  document.querySelector(nodeNames.pixel_mania_sidebar_content).appendChild(timer);
}
