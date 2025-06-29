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
    }
  
    attributeChangedCallback() {
      this.render();
    }
  
    render() {
      const id = this.getAttribute('id');
      const title = this.getAttribute('title') || 'Untitled';
      const body = this.getAttribute('body') || 'No content';
      const date = this.getAttribute('date') || 'Unknown date';
      const isArchived = this.getAttribute('archived') === 'true';
  
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="note">
          <h3>${title}</h3>
          <p>${body}</p>
          <small class="date">${date}</small>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Hapus</button>
          <button class="archive-btn">
            ${isArchived ? 'Batal Arsip' : 'Arsipkan'}
          </button>
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
        console.log('Edit button clicked');
        const newTitle = prompt('Edit Judul:', title);
        const newBody = prompt('Edit Detail Catatan:', body);
        if (newTitle && newBody) {
          console.log('Dispatching edit-note event');
          this.dispatchEvent(new CustomEvent('edit-note', {
            bubbles: true,
            composed: true,
            detail: { id, title: newTitle, body: newBody }
          }));
        }
      });
  
      this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
        console.log('Archive button clicked');
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
  