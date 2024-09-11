import { damage_update, draw_point } from "./utils.js"
import { obstacles_creator } from "./obstacles.js"

export function init_map() {
    const image = document.getElementById('tileset')
    const cols = 18;
    const rows = 12;
    const tile_size = 64
    const image_tile = 64
    const image_cols = image.width / image_tile

    const layers = [[
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
        94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
    ],
    [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 35, 35, 35, 35, 35, 35, 35, 35, 35, 0, 0, 0,
        35, 35, 35, 35, 35, 35, 35, 0, 0, 0, 0, 0, 0, 0, 35, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 35, 35, 35,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 0, 0, 0, 137, 0,
        0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 137, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    ]

    const collision_layer = obstacles_creator(layers[2], cols)

    const get_tile = (layer, col, row) => layers[layer][row * cols + col]
    const set_tile = (layer, col, row, new_tile) => layers[layer][row * cols + col] = new_tile

    function grid(layer = layers[2], size = cols) {
        return Array.from({ length: Math.ceil(layer.length / size) }, (_, i) =>
            layer.slice(i * size, i * size + size).map(el => el === 0 ? 0 : 1)
        )
    }

    return {
        state: { cols, rows, tile_size, width: cols * tile_size, height: rows * tile_size },
        collision_layer,
        grid,
        //grid for a*

        //draw destructible layer
        draw_collision_layer: (ctx, layer = collision_layer) => {
            layer.forEach((el, i) => {
                const sx = (el.state.name - 1) * image_tile % image.width
                const sy = Math.floor((el.state.name - 1) / image_cols) * image_tile
                ctx.drawImage(
                    image,
                    sx, sy,
                    image_tile,
                    image_tile,
                    el.state.x + (image_tile / 2 - el.state.size * damage_update(el.state.hp, el.state.hp_max) / 2),
                    el.state.y + (image_tile / 2 - el.state.size * damage_update(el.state.hp, el.state.hp_max) / 2),
                    el.state.size * damage_update(el.state.hp, el.state.hp_max),
                    el.state.size * damage_update(el.state.hp, el.state.hp_max),
                )
            })
        },

        //draw base layer
        draw_layer: (layer, ctx) => {
            Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => {
                const tile = get_tile(layer, col, row)
                const sx = (tile - 1) * image_tile % image.width
                const sy = Math.floor((tile - 1) / image_cols) * image_tile
                const dx = col * image_tile + (image_tile / 2 - tile_size / 2)
                const dy = row * image_tile + (image_tile / 2 - tile_size / 2)
                ctx.drawImage(
                    image,
                    sx, sy,
                    image_tile,
                    image_tile,
                    dx, dy,
                    tile_size,
                    tile_size,
                )

                //draw_point(ctx, { x: col * image_tile + image_tile / 2, y: row * image_tile + image_tile / 2 })
                // ctx.strokeRect(
                //     col * image_tile,
                //     row * image_tile,
                //     image_tile,
                //     image_tile,
                // )

            }))

        }
    }
}




