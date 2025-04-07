export interface PowerConnection {
    fromId: string;
    toId: string;
    power: number;
}
export interface PowerSource {
    id: string;
    type: 'solar' | 'grid' | 'battery';
    name: string;
    power: number;
    x?: number;
    y?: number;
    connections?: PowerConnection[];
}
export interface PowerConsumer {
    id: string;
    name: string;
    power: number;
    x?: number;
    y?: number;
}
export interface PowerFlowConfig {
    sources: PowerSource[];
    consumers: PowerConsumer[];
    animationSpeed: number;
    width?: number;
    height?: number;
    showSourceConnections?: boolean;
}
