const tocContainer = document.querySelector(".toc-container");
const allHeadings = document.querySelectorAll(".post h2");

function addIdToHeadings() {
  allHeadings.forEach((heading) => {
    const id = heading.innerText.split(" ").join("-").toLowerCase();
    heading.setAttribute("id", id);
  });
}

function createTable() {
  if (tocContainer && allHeadings.length > 0) {
    const ul = document.createElement("ul");
    ul.classList.add("table-of-contents");
    tocContainer.appendChild(ul);

    allHeadings.forEach((heading) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.innerText = heading.innerText;
      a.setAttribute("href", "#" + heading.getAttribute("id"));

      li.appendChild(a);
      ul.appendChild(li);
    });
  }
}

function toggleToc() {
  const tocContainer = document.querySelector(".toc-container");
  const toggleLabel = document.querySelector(".toctogglelabel");

  if (tocContainer.classList.contains("hidden")) {
    tocContainer.classList.remove("hidden");
    toggleLabel.innerText = " Click here to Hide ";
  } else {
    tocContainer.classList.add("hidden");
    toggleLabel.innerText = " Click here to Show ";
  }
}

if (tocContainer) {
  addIdToHeadings();
  createTable();
}