if (!customElements.get('theme-app')) {
  // Cek apakah sudah ada sebelumnya
  class ThemeApp extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
                <style>
                    button {
                        padding: 5px 10px;
                        cursor: pointer;
                        border: none;
                        background: #333;
                        color: white;
                        border-radius: 3px;
                    }
                </style>
                <button id="toggleBtn">🌙 Mode Gelap</button>
            `;
    }

    connectedCallback() {
      this.shadowRoot
        .querySelector('#toggleBtn')
        .addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');
          this.shadowRoot.querySelector('#toggleBtn').textContent =
            document.body.classList.contains('dark-mode')
              ? '☀ Mode Terang'
              : '🌙 Mode Gelap';
        });
    }
  }

  customElements.define('theme-app', ThemeApp); // Definisikan hanya jika belum ada
}
