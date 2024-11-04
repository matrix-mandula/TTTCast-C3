const tapleft = document.getElementById("tapleft");
const tapight = document.getElementById("tapright");

tapight.addEventListener("touchstart", () => { navRight() })
tapleft.addEventListener("touchstart", () => { navLeft() })