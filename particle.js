import { draw_point } from "./utils.js"


export const particle = (obj) => {
    const particles = []
    return {
        particles,
        reset: () => particles.length = 0,
        create_particle: (particle, state) => {
            particles.push({ ...particle, ...obj(state) })
        },

        update: (particle, i) => {
            particle.x -= particle.speed_x// * Math.sin(particle.rotation)
            particle.y -= particle.speed_y// * Math.cos(particle.rotation)
            particle.size *= 0.9
            if (particle.size < 0.7) particles.splice(i, 1)
        },

        draw: (ctx, particle) => {
            draw_point(ctx, {
                x: particle.x + Math.cos(particle.rotation) * particle.distance,
                y: particle.y + Math.sin(particle.rotation) * particle.distance
            }, particle.size, particle.color)
        }
    }
}


export const dust_particle = (state) => {
    return {
        size: Math.random() * 4 + 2,
        speed_x: Math.random() - 0.5,
        speed_y: Math.random() - 0.5,
        color: 'rgba(0 0 0 / 20%)',
        distance: -35,
        ...state,
    }
}

const explosion_particle = (state) => {
    return {
        size: Math.random() * 3 + 3,
        speed_x: Math.random() * 2 - 1,
        speed_y: Math.random() * 2 - 1,
        color: 'yellow',
        distance: 0,
        ...state,
    }
}

const fire_particle = (state) => {
    return {
        size: Math.random() * 3 + 3,
        speed_x: Math.random() * 2 - 1,
        speed_y: Math.random() * 2 - 1,
        color: 'orange',
        distance: 0,
        ...state
    }
}

const smoke_particle = (state) => {

    return {
        size: Math.random() * 4 + 4,
        speed_x: Math.random() * 2 - 1,
        speed_y: Math.random() * 2 - 1,
        color: 'rgba(0 0 0 / 5%)',
        distance: 0,
        ...state
    }
}

const destruction_partilce = (state) => {
    return {
        size: Math.random() * 10 + 5,
        speed_x: Math.random() * 4 - 2,
        speed_y: Math.random() * 4 - 2,
        color: 'red',
        distance: 0,
        color: 'grey',
        ...state
    }
}






export const explosion = particle(explosion_particle)

export const dust = particle(dust_particle)

export const fire = particle(fire_particle)

export const smoke = particle(smoke_particle)

export const destruction = particle(destruction_partilce)

//color: 'rgba(128 128 128 / 50%)',