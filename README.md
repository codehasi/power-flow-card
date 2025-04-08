# Power Flow Card

A custom card for Home Assistant that visualizes power flow between different sources and consumers.

## Installation

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=codehasi&repository=power-flow-card)

### HACS (Recommended)

1. Make sure you have [HACS](https://hacs.xyz) installed in your Home Assistant instance
2. Add this repository to HACS as a custom repository:
   - Click on HACS in the sidebar
   - Click on the three dots in the top right corner
   - Select "Custom repositories"
   - Add the URL of this repository
   - Select "Lovelace" as the category
3. Click on "+ Explore & Download Repositories" in the bottom right
4. Search for "Power Flow Card"
5. Click Download
6. Restart Home Assistant

### Manual Installation

1. Download `dynamic-power-flow-card.js` from the latest release
2. Copy it to your `config/www` folder
3. Add the following to your `configuration.yaml`:
   ```yaml
   lovelace:
     resources:
       - url: /local/ha-power-flow-card.js
         type: module
   ```
4. Restart Home Assistant

## Usage

Add the card to your dashboard:

```yaml
type: custom:dynamic-power-flow-card
home_entity_id: sensor.home_power
sources:
  - id: solar1
    type: solar
    name: Solar
    entity_id: sensor.solar_power
    connections:
      - toId: battery1
        power: 800
  - id: grid1
    type: grid
    name: Grid
    entity_id: sensor.grid_power
  - id: battery1
    type: battery
    name: Home Battery
    entity_id: sensor.battery_power
consumers:
  - id: house1
    name: House
    entity_id: sensor.house_consumption
  - id: ev1
    name: EV Charger
    entity_id: sensor.ev_charger_power
showSourceConnections: true
animationSpeed: 2
width: 800
height: 400
```

### Entity Requirements

The card expects entities to provide power values in watts. The sign of the value is important:

- **Solar**: Positive values indicate power generation
- **Grid**: Positive values indicate power import (consumption), negative values indicate export (feeding back to grid)
- **Battery**: Positive values indicate discharge (providing power), negative values indicate charging
- **Consumers**: Values should be positive, indicating consumption

### Configuration Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| sources | array | required | List of power sources |
| consumers | array | required | List of power consumers |
| home_entity_id | string | required | Home entity ID for power value |
| width | number | 800 | Width of the card in pixels |
| height | number | 400 | Height of the card in pixels |
| animationSpeed | number | 2 | Speed of the power flow animation (in seconds) |
| showSourceConnections | boolean | false | Show power flow between sources |

#### Source Options

| Name | Type | Description |
|------|------|-------------|
| id | string | Unique identifier for the source |
| type | string | Type of source (solar/grid/battery) |
| name | string | Display name |
| entity_id | string | Home Assistant entity ID providing power value in watts |
| x | number | Optional X position (0-100). If not provided, will be automatically calculated |
| y | number | Optional Y position (0-100). If not provided, will be automatically calculated |
| connections | array | Optional list of connections to other sources |

#### Consumer Options

| Name | Type | Description |
|------|------|-------------|
| id | string | Unique identifier for the consumer |
| name | string | Display name |
| entity_id | string | Home Assistant entity ID providing power consumption in watts |
| x | number | Optional X position (0-100). If not provided, will be automatically calculated |
| y | number | Optional Y position (0-100). If not provided, will be automatically calculated |

#### Source Connection Options

| Name | Type | Description |
|------|------|-------------|
| fromId | string | ID of the source where power flow starts |
| toId | string | ID of the source where power flow ends |
| power | number | Power flow in watts |
