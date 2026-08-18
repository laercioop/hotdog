const campaign = {
  goal: 1200,
  raised: 0,
  donors: 0,
  updated: "17 de agosto de 2026",
  message: "Estamos no comeco. Sua ajuda faz a diferenca."
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const formatNumber = new Intl.NumberFormat("pt-BR");
const cappedRaised = Math.max(0, Math.min(Number(campaign.raised) || 0, Number(campaign.goal) || 0));
const goal = Math.max(Number(campaign.goal) || 1, 1);
const percent = Math.round((cappedRaised / goal) * 100);
const remaining = Math.max(goal - cappedRaised, 0);
const hotdogCount = Math.min(20 + Math.round(cappedRaised), 1220);

document.querySelectorAll("[data-goal]").forEach((item) => item.textContent = currency.format(goal));
document.querySelectorAll("[data-raised]").forEach((item) => item.textContent = currency.format(cappedRaised));
document.querySelectorAll("[data-donors]").forEach((item) => item.textContent = formatNumber.format(Math.max(0, Number(campaign.donors) || 0)));
document.querySelectorAll("[data-remaining]").forEach((item) => item.textContent = currency.format(remaining));
document.querySelector("[data-percent]").textContent = `${percent}% da meta`;
document.querySelector("[data-message]").textContent = campaign.message;
document.querySelector("[data-updated]").textContent = `Atualizado em ${campaign.updated}`;
document.querySelector("[data-hotdog-count]").textContent = formatNumber.format(hotdogCount);
document.querySelector(".thermometer-fill").style.height = `${percent}%`;
document.querySelector(".thermometer-scale").style.setProperty("--level", percent);
const meter = document.querySelector("[role=progressbar]");
meter.setAttribute("aria-valuemax", goal);
meter.setAttribute("aria-valuenow", cappedRaised);
const wall = document.querySelector("[data-hotdog-wall]");
const wallWidth = Math.max(wall.clientWidth, 280);
const hotdogSize = Math.max(5, Math.min(44, Math.floor(Math.sqrt((wallWidth * 115) / (hotdogCount * 1.5)))));
wall.style.setProperty("--hotdog-size", `${hotdogSize}px`);
const fragment = document.createDocumentFragment();
for (let i = 0; i < hotdogCount; i += 1) {
  const hotdog = document.createElement("img");
  hotdog.src = "hot-dog.svg";
  hotdog.alt = "";
  hotdog.className = "hotdog";
  hotdog.loading = "lazy";
  hotdog.style.animationDelay = `${Math.min(i * 12, 500)}ms`;
  fragment.append(hotdog);
}
wall.append(fragment);
