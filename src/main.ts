import articlesData from "./data/articles.json";

const themeButton = document.querySelector<HTMLButtonElement>(".toggle-theme-container button");

if (!themeButton) {
  throw new Error("No se encontró el botón para cambiar el tema.");
}

const themeIcon = themeButton.querySelector<HTMLImageElement>("img");

if (!themeIcon) {
  throw new Error("No se encontró el icono del tema.");
}

const toggleButton = themeButton;
const toggleIcon = themeIcon;
const sunIcon = new URL("./icons/sunny_24px.svg", import.meta.url).href;
const moonIcon = new URL("./icons/dark_mode_24px.svg", import.meta.url).href;

let isDarkTheme = localStorage.getItem("portfolio-theme") === "dark";

function applyTheme(): void {
  const label = isDarkTheme ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

  document.documentElement.dataset.theme = isDarkTheme ? "dark" : "light";
  toggleButton.setAttribute("aria-pressed", String(isDarkTheme));
  toggleButton.setAttribute("aria-label", label);
  toggleButton.title = label;
  toggleIcon.src = isDarkTheme ? moonIcon : sunIcon;
}

applyTheme();

toggleButton.addEventListener("click", () => {
  isDarkTheme = !isDarkTheme;
  localStorage.setItem("portfolio-theme", isDarkTheme ? "dark" : "light");
  applyTheme();
});

const sectionNavigationLinks = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('.topbar a[href^="#"]'),
)
  .map((link) => ({
    link,
    section: document.getElementById(link.hash.slice(1)),
  }))
  .filter(
    (item): item is { link: HTMLAnchorElement; section: HTMLElement } =>
      item.section !== null,
  );

if (sectionNavigationLinks.length > 0 && "IntersectionObserver" in window) {
  const updateActiveNavigationLink = (): void => {
    const activationPoint = window.innerHeight * 0.4;
    const activeItem = sectionNavigationLinks.find(({ section }) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= activationPoint && bounds.bottom > activationPoint;
    });

    if (!activeItem) {
      return;
    }

    for (const { link } of sectionNavigationLinks) {
      link.removeAttribute("aria-current");
    }

    activeItem.link.setAttribute("aria-current", "location");

    if (window.location.hash !== activeItem.link.hash) {
      window.history.replaceState(null, "", activeItem.link.hash);
    }
  };

  const sectionObserver = new IntersectionObserver(
    updateActiveNavigationLink,
    { rootMargin: "-35% 0px -55% 0px" },
  );

  for (const { section } of sectionNavigationLinks) {
    sectionObserver.observe(section);
  }

  updateActiveNavigationLink();
}

const contactForm = document.querySelector<HTMLFormElement>("#contact form");

if (!contactForm) {
  throw new Error('No se encontró el formulario de contacto "#contact form".');
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  window.alert("Estoy trabajando en ello. El envío del formulario estará disponible próximamente.");
});

interface Article {
  category: string;
  githubUrl: string;
  title: string;
  lead: string;
  paragraphs: string[];
  tags: string[];
  video?: string;
}

const articleVideos: Record<string, string> = {
  padelhub: new URL("./videos/padelhub.mp4", import.meta.url).href,
  dashboard: new URL("./videos/dashboard.mp4", import.meta.url).href,
  "web-app-template": new URL("./videos/web-app-template.mp4", import.meta.url).href,
  "portfolio-DAW": new URL("./videos/portfolio-DAW.mp4", import.meta.url).href,
};

const articles: Article[] = articlesData;
const articleGrid = document.querySelector<HTMLDivElement>("#article-grid");

if (!articleGrid) {
  throw new Error('No se encontró el contenedor del blog "#article-grid".');
}

function createTextElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  text: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

const articleDialog = document.createElement("dialog");
articleDialog.classList.add("article-dialog");

document.body.appendChild(articleDialog);

function openArticleDialog(article: Article, index: number): void {
  const header = document.createElement("div");
  header.classList.add("article-meta");

  const category = document.createElement("span");
  category.textContent = article.category;

  const number = document.createElement("span");
  number.textContent = String(index + 1).padStart(2, "0");

  header.append(category, number);

  const title = document.createElement("h2");
  title.textContent = article.title;

  const lead = document.createElement("p");
  lead.classList.add("article-lead");
  lead.textContent = article.lead;

  const content = document.createElement("div");
  content.classList.add("article-dialog-content");

  content.append(header, title, lead);

  article.paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    content.appendChild(p);
  });

  const tags = document.createElement("ul");
  tags.classList.add("article-tags");

  article.tags.forEach((tag) => {
    const li = document.createElement("li");
    li.textContent = tag;
    tags.appendChild(li);
  });

  content.appendChild(tags);

  const githubLink = document.createElement("a");
  githubLink.classList.add("article-github-link");
  githubLink.href = article.githubUrl;
  githubLink.target = "_blank";
  githubLink.rel = "noopener noreferrer";
  githubLink.textContent = "Ver proyecto en GitHub";

  content.appendChild(githubLink);

  const closeButton = document.createElement("button");
  closeButton.classList.add("article-dialog-close");
  closeButton.textContent = "×";
  closeButton.type = "button";
  closeButton.addEventListener("click", () => {
    articleDialog.close();
  });

  content.appendChild(closeButton);

  articleDialog.replaceChildren(content);
  articleDialog.showModal();
}

articleDialog.addEventListener("click", (event) => {
  if (event.target === articleDialog) {
    articleDialog.close();
  }
});

function renderArticle(article: Article, index: number): HTMLElement {
  const card = document.createElement("article");
  card.className = "article-item";

  const meta = document.createElement("div");
  meta.className = "article-meta";
  meta.append(
    createTextElement("span", article.category),
    createTextElement("span", String(index + 1).padStart(2, "0")),
  );

  card.append(
    meta,
    createTextElement("h3", article.title),
    createTextElement("p", article.lead, "article-lead"),
  );

  if (article.video) {
    const videoUrl = articleVideos[article.video];

    if (!videoUrl) {
      throw new Error(`No se encontró el vídeo del artículo "${article.title}".`);
    }

    const preview = document.createElement("video");
    preview.className = "article-preview";
    preview.src = videoUrl;
    preview.controls = true;
    preview.preload = "metadata";
    preview.playsInline = true;
    preview.setAttribute("aria-label", `Previsualización del proyecto ${article.title}`);
    card.append(preview);
  }

  const readButton = createTextElement("button", "Leer artículo", "article-read-button");
  readButton.type = "button";
  readButton.addEventListener("click", () => openArticleDialog(article, index));
  card.append(readButton);

  const tags = document.createElement("ul");
  tags.className = "article-tags";
  tags.setAttribute("aria-label", "Tecnologías");

  for (const tag of article.tags) {
    tags.append(createTextElement("li", tag));
  }

  card.append(tags);

  const githubLink = document.createElement("a");
  githubLink.className = "article-github-link";
  githubLink.href = article.githubUrl;
  githubLink.target = "_blank";
  githubLink.rel = "noopener noreferrer";
  githubLink.textContent = "Ver proyecto en GitHub";
  card.append(githubLink);

  return card;
}

const loadMoreButton = document.querySelector<HTMLButtonElement>("#load-more-articles");

if (!articleGrid || !loadMoreButton) {
  throw new Error("No se encontró el contenedor o el botón para cargar más artículos.");
}

const articleGridElement = articleGrid;
const loadMoreArticlesButton = loadMoreButton;
const pageSize = 6;
let visibleArticleCount = pageSize;

function renderArticles(): void {
  const visibleArticles = articles.slice(0, visibleArticleCount);

  articleGridElement.replaceChildren(...visibleArticles.map(renderArticle));
  loadMoreArticlesButton.hidden = visibleArticleCount >= articles.length;
}

loadMoreArticlesButton.addEventListener("click", () => {
  visibleArticleCount += pageSize;
  renderArticles();
});
renderArticles();

const projectPreview = document.querySelector<HTMLDetailsElement>(".project-preview");

if (!projectPreview) {
  throw new Error('No se encontró la vista previa del proyecto ".project-preview".');
}

const projectPreviewSummary = projectPreview.querySelector("summary");
const projectPreviewPopup = projectPreview.querySelector<HTMLElement>(".project-preview-popup");
const projectPreviewVideo = projectPreview.querySelector<HTMLVideoElement>(".project-preview-video");

if (!projectPreviewSummary || !projectPreviewPopup || !projectPreviewVideo) {
  throw new Error("No se encontró el botón o el contenido de la vista previa de PadelHub.");
}

projectPreviewVideo.src = articleVideos.padelhub;

const preview = projectPreview;
const previewSummary = projectPreviewSummary;

previewSummary.addEventListener("click", (event) => {
  event.preventDefault();
  preview.open = !preview.open;
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Node) || !preview.contains(event.target)) {
    preview.open = false;
  }
});
