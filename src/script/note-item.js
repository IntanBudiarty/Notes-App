class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'body', 'date', 'archived'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    this.render();
    this.setupEventListeners();
  }
  setupEventListeners() {
    const id = this.getAttribute('id');
    const isArchived = this.getAttribute('archived') === 'true';

    // Clean up existing event listeners to avoid duplicates
    const archiveBtn = this.shadowRoot.querySelector('.archive-btn');
    if (archiveBtn) {
      archiveBtn.removeEventListener('click', this.handleArchiveClick);
      archiveBtn.addEventListener('click', this.handleArchiveClick.bind(this));
    }}
   // Update the handleArchiveClick method
  handleArchiveClick() {
    const id = this.getAttribute('id');
    const isArchived = this.getAttribute('archived') === 'true';
    
    console.log('Dispatching archive event:', { 
      id, 
      archived: isArchived,
      newStatus: !isArchived // Add this for debugging
    });
    
    this.dispatchEvent(new CustomEvent('toggle-archive', {
      bubbles: true,
      composed: true,
      detail: { 
        id,
        archived: isArchived // Current status before toggling
      }
    }));
  }

  render() {
    const id = this.getAttribute('id');
    const title = this.getAttribute('title') || 'Untitled';
    const body = this.getAttribute('body') || 'No content';
    const date = this.getAttribute('date') || 'Unknown date';
    const isArchived = this.getAttribute('archived') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 20px;
        }
        
        .note {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-left: 4px solid ${isArchived ? '#ffd43b' : '#4dabf7'};
        }
        
        .note:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .note h3 {
          margin: 0 0 10px 0;
          color: #343a40;
          font-size: 1.25rem;
          word-break: break-word;
        }
        
        .note p {
          margin: 0 0 15px 0;
          color: #495057;
          line-height: 1.5;
          word-break: break-word;
        }
        
        .date {
          display: block;
          color: #868e96;
          font-size: 0.85rem;
          margin-bottom: 15px;
        }
        
        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        button {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .edit-btn {
          background: #f8f9fa;
          color: #495057;
        }
        
        .edit-btn:hover {
          background: #e9ecef;
        }
        
        .delete-btn {
          background: #fff5f5;
          color: #fa5252;
        }
        
        .delete-btn:hover {
          background: #ffe3e3;
        }
        
        .archive-btn {
          background: ${isArchived ? '#fff9db' : '#e6fcf5'};
          color: ${isArchived ? '#f08c00' : '#0ca678'};
        }
        
        .archive-btn:hover {
          background: ${isArchived ? '#fff3bf' : '#c3fae8'};
        }
        
        @media (max-width: 480px) {
          .actions {
            flex-direction: column;
          }
          
          button {
            width: 100%;
          }
        }
      </style>
      
      <div class="note">
        <h3>${title}</h3>
        <p>${body}</p>
        <small class="date">${new Date(date).toLocaleString()}</small>
        <div class="actions">
          <button class="edit-btn" aria-label="Edit note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button class="delete-btn" aria-label="Delete note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Hapus
          </button>
          <button class="archive-btn" aria-label="${isArchived ? 'Unarchive note' : 'Archive note'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="21 8 21 21 3 21 3 8"></polyline>
              <rect x="1" y="3" width="22" height="5"></rect>
              <line x1="10" y1="12" x2="14" y2="12"></line>
            </svg>
            ${isArchived ? 'Batal Arsip' : 'Arsipkan'}
          </button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
      const confirmDelete = confirm('Apakah Anda yakin ingin menghapus catatan ini?');
      if (confirmDelete) {
        this.dispatchEvent(new CustomEvent('delete-note', {
          bubbles: true,
          composed: true,
          detail: { id }
        }));
      }
    });
    
    this.shadowRoot.querySelector('.edit-btn').addEventListener('click', () => {
      const newTitle = prompt('Edit Judul:', title);
      const newBody = prompt('Edit Detail Catatan:', body);
      if (newTitle !== null && newBody !== null) {
        this.dispatchEvent(new CustomEvent('edit-note', {
          bubbles: true,
          composed: true,
          detail: { id, title: newTitle, body: newBody }
        }));
      }
    });

    // In your connectedCallback or setupEventListeners
  this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
    const id = this.getAttribute('id');
    const isArchived = this.getAttribute('archived') === 'true';
    
    console.log(`Attempting to ${isArchived ? 'unarchive' : 'archive'} note:`, id);
    
    this.dispatchEvent(new CustomEvent('toggle-archive', {
      bubbles: true,
      composed: true,
      detail: { 
        id,
        archived: isArchived
      }
    }));
  });
  }
}

if (!customElements.get('note-item')) {
  customElements.define('note-item', NoteItem);
}