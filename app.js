'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Referencias a elementos del DOM
const formTarea = $('#formTarea');
const inputTitulo = $('#inputTitulo');
const selectTag = $('#selectTag');
const taskList = $('#listaTareas');
const searchInput = $('#inputBuscar');
const clearSearchBtn = $('#btnLimpiarBuscar');
const statTotal = $('#statTotal');
const statVisibles = $('#statVisibles');
const statFavs = $('#statFavs');
const emptyState = $('#emptyState');

//Estado de los filtros
const filterState = {
  texto: '',
  tag: 'all',
};

// Crear tarjetas
const buildCard = ({ title, tag }) => {
  const li = document.createElement('li');
  li.className = 'card';
  li.dataset.tag = tag;
  li.dataset.fav = '0';
  li.innerHTML = `
  <div class="card__head">
    <span class="badge"></span>
    <div class="actions">
      <button class="icon" type="button" data-action="fav">☆</button>
      <button class="icon" type="button" data-action="done">✓</button>
      <button class="icon danger" type="button" data-action="del">🗑</button>
    </div>
  </div>
  <p class="card__title"></p>
  `;
  li.querySelector('.badge').textContent = tag;
  li.querySelector('.card__title').textContent = title;
  return li;
};

// Agregar nueva tarea
formTarea.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = inputTitulo.value.trim();
  if (!title) return;
  const tag = selectTag.value;
  const card = buildCard({ title, tag });
  taskList.append(card);
  inputTitulo.value = '';
  applyFilters();
});

// Delegación de eventos
taskList.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;
  const card = e.target.closest('.card');
  if (action === 'fav') doFav(card, e.target);
  if (action === 'done') doDone(card);
  if (action === 'del') doDelete(card);
  applyFilters();
});

// Acciones
const doFav = (card, btn) => {
  const fav = card.dataset.fav === '1';
  card.dataset.fav = fav ? '0' : '1';
  btn.textContent = fav ? '☆' : '★';
};

const doDone = (card) => {
  card.classList.toggle('is-done');
};

const doDelete = (card) => {
  card.remove();
};

// Filtro de búsqueda
searchInput.addEventListener('input', () => {
  filterState.texto = searchInput.value.trim().toLowerCase();
  applyFilters();
});

// Limpiar búsqueda
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  filterState.texto = '';
  applyFilters();
});

// Chips de filtro
$$('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const tag = chip.dataset.filter;
    if (!tag) return;
    $$('.chip').forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    filterState.tag = tag;
    applyFilters();
  });
});

// Funciones del filtro
const matchText = (card, texto) => {
  const title = card.querySelector('.card__title').textContent.toLowerCase();
  return title.includes(texto);
};

const matchTag = (card, tag) => {
  if (tag === 'all') return true;
  if (tag === 'fav') return card.dataset.fav === '1';
  return card.dataset.tag === tag;
};

// Aplicar filtros
const applyFilters = () => {
  const cards = $$('.card', taskList);
  let visibleCount = 0;
  let favCount = 0;
  cards.forEach((card) => {
    const okText = matchText(card, filterState.texto);
    const okTag = matchTag(card, filterState.tag);
    const show = okText && okTag;
    card.style.display = show ? '' : 'none';
    if (card.dataset.fav === '1') favCount++;
    if (show) visibleCount++;
  });
  statTotal.textContent = cards.length;
  statVisibles.textContent = visibleCount;
  statFavs.textContent = favCount;
  emptyState.classList.toggle('is-hidden', visibleCount !== 0);
};

// Inicializar
applyFilters();
