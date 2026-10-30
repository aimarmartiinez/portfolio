import articlesData from "./data/articles.json";

interface Article {
  category: string;
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
  return card;
}

articleGrid.replaceChildren(...articles.map(renderArticle));
