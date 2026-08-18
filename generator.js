const form = document.querySelector("#generator-form");
const dateInput = document.querySelector("#updated");
dateInput.value = new Date().toISOString().slice(0, 10);

function dateInPortuguese(value) {
  const [year, month, day] = value.split("-");
  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  return `${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = {
    goal: Number(document.querySelector("#goal").value),
    raised: Number(document.querySelector("#raised").value),
    donors: Number(document.querySelector("#donors").value),
    updated: dateInPortuguese(dateInput.value),
    message: document.querySelector("#message").value.trim()
  };
  if (values.raised > values.goal) values.raised = values.goal;
  fetch("app.js").then((response) => response.text()).then((template) => {
    const output = template.replace(/const campaign = \{[\s\S]*?\n\};/, `const campaign = ${JSON.stringify(values, null, 2)};`);
    const blob = new Blob([output], { type: "text/javascript;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "app.js";
    link.click();
    URL.revokeObjectURL(link.href);
    document.querySelector("#success").classList.add("show");
  }).catch(() => alert("Não foi possível ler o app.js. Abra o gerador pelo GitHub Pages ou por um servidor local."));
});
