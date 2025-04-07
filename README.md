# Power Flow Card

A custom card for Home Assistant that visualizes power flow between different sources and consumers.

## Installation

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
type: custom:ha-power-flow-card
sources:
  - id: solar1
    type: solar
    name: Solar
    power: 2000
    connections:
      - toId: battery1
        power: 800
  - id: grid1
    type: grid
    name: Grid
    power: -1000
  - id: battery1
    type: battery
    name: Home Battery
    power: -800
consumers:
  - id: house1
    name: House
    power: 1000
  - id: ev1
    name: EV Charger
    power: 200
showSourceConnections: true
animationSpeed: 2
width: 800
height: 400
```

### Configuration Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| sources | array | required | List of power sources |
| consumers | array | required | List of power consumers |
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
| power | number | Power in watts (negative for consumption/charging) |
| x | number | Optional X position (0-100). If not provided, will be automatically calculated |
| y | number | Optional Y position (0-100). If not provided, will be automatically calculated |
| connections | array | Optional list of connections to other sources |

#### Consumer Options

| Name | Type | Description |
|------|------|-------------|
| id | string | Unique identifier for the consumer |
| name | string | Display name |
| power | number | Power consumption in watts (always positive) |
| x | number | Optional X position (0-100). If not provided, will be automatically calculated |
| y | number | Optional Y position (0-100). If not provided, will be automatically calculated |

#### Source Connection Options

| Name | Type | Description |
|------|------|-------------|
| fromId | string | ID of the source where power flow starts |
| toId | string | ID of the source where power flow ends |
| power | number | Power flow in watts |
