'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => root.querySelectorAll(sel);

// Referencias a elementos del DOM
const formTarea = $('#formTarea');
const inputTitulo = $('#inputTitulo');
const selectTag = $('#selectTag');
const list = $('#listaTareas');

formTarea.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = inputTitulo.value.trim();
  if (!title) return;

  const tag = selectTag.value;
  const id = 't' + Date.now();

  const li = document.createElement('li');
  li.className = 'card';
  li.dataset.id = id;
  li.dataset.tag = tag;
  li.dataset.favorite = '0';

  li.innerHTML = `
    <div class="card__head">
      <span class="badge">${tag}</span>
      <div class="actions">
        <button class="icon" data-action="fav">☆</button>
        <button class="icon" data-action="done">✓</button>
        <button class="icon danger" data-action="del">🗑</button>
      </div>
    </div>
    <p class="card__title">${title}</p>
    `;
  list.appendChild(li);
  // Limpiar el input después de agregar la tarea
  inputTitulo.value = '';
});

// Marcar tarea como favorita, completada o eliminarla
list.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const card = btn.closest('.card');
  const action = btn.dataset.action;

  // Lógica para cada acción
  // Marcar como favorito
  if (action === 'fav') {
    const isFav = card.dataset.favorite === '1';
    card.dataset.favorite = isFav ? '0' : '1';
    btn.textContent = isFav ? '☆' : '★';
  }

  // Marcar como completada
  if (action === 'done') {
    card.classList.toggle('is-done');
  }
});
