'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => root.querySelectorAll(sel);

// Referencias a elementos del DOM
const formTarea = $('#formTarea');
const inputTitulo = $('#inputTitulo');
const selectTag = $('#selectTag');
const taskList = $('#listaTareas');

// Crear tarjetas
const buildCard = ({ title, tag }) => {
  const li = document.createElement('li');
  li.className = 'card';
  li.dataset.tag = tag;
  li.dataset.favorite = '0';
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
  const card = buildCard({ title: title, tag: tag });

  taskList.append(card);
  inputTitulo.value = '';
});

// Delegación de eventos marcar como favorito, completada o eliminar tarea
taskList.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const card = e.target.closest('.card');
  if (action === 'fav') {
    doFav(card, e.target);
  }
  if (action === 'done') {
    doDone(card);
  }
  if (action === 'del') {
    doDelete(card);
  }
});

// Acciones para marcar como favorito, completada o eliminar tarea
const doFav = (card, btn) => {
  const fav = card.dataset.favorite === '1';
  card.dataset.favorite = fav ? '0' : '1';
  btn.textContent = fav ? '☆' : '★';
};

const doDone = (card) => {
  card.classList.toggle('is-done');
};

const doDelete = (card) => {
  card.remove();
};
