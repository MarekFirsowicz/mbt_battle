import { pixelToGrid, create_polygon, polysIntersect, draw_polygon, draw_point, multiple_particle, normalizeAngle, angle_degrees, gridToPixel } from "./utils.js"
import { grey_tank, green_ag } from "./vehicles.js"
import { wsad, arrows, } from "./controlers.js"
import { dust, explosion, fire, smoke } from "./particle.js"
import { player_ui } from "./player_ui.js"



//function to initiate players
export const init_players = () => [
    player({ name: 'green tank', color: 'green', x: 1100, y: 650, ui_id: 2, vehicle_rotation: -3.14 / 2, }, green_ag, arrows),
    player({ name: 'grey tank', color: 'black', x: 64, y: 650, ui_id: 1, vehicle_rotation: -3.14 / 2, }, grey_tank, wsad),
]

function player(state_update, vehicle, controler) {
    const state = {
        ...vehicle.state,
        ...state_update,
        max_hp: vehicle.state.hp
    }

    //initiate player UI
    const ui = player_ui(state)

    //player controls
    const action = controler(state, ui.ammo)
    //create polygon that around image - having the same size - for collision detection
    const polygon = () => create_polygon(state)

    //check if player collides with canvas borders
    const canvas_collision = (width, height) => {
        let contact = false;
        polygon().forEach((point, i) => {
            if (point.x + state.speed * Math.cos(state.vehicle_rotation) <= 0
                || point.x + state.speed * Math.cos(state.vehicle_rotation) >= width
                || point.y + state.speed * Math.sin(state.vehicle_rotation) <= 0
                || point.y + state.speed * Math.sin(state.vehicle_rotation) >= height
            ) {
                contact = i + 1
            }
        })
        return contact
    }

    //check if player collides with other objectsor another player
    const players_collision = (polys, ctx) => {
        let contact = false
        polys.forEach(el => {
            //draw_point(ctx, { x: el.state.x + el.state.size / 2, y: el.state.y + el.state.size / 2 })
            //draw_point(ctx, { x: state.x + state.size / 2, y: state.y + state.size / 2 })
            const touch = polysIntersect(polygon(), el.polygon())
            if (touch) contact = touch
        })
        return contact
    }

    //bounce player back afte collission detection
    function bounce() {
        if (state.speed > 0.2 && state.bounce) state.speed -= 0.2
        else if (state.speed < -0.2 && state.bounce) state.speed += 0.2
        else {
            state.speed = 0
            state.bounce = false
        }
    }

    function bounce_back(ctx, width, height, other_polygons, other_players) {
        const canvas_contact = canvas_collision(width, height)
        const player_contact = players_collision([...other_polygons, ...other_players], ctx)

        if (state.bounce) {
            bounce()
        } else if (player_contact || canvas_contact) {
            state.bounce = true
            if ((player_contact.point_offset > 1.05 && player_contact.point_offset < 1.5) || (player_contact.point_offset > 3.05 && player_contact.point_offset <= 3.5)) state.vehicle_rotation += 0.1
            if ((player_contact.point_offset > 1.5 && player_contact.point_offset < 1.95) || (player_contact.point_offset < 3.95 && player_contact.point_offset > 3.5)) state.vehicle_rotation -= 0.1
            if (player_contact.point_offset > 3.5 || (player_contact.point_offset >= 0 && player_contact.point_offset < 1.5) || (canvas_contact === 1 || canvas_contact === 2)) {
                state.speed = Math.min(-1, -state.speed / 2)
            }
            else {
                state.speed = Math.max(2, Math.abs(state.speed / 2))
            }
        }
    }

    function play_engine_sound() {
        //const a = state.engine()
        if (Math.abs(state.speed) > 0) {
            state.engine.play()
            dust.create_particle({ x: state.x, y: state.y, rotation: state.vehicle_rotation - 0.4 })
        }
        else state.engine.pause();
    }

    return {
        state,
        ui,
        polygon,

        update: (ctx, width, height, other_polygons, other_players) => {

            play_engine_sound()
            bounce_back(ctx, width, height, other_polygons, other_players)

            //block controlls if player hit obstacles
            !state.bounce && action()

            state.x += state.speed * Math.cos(-state.vehicle_rotation)
            state.y -= state.speed * Math.sin(-state.vehicle_rotation)

        },

        draw: function (ctx) {
            vehicle.draw(ctx, state)
            //draw_polygon(ctx, polygon())
        },

        //set fire and smoke partcile when player destroyed but not blown up
        damaged: () => {
            state.speed = 0
            state.engine.pause()
            multiple_particle(smoke, state.damage.x, state.damage.y)
            multiple_particle(explosion, state.damage.x, state.damage.y)
            multiple_particle(fire, state.damage.x, state.damage.y)
        }
    }
}





