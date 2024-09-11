import { engine_sound } from "./sounds.js"


export const vehicle = (state_update, ...f) => {
    const state = {
        type: 'vehicle',
        speed: 0,
        vehicle_rotation: 0,
        turret_rotation: 0,
        rotation_increment: 0.05,
        ...state_update,
    }
    return {
        state,
        draw: (ctx, obj_state) => f.forEach(i => i(ctx, obj_state)),
    }
}


//scale image to specific size
const image = (path, size) => {
    const img = new Image()
    img.src = path
    const scale = size / Math.max(img.width, img.height)
    return {
        img,
        width: Math.ceil(img.width * scale),
        height: Math.ceil(img.height * scale),
    }
}

const image_id = (id, size) => {
    const img = document.getElementById(id)
    const scale = size / Math.max(img.width, img.height)
    return {
        img,
        width: Math.ceil(img.width * scale),
        height: Math.ceil(img.height * scale),
    }
}


// draw hehicle component - vehicle can have multpiple part like chassis and turret
//turret can have rotation - tank or move with chassis like assault gun
// dimensions ussally will be based on chassis image size. In future turret size might be implemented to create chassis and turret separate damage systems
const draw_vehicle_comp = (comp_img, turret_rotation = false, dimensions = false) => (ctx, state) => {

    if (dimensions) state.width = comp_img.width
    if (dimensions) state.height = comp_img.height
    ctx.save()
    ctx.translate(state.x, state.y)
    //create static or rotatable turret
    ctx.rotate(turret_rotation ? state.vehicle_rotation + state.turret_rotation : state.vehicle_rotation)
    ctx.drawImage(
        comp_img.img,
        - comp_img.width / 2,
        - comp_img.height / 2,
        comp_img.width,
        comp_img.height,
    )
    ctx.restore()
}




const tank_green_img = image_id('tank_green', 64)
const turret_green_img = image_id('turret_green', 64)
const tank_grey_img = image_id('tank_grey', 64)
const turret_grey_img = image_id('turret_grey', 64)
const turret_green_ag_img = image_id('turret_ag', 64)
const tower_base_img = image_id('tower_base', 64)
const tower_turret_img = image_id('tower_hmg', 64)



//initiate components
const green_chassis_tank = draw_vehicle_comp(tank_green_img, false, true)
const green_turret_ag = draw_vehicle_comp(turret_green_ag_img, true)
const grey_chassis_tank = draw_vehicle_comp(tank_grey_img, false, true)
const grey_turret_tank = draw_vehicle_comp(turret_grey_img, true)
const green_turret_tank = draw_vehicle_comp(turret_green_img, true)

const tower_base = draw_vehicle_comp(tower_base_img, false, true)
const tower_hmg = draw_vehicle_comp(tower_turret_img, true)

///create basic vehicle

const tank = () => {
    return {
        engine: engine_sound(),
        hp: 100,
        max_speed: 4,
        speed_increment: 0.2,
        bounce: false,
        ammo: {
            cannon: 40,
            hmg: 1000,
        },
    }
}

const tower = () => {
    return {
        hp: 30,
        max_speed: 0,
        speed_increment: 0,
        bounce: false,
        ammo: {
            hmg: 1000,
        },
    }
}

export const grey_tank = vehicle({ ...tank() }, grey_chassis_tank, grey_turret_tank)
export const green_ag = vehicle({ ...tank() }, green_chassis_tank, green_turret_tank)

export const tower_ai_hmg = vehicle({ ...tower() }, tower_base, tower_hmg)
export const tower_ai_gun = vehicle({ ...tower() }, tower_base, tower_hmg)
//console.log(grey_tank)