declare global {
  interface HTMLElementTagNameMap {
    'dynamic-power-flow-card': DynamicPowerFlowCardElement;
  }
}

import { PowerFlowConfig, PowerSource, PowerConsumer } from './types';
import { icons } from './icons';

class DynamicPowerFlowCardElement extends HTMLElement {
  private config: PowerFlowConfig | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get properties(): Record<string, { type: unknown }> {
    return {
      config: { type: Object },
    };
  }

  set hass(hass: any) {
    // Handle Home Assistant updates if needed
  }

  setConfig(config: PowerFlowConfig): void {
    this.config = config;
    this.render();
  }

  private createSVGElement(tag: string): SVGElement {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  private createFlowLine(x1: number, y1: number, x2: number, y2: number, power: number): SVGElement {
    const line = this.createSVGElement('path');
    const dx = x2 - x1;
    const dy = y2 - y1;
    const curve = Math.min(Math.abs(dx), 100); // Control point offset
    
    // Calculate circle intersection points
    const angle = Math.atan2(dy, dx);
    const radius = 32; // Same as circle radius
    
    // Adjust start and end points to circle edges
    const startX = x1 + radius * Math.cos(angle);
    const startY = y1 + radius * Math.sin(angle);
    const endX = x2 - radius * Math.cos(angle);
    const endY = y2 - radius * Math.sin(angle);
    
    // Create curved path
    const path = `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
    line.setAttribute('d', path);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', power >= 0 ? '#4CAF50' : '#F44336');
    line.setAttribute('stroke-width', '2');
    
    // Add flow animation
    const animationSpeed = this.config?.animationSpeed || 2;
    const actualSpeed = power >= 0 ? animationSpeed : -animationSpeed;
    
    line.innerHTML = `
      <style>
        @keyframes flow-positive {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes flow-negative {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 24; }
        }
      </style>
    `;
    line.style.strokeDasharray = '8,4';
    line.style.animation = `flow-${power >= 0 ? 'positive' : 'negative'} ${Math.abs(actualSpeed)}s linear infinite`;
    
    return line;
  }

  private createIcon(type: string, x: number, y: number, power: number, name: string): SVGElement {
    const group = this.createSVGElement('g');
    group.setAttribute('transform', `translate(${x},${y})`);
    
    // Create background circle
    const circle = this.createSVGElement('circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', '32'); // Increased radius to fit text
    circle.setAttribute('fill', 'var(--ha-card-background, #fff)');
    circle.setAttribute('stroke', 'var(--primary-text-color, #000)');
    circle.setAttribute('stroke-width', '1');
    
    // Create icon
    const icon = this.createSVGElement('path');
    icon.setAttribute('d', icons[type as keyof typeof icons]);
    icon.setAttribute('transform', 'translate(-12, -26)');
    icon.setAttribute('fill', 'var(--primary-text-color, #000)');
    
    // Create label text if provided

    const labelText = this.createSVGElement('text');
    labelText.setAttribute('x', '0');
    labelText.setAttribute('y', '8');
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('class', 'label');
    labelText.textContent = name;
    
    // Create power value text
    const powerText = this.createSVGElement('text');
    powerText.setAttribute('x', '0');
    powerText.setAttribute('y', '22');
    powerText.setAttribute('text-anchor', 'middle');
    powerText.setAttribute('class', 'power-value');
    powerText.textContent = `${Math.abs(power)}W`;
    
    group.appendChild(circle);
    group.appendChild(icon);
    group.appendChild(labelText);
    group.appendChild(powerText);
    return group;
  }

  private render(): void {
    if (!this.shadowRoot || !this.config) return;

    const width = this.config.width || 800;
    const height = this.config.height || 400;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          background: var(--ha-card-background, #fff);
          border-radius: var(--ha-card-border-radius, 4px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0, 0, 0, 0.1));
        }
        svg {
          width: 100%;
          height: auto;
        }
        text {
          font-family: var(--primary-font-family, Roboto);
          fill: var(--primary-text-color, #000);
        }
        .power-value {
          font-size: 10px;
          font-weight: bold;
        }
        .label {
          font-size: 10px;
          opacity: 0.8;
        }
      </style>
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"></svg>
    `;

    const svg = this.shadowRoot.querySelector('svg');
    if (!svg) return;

    // Add home icon in the center
    const homeX = width / 2;
    const homeY = height / 2;
    svg.appendChild(this.createIcon('home', homeX, homeY, 0, 'Home'));

    // Add sources and their connections
    this.config.sources.forEach((source: PowerSource) => {
      const x = (source.x / 100) * width;
      const y = (source.y / 100) * height;
      svg.appendChild(this.createIcon(source.type, x, y, source.power, source.name));
      svg.appendChild(this.createFlowLine(x, y, homeX, homeY, source.power));
    });

    // Add consumers and their connections
    this.config.consumers.forEach((consumer: PowerConsumer) => {
      const x = (consumer.x / 100) * width;
      const y = (consumer.y / 100) * height;
      svg.appendChild(this.createIcon('consumer', x, y, consumer.power, consumer.name));
      svg.appendChild(this.createFlowLine(homeX, homeY, x, y, consumer.power));
    });
  }
}

customElements.define('dynamic-power-flow-card', DynamicPowerFlowCardElement);

export { DynamicPowerFlowCardElement };

