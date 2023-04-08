// The JavaScript code goes here
const addLinkBtn = document.getElementById("addLink");
const linkList = document.getElementById("linkList");
const linkInput = document.getElementById("linkInput");

let db;

const request = window.indexedDB.open("linklist", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const objectStore = db.createObjectStore("links", {
    keyPath: "id",
    autoIncrement: true,
  });
  objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = function (event) {
  db = event.target.result;
  renderLinkList();
};

function renderLinkList() {
  linkList.innerHTML = "";
  const objectStore = db.transaction("links").objectStore("links");
  objectStore.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const link = cursor.value;
      const li = document.createElement("li");
      if (link.data.startsWith("steam://rungameid/")) {
        const appId = link.data.split("/").pop();
        const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
        const img = document.createElement("img");
        img.src = imgUrl;
        li.appendChild(img);
      } else {
        li.innerHTML = link.name;
      }
      li.setAttribute("tabindex", "0");
      li.onclick = function () {
        window.open(link.data, "_blank");
      };
      li.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          const nextLink = li.nextElementSibling;
          if (nextLink) {
            activeLink = nextLink;
            nextLink.focus();
          }
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          const prevLink = li.previousElementSibling;
          if (prevLink) {
            activeLink = prevLink;
            prevLink.focus();
          }
        } else if (event.key === "Enter") {
          event.preventDefault();
          window.open(link.data, "_blank");
        }
      });
      linkList.appendChild(li);
      cursor.continue();
    }
  };
}

addLinkBtn.onclick = function () {
  const linkName = prompt("Enter the name of the link:");
  const linkData = prompt("Enter the URL of the link:");

  if (!linkName || !linkData) {
    return;
  }

  const transaction = db.transaction(["links"], "readwrite");
  const objectStore = transaction.objectStore("links");
  const request = objectStore.add({ name: linkName, data: linkData });

  request.onsuccess = function () {
    renderLinkList();
  };
};

linkList.addEventListener("keydown", function (event) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    const nextLink = activeLink
      ? activeLink.nextElementSibling
      : linkList.firstElementChild;
    if (nextLink) {
      activeLink = nextLink;
      nextLink.focus();
    }
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    const prevLink = activeLink
      ? activeLink.previousElementSibling
      : linkList.lastElementChild;
    if (prevLink) {
      activeLink = prevLink;
      prevLink.focus();
    }
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    const link = activeLink;
    if (link) {
      const url = link.getAttribute("data-url");
      window.open(url, "_blank");
    }
  }
});

let activeLink = null;
let selectedIndex = 1;

const listItems = document.querySelectorAll(".gamelist li");

listItems.forEach((item) => {
  item.addEventListener("click", () => {
    listItems.forEach((item) => {
      item.classList.remove("selected");
    });
    item.classList.add("selected");
  });
});
