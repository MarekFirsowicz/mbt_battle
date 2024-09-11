import { init_map } from "./map.js"
import { init_players } from "./player.js"
import { tank_cannon, heavy_machine_gun } from "./projectiles.js";
import { dust, explosion, fire, smoke, destruction } from "./particle.js"

import { draw_polygon } from "./utils.js"

export const game = () => {
    //implement camera in future
    //const camera = camer_cr(map.image, GAME_WIDTH, GAME_HEIGHT)
    const map = init_map()
    //when single player mode developed add choice for 1 or 2 players
    let player_no
    const players = player_no ? init_players().splice(0, player_no) : init_players()

    //reset projectiles and particles arrays to 0 length
    const reset_projectiles = [heavy_machine_gun, tank_cannon].map(el => {
        el.reset()
        return el
    })
    const reset_particles = [dust, explosion, fire, smoke, destruction].map(el => {
        el.reset()
        return el
    })

    const { height, width } = map.state

    //fps
    let event_update = false
    let event_timer = 0
    const event_interval = 1000 / 60

    //filter object that are close enough for collision checks
    const filter_obj = (arr, obj, distance = 70) => arr.filter(
        el => Math.hypot((el.state.x + (el.state.size || 0) / 2) - obj.state.x, (el.state.y + (el.state.size || 0) / 2) - obj.state.y) < distance
    )


    const particles = [...reset_particles]
    const projectiles = [...reset_projectiles]

    return {
        players,
        render: function (ctx, deltaTime) {

            // refactor players and object arrays in future to their modules
            const living_players = players.filter(el => el.state.hp > -30)

            const collision_obj = map.collision_layer.filter(el => el.state.hp > 0)
            if (event_timer < event_interval) {
                event_timer += deltaTime
                event_update = false
            } else {
                event_timer = 0
                event_update = true
            }

            if (event_update) {
                //draw layers
                map.draw_layer(0, ctx)
                map.draw_layer(1, ctx)
                map.draw_collision_layer(ctx)


                living_players.map((player, i) => {
                    const other_players = living_players.filter((_, j) => j !== i)
                    const objects = filter_obj(collision_obj, player)
                    const player_obj = filter_obj([...other_players], player)
                    player.draw(ctx)
                    if (player.state.hp <= 0) {
                        player.damaged()
                    } else {
                        player.update(ctx, width, height, objects, player_obj)
                    }
                })

                particles.map(el => {
                    el.particles.map((particle, i) => {
                        el.update(particle, i)
                        el.draw(ctx, particle)
                    })
                })

                projectiles.map(el => {
                    el.projectiles.map((projectile, i) => {
                        const other_players = [...living_players].filter(player => player.state.name !== projectile.name)
                        const objects = filter_obj([...collision_obj, ...other_players], { state: { x: projectile.x1, y: projectile.y1, size: 0 } })
                        el.draw(ctx, projectile)
                        el.update(projectile, i, objects)
                    })
                })

                //collision_obj.forEach(el => draw_polygon(ctx, el.polygon()))
            }
        },
    }
}






function draw_rect(ctx, node, style = 'yellow') {
    ctx.strokeStyle = style;
    ctx.strokeRect(
        node.x * 64,
        node.y * 64,
        64,
        64,
    )
}

function draw_all(ctx, arr, c) {
    arr.forEach(node => {
        draw_rect(ctx, node, c)
    });
}
