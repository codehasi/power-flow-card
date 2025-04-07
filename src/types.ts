export interface PowerConnection {
  fromId: string;
  toId: string;
  power: number; // Power flow in watts
}

export interface PowerSource {
  id: string;
  type: 'solar' | 'grid' | 'battery';
  name: string;
  power: number; // Negative values indicate power consumption/charging
  x?: number; // Optional position in percentage (0-100)
  y?: number; // Optional position in percentage (0-100)
  connections?: PowerConnection[]; // Optional connections to other sources
}

export interface PowerConsumer {
  id: string;
  name: string;
  power: number; // Power consumption in watts
  x?: number; // Optional position in percentage (0-100)
  y?: number; // Optional position in percentage (0-100)
}

export interface PowerFlowConfig {
  sources: PowerSource[];
  consumers: PowerConsumer[];
  animationSpeed: number; // Base animation speed in seconds
  width?: number; // Optional width in pixels
  height?: number; // Optional height in pixels
  showSourceConnections?: boolean; // Whether to show connections between sources
}
