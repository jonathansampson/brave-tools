import { Hour, Day, Week, AdRecord } from "./types";

document.addEventListener("DOMContentLoaded", () => {
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
  const week = getLastWeek(json);

  renderWeek(week);
}

function renderWeek(week: Week): void {
  console.log(week);

  if (!Array.isArray(week) || week.length === 0) {
    return;
  }

  const daysElement = document.getElementById("days")!;

  daysElement.innerHTML = "";

  const maxAdsShown = week.reduce((max, day) => {
    const dayMax = day.hours.reduce((dayMax, hour) => {
      return Math.max(dayMax, hour.adsShown.length);
    }, 0);
    return Math.max(max, dayMax);
  }, 0);

  for (const day of week) {
    const dayDiv = document.createElement("div");
    const dayName = document.createElement("h2");
    const dayChart = document.createElement("div");
    const dayTable = getDayTable(day);

    dayDiv.classList.add("day");
    dayChart.classList.add("chart");

    dayName.innerText = `${day.date.toLocaleDateString("en-US", {
      weekday: "short",
    })} ${day.date.getDate()}`;

    dayDiv.append(dayName, dayChart, dayTable);

    for (const hour of day.hours) {
      const hourDiv = document.createElement("div");

      hourDiv.classList.add("hour");
      hourDiv.dataset.hour = hour.hour.toString();
      hourDiv.dataset.ads = hour.adsShown.length.toString();

      hourDiv.style.height = `${(hour.adsShown.length / maxAdsShown) * 100}%`;

      dayChart.appendChild(hourDiv);
    }

    daysElement.appendChild(dayDiv);
  }
}

function getDayTable(day: Day): HTMLTableElement {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  table.append(thead, tbody);

  const headerRow = document.createElement("tr");
  const headerHourCell = document.createElement("th");
  const headerCountCell = document.createElement("th");

  headerHourCell.innerText = "Hour";
  headerCountCell.innerText = "Ads";

  headerRow.append(headerHourCell, headerCountCell);

  thead.appendChild(headerRow);

  for (const hour of day.hours) {
    if (hour.adsShown.length === 0) continue;

    const dayRow = document.createElement("tr");
    const dayCell = document.createElement("td");
    const dayCountCell = document.createElement("td");

    dayCell.innerText = hour.hour.toString();
    dayCountCell.innerText = hour.adsShown.length.toString();

    dayRow.append(dayCell, dayCountCell);

    tbody.appendChild(dayRow);
  }

  return table;
}

function getLastWeek(json: any): Week {
  const today = new Date();
  const week = [] as Week;
  const oneWeekAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );

  // Cycle over each 24 hour period in the last week
  for (let i = 0; i < 8; i++) {
    // Create a new day
    const day = {
      date: new Date(oneWeekAgo),
      hours: [] as Hour[],
    };

    week.push(day);

    // Cycle over each hour in the day
    for (let j = 0; j < 24; j++) {
      const ads = [] as AdRecord[];

      for (const record of json.adsShownHistory) {
        const date = new Date(record.timestamp_in_seconds * 1000);
        const type = record.ad_content.adType;
        const action = record.ad_content.adAction;

        if (
          date.getFullYear() === oneWeekAgo.getFullYear() &&
          date.getMonth() === oneWeekAgo.getMonth() &&
          date.getDate() === oneWeekAgo.getDate() &&
          //   date.getHours() <= j
          date.getHours() === j
        ) {
          ads.push({
            time: date,
            type,
            action,
          });
        }
      }

      day.hours.push({
        hour: j,
        adsShown: ads,
      });
    }

    // Increment the date by one day
    oneWeekAgo.setDate(oneWeekAgo.getDate() + 1);
  }

  return week;
}
