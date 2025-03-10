class ControlButton extends HTMLElement {
  // Fires when an instance of the element is created or updated
  _controller;
  _signal;
  constructor() {
    super();
    this._controller = new AbortController();
    this._signal = this._controller.signal;
    this.style.setProperty("--pico-form-element-spacing-vertical", "0em");
    this.style.setProperty("--pico-form-element-spacing-horizontal", "0.2em");
  }

  // Fires when an instance was inserted into the document
  connectedCallback() {
    let btn = this.querySelector("button");
    let target = document.getElementById(this.getAttribute("commandfor"));
    let time = this.getAttribute("time");
    if (!btn || !target) return;
    btn.addEventListener(
      "click",
      function () {
        target.currentTime = time;
      },
      { signal: this._signal },
    );
  }

  // Fires when an instance was removed from the document
  disconnectedCallback() {
    this._controller.abort();
  }
}

// Registers custom element
window.customElements.define("control-button", ControlButton);
