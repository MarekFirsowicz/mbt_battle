import { cr_node, get_node } from "./utils.js"

const div = cr_node('div')
const span = cr_node('span')

export function player_ui(state) {
    const ui_div = get_node(`.player_${state.ui_id}`)
    const ammo_div = ui_div.querySelector('.ammo')

    Object.entries(state.ammo).forEach(el => {
        ammo_div.appendChild(div()(`${el[0]}: `,
            span({ class: `${el[0]}` })(el[1])
        ))
    })

    // update player hp in UI
    const ui_hp = (hp) => {
        ui_div.style.background = `linear-gradient(to right, green ${Math.max((hp / state.max_hp), 0) * 100}%,
            red ${Math.max((hp / state.max_hp), 0) * 100}%,
            red 100%,
            transparent 100%)`
    }

    // update player ammo count in UI
    const ui_ammo = (ammo_obj) => {
        Object.entries(ammo_obj).forEach(el => {
            const span = ammo_div.querySelector(`.${el[0]}`)
            span.innerText = el[1]
        })
    }

    ui_hp(state.hp)

    return {
        hp: (hp) => ui_hp(hp),
        ammo: (ammo_obj) => ui_ammo(ammo_obj),
    }
}