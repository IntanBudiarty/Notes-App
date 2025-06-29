class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();

    const titleInput = this.shadowRoot.querySelector('#title');
    const bodyInput = this.shadowRoot.querySelector('#body');
    const titleCounter = this.shadowRoot.querySelector('#title-counter');
    const bodyCounter = this.shadowRoot.querySelector('#body-counter');
    const titleError = this.shadowRoot.querySelector('#title-error');
    const bodyError = this.shadowRoot.querySelector('#body-error');

    const updateCounter = (input, counter, maxLength) => {
      counter.textContent = `${input.value.length}/${maxLength}`;
      if (input.value.length > maxLength * 0.8) {
        counter.style.color = '#ff6b6b';
      } else {
        counter.style.color = '#666';
      }
    };

    const validateInput = (input, errorElement, minLength, errorMessage) => {
      if (input.value.length < minLength) {
        errorElement.textContent = errorMessage;
        input.style.borderColor = '#ff6b6b';
      } else {
        errorElement.textContent = '';
        input.style.borderColor = '#ddd';
      }
    };

    titleInput.addEventListener('input', () => {
      updateCounter(titleInput, titleCounter, 20);
      validateInput(titleInput, titleError, 3, 'Judul minimal 3 karakter.');
    });

    bodyInput.addEventListener('input', () => {
      updateCounter(bodyInput, bodyCounter, 100);
      validateInput(bodyInput, bodyError, 5, 'Isi catatan minimal 5 karakter.');
    });

    this.shadowRoot
      .querySelector('#note-form')
      .addEventListener('submit', (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        if (title.length >= 3 && body.length >= 5) {
          this.dispatchEvent(
            new CustomEvent('note-added', {
              detail: { title, body },
              bubbles: true,
              composed: true,
            })
          );

          titleInput.value = '';
          bodyInput.value = '';
          updateCounter(titleInput, titleCounter, 20);
          updateCounter(bodyInput, bodyCounter, 100);
        }
      });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        #note-form {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 25px;
          max-width: 500px;
          margin: 0 auto;
        }
        
        #note-form h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 1.5rem;
          text-align: center;
        }
        
        label {
          display: block;
          margin-bottom: 20px;
          position: relative;
        }
        
        input, textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #4dabf7;
          box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.2);
        }
        
        input {
          height: 45px;
        }
        
        textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        small {
          position: absolute;
          right: 10px;
          bottom: 10px;
          font-size: 0.8rem;
          color: #666;
          background: rgba(255, 255, 255, 0.9);
          padding: 2px 5px;
          border-radius: 3px;
        }
        
        .error {
          display: block;
          color: #ff6b6b;
          font-size: 0.85rem;
          margin-top: 5px;
        }
        
        button {
          background: #4dabf7;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
          transition: background 0.3s ease;
          font-weight: 600;
        }
        
        button:hover {
          background: #339af0;
        }
        
        button:active {
          background: #228be6;
        }
        
        ::placeholder {
          color: #adb5bd;
          opacity: 1;
        }
      </style>
      
      <form id="note-form">
        <h3>Tambah Catatan Baru</h3>
        <label>
          <input type="text" id="title" placeholder="Masukkan judul catatan" maxlength="20" required>
          <small id="title-counter">0/20</small>
          <span id="title-error" class="error"></span>
        </label>
        <label>
          <textarea id="body" placeholder="Tulis detail catatan Anda di sini..." maxlength="100" required></textarea>
          <small id="body-counter">0/100</small>
          <span id="body-error" class="error"></span>
        </label>
        <button type="submit">Simpan Catatan</button>
      </form>
    `;
  }
}

if (!customElements.get('note-form')) {
  customElements.define('note-form', NoteForm);
}