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

attachSelectmenu(menu);