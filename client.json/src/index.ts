import * as bootstrap from "bootstrap";
import { Hour, Day, History, AdRecord } from "./types";

const HISTORY_DEPTH = 30;
const TEMPLATES = {} as Record<string, HTMLTemplateElement>;

document.addEventListener("DOMContentLoaded", () => {
  // Locate the template elements
  TEMPLATES.day = document.getElementById(
    "day-template"
  ) as HTMLTemplateElement;
  TEMPLATES.chart = document.getElementById(
    "chart-template"
  ) as HTMLTemplateElement;
  TEMPLATES.hour = document.getElementById(
    "hour-template"
  ) as HTMLTemplateElement;
  TEMPLATES.table = document.getElementById(
    "table-template"
  ) as HTMLTemplateElement;

  document.documentElement.addEventListener("drop", handleDrop);
  document.documentElement.addEventListener("dragover", (event) =>
    event.preventDefault()
  );
});

async function readJSON(file: File) {
  const text = await file.text();
  return JSON.parse(text);
}

async function handleDrop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer?.files[0].name !== "client.json") {
    alert("Please drop a file called 'client.json'");
    return;
  }

  const json = await readJSON(event.dataTransfer?.files[0]);
  const week = getHistory(json);

  renderHistory(week);

  // Enable tooltips
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}

function renderHistory(history: History): void {
  console.log(history);

  if (!Array.isArray(history) || history.length === 0) {
    return;
  }

  const daysElement = document.getElementById("days")!;

  daysElement.innerHTML = "";

  const maxAdsShown = history.reduce((max, day) => {
    const dayMax = day.hours.reduce((dayMax, hour) => {
      return Math.max(dayMax, hour.adsShown.length);
    }, 0);
    return Math.max(max, dayMax);
  }, 0);

  for (const day of history) {
    const dayCard = TEMPLATES.day.content.cloneNode(true) as DocumentFragment;
    const chartFragment = TEMPLATES.chart.content.cloneNode(
      true
    ) as DocumentFragment;
    const chartElement = chartFragment.children[0] as HTMLElement;

    const cardTitle = dayCard.querySelector<HTMLElement>(".card-title")!;
    const cardBody = dayCard.querySelector<HTMLElement>(".card-body")!;

    cardTitle.innerText = `${day.date.toLocaleDateString("en-US", {
      month: "short",
      weekday: "short",
    })} ${day.date.getDate()}`;

    for (const hour of day.hours) {
      const hourFragment = TEMPLATES.hour.content.cloneNode(
        true
      ) as DocumentFragment;
      const hourElement = hourFragment.children[0] as HTMLElement;

      hourElement.style.height = `${
        (hour.adsShown.length / maxAdsShown) * 100
      }%`;

      hourElement.dataset.hour = hour.hour.toString();
      hourElement.dataset.ads = hour.adsShown.length.toString();

      // Set data attributes for the types of ads shown,
      // as well as the actions taken.
      const types = new Map<string, number>();
      const actions = new Map<string, number>();

      for (const ad of hour.adsShown) {
        types.set(ad.type, (types.get(ad.type) || 0) + 1);
        actions.set(ad.action, (actions.get(ad.action) || 0) + 1);
      }

      for (const [type, count] of types) {
        hourElement.dataset[`type:${type}`] = count.toString();
      }

      for (const [action, count] of actions) {
        hourElement.dataset[`action:${action}`] = count.toString();
      }

      if (types.size > 0 || actions.size > 0) {
        let summary = `<strong>Hour ${hour.hour}</strong>\n`;

        for (const [type, count] of types) {
          summary += `${count} ${type} ads.\n`;
        }

        for (const [action, count] of actions) {
          summary += `${count} ${action} actions.\n`;
        }

        summary = summary.trim().replace(/\n/g, "<br>");

        hourElement.dataset["bsHtml"] = "true";
        hourElement.dataset["bsToggle"] = "tooltip";
        hourElement.dataset["bsPlacement"] = "auto";
        hourElement.dataset["bsTitle"] = summary;
      }

      chartElement.appendChild(hourElement);
    }

    cardBody.append(chartFragment, getDayTable(day));

    daysElement.appendChild(dayCard);
  }
}

function getDayTable(day: Day): HTMLTableElement {
  const tableFragment = TEMPLATES.table.content.cloneNode(
    true
  ) as DocumentFragment;
  const tableElement = tableFragment.children[0] as HTMLTableElement;

  for (const hour of day.hours) {
    if (hour.adsShown.length === 0) continue;

    const dayRow = document.createElement("tr");
    const dayCell = document.createElement("td");
    const dayCountCell = document.createElement("td");

    dayCell.innerText = hour.hour.toString();
    dayCountCell.innerText = hour.adsShown.length.toString();

    dayRow.append(dayCell, dayCountCell);

    tableElement.tBodies[0].appendChild(dayRow);
  }

  return tableElement;
}

function getHistory(json: any): History {
  const today = new Date();
  const history = [] as History;
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - HISTORY_DEPTH
  );

  // Cycle over each 24 hour period
  while (startDate < today) {
    // Create a new day
    const day = {
      date: new Date(startDate),
      hours: [] as Hour[],
    };

    history.push(day);

    // Cycle over each hour in the day
    for (let i = 0; i < 24; i++) {
      const ads = [] as AdRecord[];

      for (const record of json.adsShownHistory) {
        const date = new Date(record.timestamp_in_seconds * 1000);
        const type = record.ad_content.adType;
        const action = record.ad_content.adAction;

        if (
          date.getFullYear() === startDate.getFullYear() &&
          date.getMonth() === startDate.getMonth() &&
          date.getDate() === startDate.getDate() &&
          //   date.getHours() <= j
          date.getHours() === i
        ) {
          ads.push({
            time: date,
            type,
            action,
          });
        }
      }

      day.hours.push({
        hour: i,
        adsShown: ads,
      });
    }

    // Increment the date by one day
    startDate.setDate(startDate.getDate() + 1);
  }

  return history;
}
