import { fetchNotes, addNote, deleteNote, archiveNote, unarchiveNote, editNote } from '../api.js';


let currentArchivedView = false;
let indexInstance = null;

class Index extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/styles.css">
      <header>
        <h1>Note App</h1>
      </header>
      <div id="notes-container"></div>
      <div id="alert-container"></div>
      <div id="loading-indicator" style="display:none;">
        <!-- Loading Indicator -->
      </div>
      <button id="show-active">Tampilkan Catatan Aktif</button>
      <button id="show-archived">Tampilkan Catatan Arsip</button>
    `;
  }

  connectedCallback() {
    indexInstance = this; // Menyimpan instance setelah elemen terpasang

    // Pastikan untuk merender catatan setelah komponen siap
    this.renderNotes(false); // Default tampilkan catatan aktif

    this.shadowRoot.getElementById('show-active')
      .addEventListener('click', () => this.renderNotes(false));
    this.shadowRoot.getElementById('show-archived')
      .addEventListener('click', () => this.renderNotes(true));
  }

  async renderNotes(archived = false) {
    currentArchivedView = archived;

    const notesContainer = this.shadowRoot.getElementById('notes-container');
    notesContainer.innerHTML = '';
    this.showLoading();

    try {
      const notes = await fetchNotes(archived);
      notes.forEach((note) => {
        const noteElement = document.createElement('note-item');
        noteElement.setAttribute('id', note.id);
        noteElement.setAttribute('title', note.title);
        noteElement.setAttribute('body', note.body);
        noteElement.setAttribute('date', new Date(note.createdAt).toLocaleString());
        noteElement.setAttribute('archived', note.archived);
        notesContainer.appendChild(noteElement);
      });
    } catch (err) {
      this.showAlert('Gagal mengambil catatan', 'danger');
    }

    this.hideLoading();
  }

  showAlert(message, type = 'success') {
    const alertContainer = this.shadowRoot.getElementById('alert-container');
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }

  showLoading() {
    this.shadowRoot.getElementById('loading-indicator').style.display = 'block';
  }

  hideLoading() {
    this.shadowRoot.getElementById('loading-indicator').style.display = 'none';
  }
}

if (!customElements.get('note-index')) {
  customElements.define('note-index', Index);
}

document.addEventListener('edit-note', async (event) => {
  const { id, title, body } = event.detail;
  console.log('Received edit-note event', event.detail);  // Log untuk memastikan data yang diterima

  if (!indexInstance) return; // Pastikan indexInstance sudah terinisialisasi

  indexInstance.showLoading();
  try {
    // Perbarui catatan melalui API
    await editNote(id, { title, body });

    // Tampilkan pesan sukses
    indexInstance.showAlert('Catatan berhasil diperbarui');

    // Log untuk memastikan data setelah edit
    console.log('Data yang sudah diperbarui:', { id, title, body });

    // Render ulang catatan setelah update
    await indexInstance.renderNotes(currentArchivedView);

  } catch (err) {
    // Tampilkan pesan error jika gagal
    indexInstance.showAlert('Gagal mengedit catatan', 'danger');
  }

  // Sembunyikan loading setelah selesai
  indexInstance.hideLoading();
});



document.addEventListener('toggle-archive', async (event) => {
  console.log('Received toggle-archive event', event.detail); // Log untuk melihat event detail
  if (!indexInstance) return;
  
  const { id, archived } = event.detail;
  indexInstance.showLoading();
  try {
    if (archived) {
      await unarchiveNote(id);
      indexInstance.showAlert('Catatan dikembalikan ke aktif', 'success');
    } else {
      await archiveNote(id);
      indexInstance.showAlert('Catatan diarsipkan', 'success');
    }

    await indexInstance.renderNotes(currentArchivedView);
  } catch (err) {
    indexInstance.showAlert('Gagal mengarsipkan/mengembalikan catatan', 'danger');
  }
  indexInstance.hideLoading();
});