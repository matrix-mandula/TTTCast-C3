const tapleft = document.getElementById("tapleft");
const tapight = document.getElementById("tapright");

tapight.addEventListener("touchstart", () => { if (!reserved) { navRight() } })
tapleft.addEventListener("touchstart", () => { if (!reserved) { navLeft() } })