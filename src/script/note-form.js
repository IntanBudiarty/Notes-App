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
    };

    const validateInput = (input, errorElement, minLength, errorMessage) => {
      if (input.value.length < minLength) {
        errorElement.textContent = errorMessage;
      } else {
        errorElement.textContent = '';
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
            <link rel="stylesheet" href="styles.css">
            <form id="note-form">
                <h3>Tambah Catatan</h3>
                <label>
                    <input type="text" id="title" placeholder="Judul" maxlength="20" required>
                    <small id="title-counter">0/20</small>
                    <span id="title-error" class="error"></span>
                </label>
                <label>
                    <textarea id="body" placeholder="Detail Catatan" maxlength="100" required></textarea>
                    <small id="body-counter">0/100</small>
                    <span id="body-error" class="error"></span>
                </label>
                <button type="submit">Simpan</button>
            </form>
        `;
  }
}

if (!customElements.get('note-form')) {
    customElements.define('note-form', NoteForm);
  }
  