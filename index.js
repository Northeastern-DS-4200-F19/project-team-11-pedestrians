const stateBttns = document.querySelectorAll(".btn")

console.log(stateBttns)
stateBttns.forEach(btn => {
    btn.addEventListener("click",(e) => {
        e.preventDefault()
        state["view"] = btn.attributes["data-activity"].nodeValue;
        Promise.all(promises).then(letsGo);
    });
})