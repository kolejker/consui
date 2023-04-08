function renderLinkList() {
  linkList.innerHTML = "";
  const objectStore = db.transaction("links").objectStore("links");
  objectStore.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const link = cursor.value;
      const searchTerm = searchInput.value.trim().toLowerCase(); // get the search term
      if (
        searchTerm.length === 0 ||
        link.name.toLowerCase().includes(searchTerm)
      ) {
        // check if the search term is empty or matches the link name
        // create the link list item
        const li = document.createElement("li");
        li.classList.add("game-item");
        const gameInfo = document.createElement("div");
        gameInfo.classList.add("game-info");
        li.appendChild(gameInfo);
        const gameImage = document.createElement("img");
        gameImage.classList.add("game-image");
        if (link.data.startsWith("steam://rungameid/")) {
          const appId = link.data.split("/").pop();
          const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
          gameImage.src = imgUrl;
        } else {
          // Set a default image if the link is not a Steam game
          gameImage.src = "default-game-image.jpg";
        }
        gameInfo.appendChild(gameImage);
        const gameName = document.createElement("span");
        gameName.classList.add("game-name");
        gameName.textContent = link.name;
        gameInfo.appendChild(gameName);
        const gameOptions = document.createElement("div");
        gameOptions.classList.add("game-options");
        li.appendChild(gameOptions);
        const playBtn = document.createElement("button");
        playBtn.classList.add("circle-btn", "play-btn");
        playBtn.onclick = function () {
          window.open(link.data, "_blank");
        };
        const playIcon = document.createElement("i");
        playIcon.classList.add("fas", "fa-play");
        playBtn.appendChild(playIcon);
        gameOptions.appendChild(playBtn);
        const storeBtn = document.createElement("button");
        storeBtn.classList.add("circle-btn", "store-btn");
        storeBtn.onclick = function () {
          const appId = link.data.split("/").pop();
          const storeUrl = `https://store.steampowered.com/app/${appId}`;
          const webBrowserUrl = `/webbrowser/app.html?url=${encodeURIComponent(
            storeUrl
          )}`;
          window.open(webBrowserUrl, "_blank");
        };

        const storeIcon = document.createElement("i");
        storeIcon.classList.add("fas", "fa-shopping-bag");
        storeBtn.appendChild(storeIcon);
        gameOptions.appendChild(storeBtn);
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("circle-btn", "delete-btn");
        deleteBtn.onclick = function () {
          const transaction = db.transaction(["links"], "readwrite");
          const objectStore = transaction.objectStore("links");
          const request = objectStore.delete(link.id);
          request.onsuccess = function () {
            renderLinkList();
          };
        };
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash-alt");
        deleteBtn.appendChild(deleteIcon);
        gameOptions.appendChild(deleteBtn);
        linkList.appendChild(li);
      }
      cursor.continue();
    }
  };
}
