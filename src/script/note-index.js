import { fetchNotes, addNote, deleteNote, editNote, toggleNoteArchive } from '../api.js';

class NoteIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentArchivedView = false;
    this.render();
    this.initEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .filter-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .filter-button {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-button.active {
          background-color: #4dabf7;
          color: white;
        }
        
        .filter-button:not(.active) {
          background-color: #f1f3f5;
          color: #495057;
        }
        
        #notes-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        #loading-indicator {
          text-align: center;
          padding: 20px;
          display: none;
        }
        
        #alert-container {
          margin: 20px 0;
        }
        
        .alert {
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        
        .alert-success {
          background-color: #d3f9d8;
          color: #2b8a3e;
        }
        
        .alert-danger {
          background-color: #ffe3e3;
          color: #c92a2a;
        }
      </style>
      
      <header>
        <h1>Note App</h1>
      </header>
      
      <div class="filter-buttons">
        <button id="show-active" class="filter-button active">Catatan Aktif</button>
        <button id="show-archived" class="filter-button">Catatan Arsip</button>
      </div>
      
      <div id="alert-container"></div>
      <div id="notes-container"></div>
      <div id="loading-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        Memuat...
      </div>
    `;
  }
  async handleToggleArchive(event) {
    const { id, archived } = event.detail;
    this.showLoading();
    try {
      // Gunakan !archived karena kita ingin toggle status
      await toggleNoteArchive(id, !archived);
      this.showAlert(
        archived ? 'Catatan dikembalikan ke aktif' : 'Catatan diarsipkan', 
        'success'
      );
      await this.loadNotes();
    } catch (error) {
      console.error('Archive error:', error);
      this.showAlert(
        `Gagal ${archived ? 'mengembalikan' : 'mengarsipkan'} catatan`, 
        'danger'
      );
    }
    this.hideLoading();
  }
  async connectedCallback() {
    await this.loadNotes();
    this.setupEventListeners();
  }

  async loadNotes() {
    this.showLoading();
    try {
      const notes = await fetchNotes(this.currentArchivedView);
      this.renderNotes(notes);
    } catch (error) {
      this.showAlert('Gagal memuat catatan', 'danger');
    }
    this.hideLoading();
  }

  renderNotes(notes) {
    const notesContainer = this.shadowRoot.getElementById('notes-container');
    notesContainer.innerHTML = '';
    
    notes.forEach(note => {
      const noteElement = document.createElement('note-item');
      noteElement.setAttribute('id', note.id);
      noteElement.setAttribute('title', note.title);
      noteElement.setAttribute('body', note.body);
      noteElement.setAttribute('date', new Date(note.createdAt).toLocaleString());
      noteElement.setAttribute('archived', note.archived);
      notesContainer.appendChild(noteElement);
    });
  }

  setupEventListeners() {
    // Filter buttons
    this.shadowRoot.getElementById('show-active').addEventListener('click', () => {
      this.currentArchivedView = false;
      this.updateFilterButtons();
      this.loadNotes();
    });

    this.shadowRoot.getElementById('show-archived').addEventListener('click', () => {
      this.currentArchivedView = true;
      this.updateFilterButtons();
      this.loadNotes();
    });

    // Custom events
    document.addEventListener('edit-note', this.handleEditNote.bind(this));
    document.addEventListener('delete-note', this.handleDeleteNote.bind(this));
    document.addEventListener('toggle-archive', this.handleToggleArchive.bind(this));
  }

  updateFilterButtons() {
    const activeBtn = this.shadowRoot.getElementById('show-active');
    const archiveBtn = this.shadowRoot.getElementById('show-archived');
    
    if (this.currentArchivedView) {
      activeBtn.classList.remove('active');
      archiveBtn.classList.add('active');
    } else {
      activeBtn.classList.add('active');
      archiveBtn.classList.remove('active');
    }
  }

  async handleEditNote(event) {
    const { id, title, body } = event.detail;
    this.showLoading();
    try {
      await editNote(id, { title, body });
      this.showAlert('Catatan berhasil diperbarui', 'success');
      await this.loadNotes();
    } catch (error) {
      this.showAlert('Gagal mengedit catatan', 'danger');
    }
    this.hideLoading();
  }

  async handleDeleteNote(event) {
    const { id } = event.detail;
    const confirmDelete = confirm('Apakah Anda yakin ingin menghapus catatan ini?');
    if (!confirmDelete) return;

    this.showLoading();
    try {
      await deleteNote(id);
      this.showAlert('Catatan berhasil dihapus', 'success');
      await this.loadNotes();
    } catch (error) {
      this.showAlert('Gagal menghapus catatan', 'danger');
    }
    this.hideLoading();
  }

 
  showAlert(message, type = 'success') {
    const alertContainer = this.shadowRoot.getElementById('alert-container');
    alertContainer.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
    
    // Auto-hide alert after 3 seconds
    setTimeout(() => {
      alertContainer.innerHTML = '';
    }, 3000);
  }

  showLoading() {
    this.shadowRoot.getElementById('loading-indicator').style.display = 'block';
    const spinSvg = this.shadowRoot.querySelector('.spin');
    spinSvg.style.animation = 'spin 1s linear infinite';
  }

  hideLoading() {
    this.shadowRoot.getElementById('loading-indicator').style.display = 'none';
  }
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

if (!customElements.get('note-index')) {
  customElements.define('note-index', NoteIndex);
}