// Bulma Selectmenu v2.0.1
// Made by EJD799

let bulmaSelectmenu = {
    openMenu: function(el) {
        el.classList.add("is-focused");
        let card = bulmaSelectmenu.populateMenu(el);
        bulmaSelectmenu.positionMenu(card, el);
    },

    attachMenu: function(el) {
        el.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation(); // ← CRITICAL

            const existing = document.getElementById(`${el.id}_menuCard`);

            if (existing) {
                existing.remove(); // toggle off
            } else {
                bulmaSelectmenu.openMenu(el); // toggle on
            }
        });
    },


    positionMenu: function(menu, button) {
        const rect = button.getBoundingClientRect();
    
        const top = rect.bottom + window.scrollY;
        const left = rect.left + window.scrollX;
    
        menu.style.position = "absolute";
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    
        // Available space below the button
        const viewportBottom = window.innerHeight + window.scrollY;
        const availableHeight = viewportBottom - top;
    
        // Read the CSS max-height (fallback to 300 if missing)
        const cssMaxHeight = parseFloat(
            getComputedStyle(menu).maxHeight
        ) || 300;
    
        // Clamp max-height so it never overflows
        menu.style.maxHeight = `${Math.max(
            0,
            Math.min(cssMaxHeight, availableHeight - 8)
        )}px`;
    },

    populateMenu: function(el) {
        if (el.getAttribute("id")) {
            let card = document.createElement("div");
            card.setAttribute("id", `${el.getAttribute("id")}_menuCard`);
            card.setAttribute("class", "card selectmenu_menu");

            if (el.parentElement.classList.contains("is-searchable")) {
                let searchContainer = document.createElement("p");
                searchContainer.setAttribute("class", "control has-icons-left");

                let input = document.createElement("input");
                input.setAttribute("class", "input selectmenu_search");
                input.setAttribute("placeholder", "Search");
                input.addEventListener("input", function(e) {
                    bulmaSelectmenu.updateSearch(card, input.value, el.getAttribute("id"));
                });

                let icon = document.createElement("span");
                icon.innerHTML = `<i class="fas fa-magnifying-glass"></i>`;
                icon.setAttribute("class", "icon is-small is-left selectmenu_searchicon");

                searchContainer.appendChild(input);
                searchContainer.appendChild(icon);
                card.appendChild(searchContainer);
            }

            let items = el.children;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (item.tagName == "OPTION") {
                    let option = document.createElement("div");
                    option.classList.add("selectmenu_item");
                    if (!item.disabled) {
                        option.addEventListener("click", function(e) {
                            bulmaSelectmenu.selectOption(el, item.value);
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
                                bulmaSelectmenu.selectOption(el, subItem.value);
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

            if (el.parentElement.classList.contains("is-searchable")) {
                let noResults = document.createElement("span");
                noResults.setAttribute("id", `${el.getAttribute("id")}_searchNoResults`);
                noResults.setAttribute("class", "selectmenu_hidden");
                noResults.innerHTML = `<center><i>No results</i></center>`;
                card.appendChild(noResults);
            }

            card.addEventListener("mousedown", e => {
                e.stopPropagation();
            });

            document.body.appendChild(card);
            return card;
        } else {
            console.warn("[Bulma Selectmenu] The select element does not have an ID. IDs are required for Bulma Selectmenu to work.");
        }
    },

    closeAllMenus: function() {
        document.querySelectorAll(".selectmenu_menu").forEach(m => m.remove());
        document.querySelectorAll(".select select.is-focused").forEach(m => m.classList.remove("is-focused"));
    },

    selectOption: function(menu, selection) {
        menu.value = selection;

        menu.dispatchEvent(new Event("change", {
            bubbles: true
        }));
        
        bulmaSelectmenu.closeAllMenus();
    },

    updateSearch: function(menu, query, selectName) {
        let items = menu.children;
        let validItems = 0;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if (query == "") {
                item.classList.remove("selectmenu_hidden");
            } else {
                if (item.tagName == "SPAN" && item.classList.contains("title")) {
                    item.classList.add("selectmenu_hidden");
                }
                if (item.tagName == "DIV") {
                    if (item.innerHTML.toLowerCase().includes(query.toLowerCase())) {
                        item.classList.remove("selectmenu_hidden");
                        validItems++;
                    } else {
                        item.classList.add("selectmenu_hidden");
                    }
                }
            }
        }

        if ((query != "") && (validItems == 0)) {
            document.getElementById(`${selectName}_searchNoResults`).classList.remove("selectmenu_hidden");
        } else {
            document.getElementById(`${selectName}_searchNoResults`).classList.add("selectmenu_hidden");
        }
    }
}

document.addEventListener("mousedown", (e) => {
    if (!e.target.closest(".selectmenu_menu") &&
        !e.target.closest(".selectmenu_button")) {
        bulmaSelectmenu.closeAllMenus();
    }
});
