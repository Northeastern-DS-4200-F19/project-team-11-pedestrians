const stateBttns = document.querySelectorAll(".btn")
var state = 'crime'
console.log(stateBttns)
stateBttns.forEach(btn => {
    btn.addEventListener("click",(e) => {
        e.preventDefault()
        state = btn.attributes["data-activity"].nodeValue;
        console.log(state);
        Promise.all(promises).then(letsGo);
    });
})