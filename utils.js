function lerp(A, B, t) {
    return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}


export function create_polygon(state) {
    const distance = Math.hypot(state.width, state.height) / 2
    const angle = Math.atan2(state.height, state.width)
    const anlges = [
        state.vehicle_rotation - angle - Math.PI,
        state.vehicle_rotation + angle + Math.PI,
        state.vehicle_rotation - angle,
        state.vehicle_rotation + angle,
    ]
    const points = anlges.map(el => {
        return {

            y: state.y - distance * Math.sin(el),
            x: state.x - distance * Math.cos(el)
        }
    })
    return points
}

export function draw_polygon(ctx, poly, color = 'yellow') {
    ctx.beginPath()
    ctx.moveTo(poly[0].x, poly[0].y)
    for (let i = 1; i < poly.length; i++) {
        ctx.lineTo(poly[i].x, poly[i].y)
    }

    ctx.lineTo(poly[0].x, poly[0].y)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
    // ctx.beginPath()
    // ctx.arc(poly[0].x, poly[0].y, 10, Math.PI * 2, false)
    // ctx.stroke()
    // ctx.beginPath()
    // ctx.arc(poly[1].x, poly[1].y, 10, Math.PI * 2, false)
    // ctx.stroke()
}

export function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );
            if (touch) {
                return { ...touch, point_offset: touch.offset + i }
            }
        }
    }
    return
}

export function draw_point(ctx, loc, r = 10, color = 'black') {
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.arc(loc.x, loc.y, r, 0, Math.PI * 2)
    ctx.fill()
}

function pipe(...functions) {
    return function (initialValue) {
        return functions.reduce((value, func) => func(value), initialValue);
    };
}

export const normalizeAngle = (angleInRadians) => {
    const TWO_PI = 2 * Math.PI;
    //console.log(angleInRadians % TWO_PI)
    return angleInRadians % TWO_PI;
};

export const angle_degrees = (radians) => radians * (180 / Math.PI);

export function damage_update(hp, hp_max) {
    const step = hp_max * 0.5
    const round_hp = Math.ceil(Math.max(hp, 0) / step)
    const updated_hp = step * round_hp / hp_max
    return updated_hp
}

export function RandomAngle() {
    return Math.random() * 2 * Math.PI;
}

export function multiple_particle(particle, x, y, state = null, multiply = 4, plus = 2) {
    const particle_n = Math.floor(Math.random() * multiply) + plus
    for (let i = 0; i <= particle_n; i++) {
        particle.create_particle({ x, y, rotation: RandomAngle() }, state)
    }
}



//html
const setAttr = (node, props) => {
    for (const key in props) {
        if (typeof props[key] === 'function') {
            node[key] = props[key]
        }
        // else if (key.startsWith('data-')) {
        //     const dataKey = key.substring(5).replace(/-./g, (char) => char[1].toUpperCase());
        //     node.dataset[dataKey] = props[key];}
        else {
            node.setAttribute(key, props[key])
        }
    }
    return node
}

const crHtml = tag => document.createElement(tag)
export const get_node = (node) => document.querySelector(node)
const get_all = (nodes) => document.querySelectorAll(nodes)


export function cr_node(tag) {
    return function (props = {}) {
        return function (...children) {
            const el = crHtml(tag)
            setAttr(el, props)
            children.map(child => {
                if (typeof child === 'string') {
                    el.textContent = child
                }
                else {
                    el.append(child)
                }
            })
            return el
        }
    }
}


export function pixelToGrid(x, y, tileSize) {
    return {
        x: Math.floor(x / tileSize),
        y: Math.floor(y / tileSize)
    };
}

export function gridToPixel(gridX, gridY, tileSize) {
    return {
        x: gridX * tileSize + tileSize / 2,
        y: gridY * tileSize + tileSize / 2
    };
}