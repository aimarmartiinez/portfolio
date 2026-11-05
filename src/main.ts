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
}

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

  for (const paragraph of article.paragraphs) {
    card.append(createTextElement("p", paragraph));
  }

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

articleGrid.replaceChildren(...articles.map(renderArticle));

const projectPreview = document.querySelector<HTMLDetailsElement>(".project-preview");

if (!projectPreview) {
  throw new Error('No se encontró la vista previa del proyecto ".project-preview".');
}

const projectPreviewSummary = projectPreview.querySelector("summary");
const projectPreviewPopup = projectPreview.querySelector<HTMLElement>(".project-preview-popup");

if (!projectPreviewSummary || !projectPreviewPopup) {
  throw new Error("No se encontró el botón o el contenido de la vista previa de PadelHub.");
}

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
