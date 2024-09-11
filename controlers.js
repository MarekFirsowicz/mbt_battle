import { tank_cannon, heavy_machine_gun } from "./projectiles.js";
import { no_ammo_sound } from "./sounds.js";

const controler = (controls) => (state, ui_ammo) => {
    const keys = []
    let cooldown_cannon = 0
    let cooldown_hmg = 0

    window.addEventListener('keydown', (e) => {
        const control_key = controls[e.key]
        //wconsole.log(e.key)
        if (keys.indexOf(control_key) === -1 && Object.keys(controls).includes(e.key)) keys.unshift(control_key)
    });

    window.addEventListener('keyup', (e) => {
        const control_key = controls[e.key]
        const index = keys.indexOf(control_key)
        if (index === -1) return
        keys.splice(index, 1)
    })

    const actions = {
        forward: () => { if (state.speed <= state.max_speed) state.speed = Math.round((state.speed + state.speed_increment) * 10) / 10 },
        backward: () => { if (state.speed >= -(state.max_speed / 2)) state.speed = Math.round((state.speed - state.speed_increment) * 10) / 10 },
        left: () => { if (Math.abs(state.speed) >= 0.1) state.vehicle_rotation -= state.rotation_increment },
        right: () => { if (Math.abs(state.speed) >= 0.1) state.vehicle_rotation += state.rotation_increment },
        turret_left: () => state.turret_rotation -= 0.05,
        turret_right: () => state.turret_rotation += 0.05,
        fire_tank_cannon: () => {
            const now = Date.now()
            if (now - cooldown_cannon < 1000) return
            if (state.ammo.cannon <= 0) no_ammo_sound()
            else tank_cannon.shoot({
                x: state.x,
                y: state.y,
                angle: state.turret_rotation + state.vehicle_rotation,
                name: state.name
            })
            if (state.ammo.cannon > 0) {
                state.ammo.cannon--
                ui_ammo(state.ammo)
            }
            cooldown_cannon = now
        },

        fire_hmg: () => {
            const now = Date.now()
            if (now - cooldown_hmg < 100) return
            if (state.ammo.hmg <= 0) no_ammo_sound()
            else heavy_machine_gun.shoot({
                x: state.x,
                y: state.y,
                angle: state.turret_rotation + state.vehicle_rotation,
                name: state.name
            })
            if (state.ammo.hmg > 0) {
                state.ammo.hmg--
                ui_ammo(state.ammo)
            }
            cooldown_hmg = now
        }
    }
    return () => {
        if (keys[0]) actions[keys[0]]()
    }
}

export const wsad = controler({ 'w': 'forward', 's': 'backward', 'a': 'left', 'd': 'right', 'q': 'turret_left', 'e': 'turret_right', 't': 'fire_tank_cannon', 'r': 'fire_hmg' })
export const arrows = controler({ 'ArrowUp': 'forward', 'ArrowDown': 'backward', 'ArrowLeft': 'left', 'ArrowRight': 'right', '7': 'turret_left', '9': 'turret_right', '0': 'fire_tank_cannon', '+': 'fire_hmg' })



const ai_controlls = () => (state) => {

    return () => null
}

export const ai_controller = ai_controlls({})