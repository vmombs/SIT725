const modalTriggerButton = document.querySelector(".modal-trigger");
const colorChangeButton = document.querySelector(
  ".waves-effect.waves-light.btn"
);
colorChangeButton.addEventListener("click", () => {
  modalTriggerButton.style.backgroundColor = "#FF0000";
});

$(document).ready(function () {
  $(".modal").modal();
});