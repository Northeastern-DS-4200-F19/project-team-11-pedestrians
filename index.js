const stateBttns = document.querySelectorAll(".btn")

console.log(stateBttns)
stateBttns.forEach(btn => {
    btn.addEventListener("click",(e) => {
        e.preventDefault()
        state = btn.attributes["data-activity"].nodeValue;
        console.log(promises)
        Promise.all(promises).then(letsGo);
    })
})