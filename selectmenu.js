function openSelectmenu(el) {
    el.classList.add("is-focused");
    let card = populateMenu(el);
    positionMenu(card, el);
}

function attachSelectmenu(el) {
  el.addEventListener("mousedown", function (e) {
    e.preventDefault();
    e.stopPropagation(); // ← CRITICAL

    const existing = document.getElementById(`${el.id}_menuCard`);

    if (existing) {
      existing.remove(); // toggle off
    } else {
      openSelectmenu(el); // toggle on
    }
  });
}

function positionMenu(menu, button) {
  const rect = button.getBoundingClientRect();

  menu.style.position = "absolute";
  menu.style.left = `${rect.left + window.scrollX}px`;
  menu.style.top  = `${rect.bottom + window.scrollY}px`;
}

function populateMenu(el) {
    if (el.getAttribute("id")) {
        let card = document.createElement("div");
        card.setAttribute("id", `${el.getAttribute("id")}_menuCard`);
        card.setAttribute("class", "card selectmenu_menu");

        let items = el.children;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.tagName == "OPTION") {
                let option = document.createElement("div");
                option.classList.add("selectmenu_item");
                if (!item.disabled) {
                    option.addEventListener("click", function(e) {
                        selectOption(el, item.value);
                    });
                }
                if (item.disabled) {
                    option.classList.add("selectmenu_item_disabled");
                }
                if (el.value == item.value) {
                    option.classList.add("selectmenu_item_selected");
                }
                option.innerHTML = item.innerHTML;
                card.appendChild(option);
            } else if (item.tagName == "OPTGROUP") {
                if (i > 0) {
                    //card.appendChild(document.createElement("br"));
                }
                let title = document.createElement("span");
                title.setAttribute("class", "title is-6");
                title.innerHTML = item.getAttribute("label");
                card.appendChild(title);
                let subItems = item.children;
                for (let j = 0; j < subItems.length; j++) {
                    let subItem = subItems[j];
                    let option = document.createElement("div");
                    option.classList.add("selectmenu_item");
                    if (!subItem.disabled) {
                        option.addEventListener("click", function(e) {
                            selectOption(el, subItem.value);
                        });
                    }
                    if (subItem.disabled) {
                        option.classList.add("selectmenu_item_disabled");
                    }
                    if (el.value == subItem.value) {
                        option.classList.add("selectmenu_item_selected");
                    }
                    option.innerHTML = subItem.innerHTML;
                    card.appendChild(option);
                }
            }
        }

        card.addEventListener("mousedown", e => {
            e.stopPropagation();
        });

        document.body.appendChild(card);
        return card;
    } else {
        console.warn("[Bulma Selectmenu] The select element does not have an ID. IDs are required for Bulma Selectmenu to work.");
    }
}

function closeAllSelectmenus() {
  document.querySelectorAll(".selectmenu_menu").forEach(m => m.remove());
  document.querySelectorAll(".select select.is-focused").forEach(m => m.classList.remove("is-focused"));
}

document.addEventListener("mousedown", (e) => {
  if (!e.target.closest(".selectmenu_menu") &&
      !e.target.closest(".selectmenu_button")) {
    closeAllSelectmenus();
  }
});

function selectOption(menu, selection) {
    menu.value = selection;
    closeAllSelectmenus();
}

attachSelectmenu(menu);