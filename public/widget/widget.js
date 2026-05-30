class SimpleWidget extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Add header and nav styling, plus the improved header with logo and navigation
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 0;
          border: 2px solid #007acc;
          border-radius: 12px;
          background: var(--foreground);
          color: var(--background);
          font-family: Arial, Helvetica, sans-serif;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10), 0 1.5px 5px rgba(0,0,0,0.07);
          overflow: hidden;
        }
        header {
          background: #007acc;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 62px;
        }
        .logo {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 1px;
          font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
          user-select: none;
          padding: 3px 0;
          margin-right: 24px;
        }
        nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1rem;
          padding: 8px 16px;
          margin: 0 2px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .nav-link.active, .nav-link:focus, .nav-link:hover {
          background: #fff;
          color: #007acc;
          outline: none;
        }
        .widget-content {
          text-align: center;
          padding: 24px 16px 16px 16px;
        }
        .counter {
          font-size: 22px;
          font-weight: bold;
          margin: 18px 0 10px 0;
          color: inherit;
        }
        .nav-button {
          background: var(--background);
          border: 1px solid var(--background);
          color: var(--foreground);
          padding: 10px 24px;
          margin: 5px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .nav-button:hover {
          background: var(--foreground);
          color: var(--background);
        }
        #increment {
          background: #e2e2e2;
          border: 1px solid #bdbdbd;
          color: #333;
          margin-top: 12px;
          font-weight: 500;
          transition: background 0.22s;
        }
        #increment:hover {
          background: #ddd;
        }
      </style>
      <header>
        <div class="logo">My Widget</div>
        <nav>
          <button class="nav-link" data-route="/">Home</button>
          <button class="nav-link" data-route="/cars">Cars</button>
          <button class="nav-link" data-route="/about">About</button>
        </nav>
      </header>
      <div class="widget-content">
        <h3>Welcome!</h3>
        <p>Hello from the <strong>shadow DOM</strong>.</p>
        <div class="counter">Count: <span id="count">0</span></div>
        <button class="nav-button" id="increment">Increment Counter</button>
      </div>
    `;

    this.count = 0;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const shadow = this.shadowRoot;

    // Handle navigation via both nav-link header and legacy buttons (if any)
    shadow.addEventListener('click', (event) => {
      const target = event.target;
      const route = target.getAttribute && target.getAttribute('data-route');
      if (route) {
        event.preventDefault();
        // Dispatch custom event for Next.js router
        window.dispatchEvent(new CustomEvent('widget-navigation', {
          detail: { route }
        }));
        // Visual active feedback (not persisted)
        shadow.querySelectorAll('.nav-link').forEach((btn) => {
          btn.classList.toggle('active', btn.getAttribute('data-route') === route);
        });
      }

      // Handle counter increment
      if (target.id === 'increment') {
        this.count++;
        shadow.getElementById('count').textContent = this.count;

        // Dispatch count change event for React component
        window.dispatchEvent(new CustomEvent('widget-count-change', {
          detail: { count: this.count }
        }));
      }
    });
  }

  connectedCallback() {
    // Optionally, set active nav-link based on location (best guess)
    const shadow = this.shadowRoot;
    if (shadow) {
      const path = window.location.pathname;
      shadow.querySelectorAll('.nav-link').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-route') === path);
      });
    }
    console.log('SimpleWidget connected to DOM');
  }

  disconnectedCallback() {
    console.log('SimpleWidget disconnected from DOM');
  }
}

customElements.define('simple-widget', SimpleWidget);
