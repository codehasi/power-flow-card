export interface PowerConnection {
    fromId: string;
    toId: string;
}
export interface PowerSource {
    id: string;
    type: 'solar' | 'grid' | 'battery';
    name: string;
    entity_id: string;
    x?: number;
    y?: number;
    connections?: PowerConnection[];
}
export interface PowerConsumer {
    id: string;
    name: string;
    entity_id: string;
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
