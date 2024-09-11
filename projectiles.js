import { polysIntersect, draw_polygon, multiple_particle } from "./utils.js"
import { explosion, fire, destruction } from "./particle.js"
import { destruction_sound, cannon_sound, hmg_sound } from "./sounds.js"

function projectile(state) {
    const projectiles = []

    const bullet_collision = (polys, bullet, i) => {
        const points = [{
            x: bullet.x,
            y: bullet.y
        },
        {
            x: bullet.x1,
            y: bullet.y1,
        }]

        //set range of bullet
        const range_x = Math.abs(bullet.x - bullet.x1 + state.range * Math.cos(bullet.angle))
        const rang_y = Math.abs(bullet.y - bullet.y1 + state.range * Math.sin(bullet.angle))

        //check if bullet hit any damagable target
        polys.forEach(el => {
            const touch = polysIntersect(points, el.polygon())

            if (touch) {
                //remove bullet when target hit - adjust hp and interface hp
                projectiles.splice(i, 1)
                el.state.hp = Math.max(el.state.hp - bullet.damage, -30)
                el.ui?.hp(el.state.hp)
                //blow up target when hp bellow specific level, add blow up particles and sound
                if ((el.state.type === 'vehicle' && el.state.hp === -30)
                    || (el.state.type === 'obstacle' && el.state.hp <= 0)) {
                    multiple_particle(destruction, touch.x, touch.y, null, 20, 10)
                    multiple_particle(fire, touch.x, touch.y, null, 20, 10)
                    destruction_sound()
                } else if (el.state.type === 'vehicle' && !el.state.damage && el.state.hp <= 0) {
                    //if player get destroyed set coordinates for player.damaged() particles
                    el.state.damage = { x: touch.x, y: touch.y }
                } else {
                    //explosion if bullet hit target
                    multiple_particle(explosion, touch.x, touch.y, null, 10, 4)
                }
            }
        })

        if (range_x > state.range || rang_y > state.range) {
            //remove bullet when out of range and run particle for it
            projectiles.splice(i, 1)
            multiple_particle(explosion, bullet.x1, bullet.y1, null, 10, 4)
        }
    }

    return {
        projectiles,
        reset: () => projectiles.length = 0,
        shoot: (bullet) => {
            projectiles.push({
                ...bullet,
                x1: bullet.x + state.offset * Math.cos(bullet.angle),
                y1: bullet.y + state.offset * Math.sin(bullet.angle),
                damage: state.damage,
            })
            //add sound to projectile when key in controlers.js pressed
            state.sound()
        },

        draw: (ctx, bullet) =>
            // draw bullet
            draw_polygon(ctx, [{
                x: bullet.x1,
                y: bullet.y1
            },
            {
                x: bullet.x1 - state.length * Math.cos(bullet.angle),
                y: bullet.y1 - state.length * Math.sin(bullet.angle),
            }], state.color),

        update: (bullet, i, objects) => {
            bullet.x1 += state.speed * Math.cos(bullet.angle)
            bullet.y1 += state.speed * Math.sin(bullet.angle)
            bullet_collision(objects, bullet, i)
        }
    }
}


export const tank_cannon = projectile({
    offset: 50,
    range: 200,
    damage: 20,
    length: 20,
    speed: 30,
    color: 'yellow',
    sound: cannon_sound,
})

export const heavy_machine_gun = projectile({
    offset: 50,
    range: 170,
    damage: 2,
    length: 8,
    speed: 40,
    color: 'yellow',
    sound: hmg_sound,
})

