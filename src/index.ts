declare global {
  interface HTMLElementTagNameMap {
    'dynamic-power-flow-card': DynamicPowerFlowCardElement;
  }
}

import { PowerFlowConfig, PowerSource, PowerConsumer } from './types';
import { icons } from './icons';

class DynamicPowerFlowCardElement extends HTMLElement {
  private config: PowerFlowConfig | null = null;
  private _hass: any = null;

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
    this._hass = hass;
    this.render();
  }

  private getPowerValue(entityId: string): number {
    if (!this._hass || !entityId) return 0;
    const stateObj = this._hass.states[entityId];
    if (!stateObj) return 0;
    return Number(stateObj.state) || 0;
  }

  setConfig(config: PowerFlowConfig): void {
    const sources: PowerSource[] = [];
    config.sources.forEach(source => {
      sources.push({...source});
    });
    const consumers: PowerConsumer[] = [];
    config.consumers.forEach(consumer => {
      consumers.push({...consumer});
    });
    this.config = {...config, sources, consumers};
    this.render();
  }

  private calculateLayout(): void {
    if (!this.config) return;

    const edgeMargin = 15; // Margin from edges in percentage
    const iconSize = 12; // Size of icons in percentage of height
    const minSpacing = iconSize * 1.5; // Minimum spacing between icons

    // Calculate positions for sources on the left side
    this.config.sources.forEach((source, index) => {
      if (!source.x || !source.y) {
        const totalSources = this.config!.sources.length;
        // Calculate available space and required spacing
        const availableHeight = 100 - (2 * edgeMargin);
        const totalSpacing = Math.max(
          availableHeight / totalSources,
          minSpacing
        );
        
        source.x = edgeMargin;
        source.y = edgeMargin + (index * totalSpacing) + (totalSpacing / 2);
      }
    });

    // Calculate positions for consumers on the right side
    this.config.consumers.forEach((consumer, index) => {
      if (!consumer.x || !consumer.y) {
        const totalConsumers = this.config!.consumers.length;
        // Calculate available space and required spacing
        const availableHeight = 100 - (2 * edgeMargin);
        const totalSpacing = Math.max(
          availableHeight / totalConsumers,
          minSpacing
        );

        consumer.x = 100 - edgeMargin;
        consumer.y = edgeMargin + (index * totalSpacing) + (totalSpacing / 2);
      }
    });
  }

  private createSVGElement(tag: string): SVGElement {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  private createFlowLine(x1: number, y1: number, x2: number, y2: number, power: number, isSourceConnection = false): SVGElement {
    const line = this.createSVGElement('path');
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Calculate base values
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = 32; // Match the circle radius from createIcon

    let startX, startY, endX, endY;
    let path: string;

    if (isSourceConnection) {
      // For source connections, always start from the left side of circles
      startX = x1 - radius;
      startY = y1;
      endX = x2 - radius;
      endY = y2;

      // Calculate the maximum x-coordinate of all sources to determine safe routing space
      const maxSourceX = Math.max(
        ...this.config!.sources
          .filter(s => s.x !== undefined)
          .map(s => s.x!)
      );
      
      // Calculate curve control points
      const baseOffset = maxSourceX * 1; // 40% of max source x-coordinate for wider curves
      const horizontalOffset = -baseOffset; // Always route to the left for source connections
      
      // Calculate vertical offset based on source positions and distance
      const routeAbove = y1 > y2;
      const verticalOffset = Math.max(
        Math.abs(y2 - y1) * 0.75, // 75% of vertical distance
        distance * 0.4 // At least 40% of direct distance
      );
      
      // Calculate control points for a smooth curve that routes to the left
      const midY = (startY + endY) / 2;
      
      // First segment: move left from start point
      const cp1x = startX + horizontalOffset * 0.8;
      const cp1y = startY;
      
      // Middle segment: curve vertically
      const cp2x = startX + horizontalOffset;
      const cp2y = midY;
      
      // Final segment: move right to end point
      const cp3x = endX + horizontalOffset * 0.8;
      const cp3y = endY;
      
      // Create a smooth curve path
      path = `M ${startX} ${startY} ` +
            `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cp2x} ${cp2y} ` +
            `S ${cp3x} ${cp3y}, ${endX} ${endY}`;
    } else {
      // For regular connections, use normal angle-based connection points
      const angle = Math.atan2(dy, dx);
      startX = x1 + radius * Math.cos(angle);
      startY = y1 + radius * Math.sin(angle);
      endX = x2 - radius * Math.cos(angle);
      endY = y2 - radius * Math.sin(angle);

      // Check if we need to curve the line
      const needsCurve = this.checkForIntersections(startX, startY, endX, endY);
      
      if (needsCurve) {
        // Create curved path with moderate curve
        const controlPointOffset = distance * 0.2;
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        const controlPoint1X = midX - controlPointOffset * Math.sin(angle);
        const controlPoint1Y = midY + controlPointOffset * Math.cos(angle);
        const controlPoint2X = midX + controlPointOffset * Math.sin(angle);
        const controlPoint2Y = midY - controlPointOffset * Math.cos(angle);

        path = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;
      } else {
        // Create straight path
        path = `M ${startX} ${startY} L ${endX} ${endY}`;
      }
    }
    line.setAttribute('d', path);
    line.setAttribute('stroke', power >= 0 ? '#4CAF50' : '#F44336');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('fill', 'none');
    
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

  private checkForIntersections(x1: number, y1: number, x2: number, y2: number): boolean {
    if (!this.config) return false;

    // Simple check: if the line is mostly vertical or horizontal, it likely doesn't need a curve
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const isMainlyHorizontal = dx > dy * 3;
    const isMainlyVertical = dy > dx * 3;

    // If the line is clearly horizontal or vertical, prefer straight lines
    if (isMainlyHorizontal || isMainlyVertical) {
      return false;
    }

    // Check if line passes near any icons
    const margin = 45; // Increased minimum distance from icons
    
    // More accurate line-point distance calculation
    const checkPosition = (x: number, y: number) => {
      // Calculate the distance from point to line segment
      const lineLength = Math.sqrt(dx * dx + dy * dy);
      if (lineLength === 0) return false;
      
      // Calculate distance from point to line using vector math
      const t = Math.max(0, Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (lineLength * lineLength)));
      const projX = x1 + t * (x2 - x1);
      const projY = y1 + t * (y2 - y1);
      
      const distance = Math.sqrt(
        Math.pow((x - projX), 2) + 
        Math.pow((y - projY), 2)
      );
      
      return distance < margin;
    };

    // Check sources
    for (const source of this.config.sources) {
      if (!source.x || !source.y) continue;
      if (checkPosition(source.x, source.y)) return true;
    }

    // Check consumers
    for (const consumer of this.config.consumers) {
      if (!consumer.x || !consumer.y) continue;
      if (checkPosition(consumer.x, consumer.y)) return true;
    }

    return false;
  }

  private createIcon(type: string, x: number, y: number, entityId: string | number, name: string): SVGElement {
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
    const powerValue = typeof entityId === 'string' ? this.getPowerValue(entityId) : entityId;
    powerText.textContent = `${Math.abs(powerValue)}W`;
    
    group.appendChild(circle);
    group.appendChild(icon);
    group.appendChild(labelText);
    group.appendChild(powerText);
    return group;
  }

  private findSourceById(id: string): PowerSource | undefined {
    return this.config?.sources.find(source => source.id === id);
  }

  private midPointX(x1: number, x2: number): number {
    return (x1 + x2) / 2;
  }

  private getPosition(element: { x?: number; y?: number }, width: number, height: number): { x: number; y: number } {
    return {
      x: (element.x! / 100) * width,
      y: (element.y! / 100) * height
    };
  }

  private render(): void {
    if (!this.shadowRoot || !this.config) return;

    // Calculate automatic layout if needed
    this.calculateLayout();

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
        .source-connection {
          stroke-dasharray: 4;
          opacity: 0.7;
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
      const pos = this.getPosition(source, width, height);
      svg.appendChild(this.createIcon(source.type, pos.x, pos.y, source.entity_id, source.name));
      const sourcePower = this.getPowerValue(source.entity_id);
      if (sourcePower !== 0) {
        svg.appendChild(this.createFlowLine(pos.x, pos.y, homeX, homeY, sourcePower));
      }

      // Add source-to-source connections if enabled
      if (this.config?.showSourceConnections && source.connections) {
        source.connections.forEach(conn => {
          const targetSource = this.findSourceById(conn.toId);
          if (targetSource) {
            const targetPos = this.getPosition(targetSource, width, height);
            // Calculate power flow from source to target
            const sourcePower = this.getPowerValue(source.entity_id);
            const targetPower = this.getPowerValue(targetSource.entity_id);
            // If source is generating and target is consuming/charging, use source power
            const powerFlow = sourcePower > 0 && targetPower < 0 ? Math.min(sourcePower, Math.abs(targetPower)) : 0;
            const connectionLine = this.createFlowLine(pos.x, pos.y, targetPos.x, targetPos.y, powerFlow, true);
            connectionLine.classList.add('source-connection');
            svg.appendChild(connectionLine);
          }
        });
      }
    });

    // Add consumers and their connections
    this.config.consumers.forEach((consumer: PowerConsumer) => {
      const pos = this.getPosition(consumer, width, height);
      svg.appendChild(this.createIcon('consumer', pos.x, pos.y, consumer.entity_id, consumer.name));
      const consumerPower = this.getPowerValue(consumer.entity_id);
      if (consumerPower !== 0) {
        svg.appendChild(this.createFlowLine(homeX, homeY, pos.x, pos.y, consumerPower));
      }
    });
  }
}

customElements.define('dynamic-power-flow-card', DynamicPowerFlowCardElement);

export { DynamicPowerFlowCardElement };

