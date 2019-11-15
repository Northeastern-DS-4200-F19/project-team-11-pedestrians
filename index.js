const stateBttns = document.querySelectorAll(".btn")

console.log(stateBttns)
stateBttns.forEach(btn => {
    btn.addEventListener("click",(e) => {
        e.preventDefault()
<<<<<<< HEAD
        state = btn.attributes["data-activity"].nodeValue;
=======
        state["view"] = btn.attributes["data-activity"].nodeValue;
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
        Promise.all(promises).then(letsGo);
    });
})