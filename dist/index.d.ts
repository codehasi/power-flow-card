declare global {
    interface HTMLElementTagNameMap {
        'dynamic-power-flow-card': DynamicPowerFlowCardElement;
    }
}
import { PowerFlowConfig } from './types';
declare class DynamicPowerFlowCardElement extends HTMLElement {
    private config;
    constructor();
    static get properties(): Record<string, {
        type: unknown;
    }>;
    set hass(hass: any);
    setConfig(config: PowerFlowConfig): void;
    private calculateLayout;
    private createSVGElement;
    private createFlowLine;
    private createIcon;
    private findSourceById;
    private midPointX;
    private getPosition;
    private render;
}
export { DynamicPowerFlowCardElement };
