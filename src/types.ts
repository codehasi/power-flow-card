export interface PowerSource {
  id: string;
  type: 'solar' | 'grid' | 'battery';
  name: string;
  power: number; // Negative values indicate power consumption/charging
  x: number; // Position in percentage (0-100)
  y: number; // Position in percentage (0-100)
}

export interface PowerConsumer {
  id: string;
  name: string;
  power: number; // Power consumption in watts
  x: number; // Position in percentage (0-100)
  y: number; // Position in percentage (0-100)
}

export interface PowerFlowConfig {
  sources: PowerSource[];
  consumers: PowerConsumer[];
  animationSpeed: number; // Base animation speed in seconds
  width?: number; // Optional width in pixels
  height?: number; // Optional height in pixels
}
export interface PowerSource {
  id: string;
  type: 'solar' | 'grid' | 'battery';
  name: string;
  power: number; // Negative values indicate power consumption/charging
  x: number; // Position in percentage (0-100)
  y: number; // Position in percentage (0-100)
}

export interface PowerConsumer {
  id: string;
  name: string;
  power: number; // Power consumption in watts
  x: number; // Position in percentage (0-100)
  y: number; // Position in percentage (0-100)
}

export interface PowerFlowConfig {
  sources: PowerSource[];
  consumers: PowerConsumer[];
  animationSpeed: number; // Base animation speed in seconds
  width?: number; // Optional width in pixels
  height?: number; // Optional height in pixels
}
