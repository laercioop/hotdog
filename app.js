const campaign = {
  goal: 1000,
  raised: 20,
  donors: 1,
  updated: "17 de agosto de 2026",
  message: "Estamos no começo. Sua ajuda faz a diferença."
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const formatNumber = new Intl.NumberFormat("pt-BR");
const goal = Math.max(Number(campaign.goal) || 1, 1);
const raised = Math.max(0, Math.min(Number(campaign.raised) || 0, goal));
const donors = Math.max(0, Number(campaign.donors) || 0);
const remaining = Math.max(goal - raised, 0);
const percent = Math.round((raised / goal) * 100);
const labelLevel = Math.min(86, Math.max(8, percent));
const hotdogCount = Math.min(Math.round(raised), Math.round(goal));

document.querySelectorAll("[data-goal]").forEach((item) => item.textContent = currency.format(goal));
document.querySelectorAll("[data-raised]").forEach((item) => item.textContent = currency.format(raised));
document.querySelectorAll("[data-donors]").forEach((item) => item.textContent = formatNumber.format(donors));
document.querySelectorAll("[data-remaining]").forEach((item) => item.textContent = currency.format(remaining));
document.querySelector("[data-percent]").textContent = `${percent}% da meta`;
document.querySelector("[data-message]").textContent = campaign.message;
document.querySelector("[data-updated]").textContent = campaign.updated;
document.querySelector("[data-hotdog-count]").textContent = formatNumber.format(hotdogCount);
document.querySelector(".thermometer-fill").style.height = `${percent}%`;
document.querySelector(".meter-labels").style.setProperty("--label-level", labelLevel);
document.querySelector(".progress-fill").style.width = `${percent}%`;

const meter = document.querySelector("[role=progressbar]");
meter.setAttribute("aria-valuemax", goal);
meter.setAttribute("aria-valuenow", raised);
meter.setAttribute("aria-valuetext", `${currency.format(raised)} de ${currency.format(goal)}`);

const wall = document.querySelector("[data-hotdog-wall]");
const hotdogs = [];
const fragment = document.createDocumentFragment();

for (let index = 0; index < hotdogCount; index += 1) {
  const hotdog = document.createElement("img");
  hotdog.src = "hot-dog.svg";
  hotdog.alt = "";
  hotdog.className = "hotdog";
  hotdog.loading = index > 50 ? "lazy" : "eager";
  hotdog.style.animationDelay = `${Math.min(index * 10, 400)}ms`;
  fragment.append(hotdog);
  hotdogs.push(hotdog);
}

wall.append(fragment);

function layoutHotdogs() {
  const wallWidth = Math.max(wall.clientWidth, 240);
  const wallHeight = Math.max(wall.clientHeight, 80);
  const rows = Math.min(8, Math.max(3, Math.ceil(Math.sqrt(hotdogCount / 4))));
  const columns = Math.ceil(hotdogCount / rows);
  const size = Math.max(6, Math.min(54, Math.floor(Math.min(
    wallWidth / (columns * 0.58 + 0.42),
    wallHeight / (rows * 0.52 + 0.48)
  ))));
  const pileWidth = ((columns - 1) * size * 0.58) + size;
  const offsetX = Math.max(0, (wallWidth - pileWidth) / 2);

  hotdogs.forEach((hotdog, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const stagger = row % 2 ? size * 0.24 : 0;
    const rotation = ((index * 17) % 13) - 6;
    hotdog.style.width = `${size}px`;
    hotdog.style.left = `${offsetX + column * size * 0.58 + stagger}px`;
    hotdog.style.bottom = `${row * size * 0.52}px`;
    hotdog.style.rotate = `${rotation}deg`;
  });
}

layoutHotdogs();
window.addEventListener("resize", layoutHotdogs, { passive: true });
