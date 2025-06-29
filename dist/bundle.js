(() => {
  class e extends HTMLElement {
    constructor() {
      super(),
        this.attachShadow({ mode: 'open' }),
        (this.shadowRoot.innerHTML =
          '\n        <link rel="stylesheet" href="styles.css">\n        <header>\n            <h1> Note App </h1>\n        </header>\n        ');
    }
  }
  customElements.define('index', e);
})();
