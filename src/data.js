import { fetchNotes, addNote, deleteNote } from './api.js';

function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alert-container');
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderNotes();

  document.addEventListener('note-added', async (event) => {
    const { title, body } = event.detail;
    showLoading();
    try {
      await addNote({ title, body });
      await renderNotes();
      showAlert('Catatan berhasil ditambahkan', 'success');
    } catch (err) {
      showAlert('Catatan gagal ditambahkan', 'danger');
    }
    hideLoading();
  });

  document.addEventListener('delete-note', async (event) => {
    showLoading();
    try {
      await deleteNote(event.detail.id);
      await renderNotes();
      showAlert('Catatan berhasil dihapus', 'success');
    } catch (err) {
      showAlert('Catatan gagal dihapus', 'danger');
    }
    hideLoading();
  });
});

async function renderNotes() {
  const notesContainer = document.getElementById('notes-container');
  notesContainer.innerHTML = '';
  showLoading();
  try {
    const notes = await fetchNotes();
    notes.forEach((note) => {
      const noteElement = document.createElement('note-item');
      noteElement.setAttribute('id', note.id);
      noteElement.setAttribute('title', note.title);
      noteElement.setAttribute('body', note.body);
      noteElement.setAttribute(
        'date',
        new Date(note.createdAt).toLocaleString()
      );
      notesContainer.appendChild(noteElement);
    });
  } catch (err) {
    showAlert('Gagal memuat catatan', 'danger');
  }
  hideLoading();
}

function showLoading() {
  document.getElementById('loading-indicator').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading-indicator').style.display = 'none';
}
