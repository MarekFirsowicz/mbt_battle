import { create_polygon } from "./utils.js"
import { damage_update } from "./utils.js"


//create polygon for destructible objects
export function obstacles_creator(layer, cols, size = 64) {
    const obstacle_tiles = [
        { name: 131, hp_max: 10, hp: 10, scale: -0.8, type: 'obstacle' },
        { name: 137, hp_max: 30, hp: 30, scale: -0.65, type: 'obstacle' },
    ]

    const map_obstacles = () => {

        const tiles = layer.map((el, i) => {

            const x = (i % cols) * size
            const y = Math.floor(i / cols) * size
            let tile = { state: { ...obstacle_tiles.find(item => item.name === el), size: size, index: i, x, y } }
            if (el > 0) {
                tile.polygon = () => {
                    const round = tile.state.size * tile.state.scale * damage_update(tile.state.hp, tile.state.hp_max)
                    return create_polygon({
                        x: x + size / 2,
                        y: y + size / 2,
                        width: round,
                        height: round,
                        vehicle_rotation: 0
                    })
                }
                return tile
            }
        }).filter(el => el)
        return tiles
    }

    return map_obstacles()
}
