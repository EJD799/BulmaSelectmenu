function openSelectmenu(el) {
    alert("clicked");
}

function attachSelectmenu(el) {
    el.addEventListener("mousedown", function(e) {
        e.preventDefault();
    });
    el.addEventListener("click", function(e) {
        openSelectmenu(el);
    });
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
                        selectOption(el.getAttribute("id"), item.value);
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
                let title = document.createElement("h6");
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
                            selectOption(el.getAttribute("id"), subItem.value);
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
        return card;
    } else {
        console.warn("[Bulma Selectmenu] The select element does not have an ID. IDs are required for Bulma Selectmenu to work.");
    }
}

attachSelectmenu(menu);