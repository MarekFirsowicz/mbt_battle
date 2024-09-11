import { game } from "./game.js";
import { init_map } from "./map.js";

export let canvas = document.getElementById('canvas1')

window.addEventListener('load', function () {
    const state = {
        start: false,
        pause: false,
        stop: false,
    }
    const map = init_map().state


    let animationFrameId;
    let tank_game
    //canvas

    canvas.width = map.width
    canvas.height = map.height
    canvas.style.display = 'block'
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    //UI elements
    const controls_div = document.getElementById('controls')
    controls_div.style.display = 'flex'
    const start_btn = document.getElementById('start_game')
    const pause_btn = document.getElementById('pause_game')
    const main_image = document.getElementById('main_img')
    controls_div.style.width = `${map.width}px`


    let lastTime = 0
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp
        tank_game.render(ctx, deltaTime)
        animationFrameId = requestAnimationFrame(animate)

    }

    //init game
    function restart_game() {
        lastTime = 0
        animationFrameId = requestAnimationFrame(animate)
        tank_game = game()
    }

    pause_btn.addEventListener('click', (e) => {
        const btn = e.target.parentNode
        state.pause = !state.pause
        if (state.pause) {
            cancelAnimationFrame(animationFrameId)
            tank_game.players.map(el => el.state.engine.pause())
            btn.innerHTML = `<i class="fa-solid fa-circle-play"></i>`
        }
        else {
            requestAnimationFrame(animate)
            btn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`
        }

        //console.log(tank_game.state)
    })



    start_btn.addEventListener('click', () => {
        restart_game()
        main_image.style.display = 'none'
        canvas.style.display = 'block'
        controls_div.style.display = 'flex'


    })

    //pause
    // document.addEventListener('keydown', (e) => {
    //     if (e.key === 'p') s = !s
    //     s ? cancelAnimationFrame(animationFrameId) : requestAnimationFrame(animate)

    // })

    //
    animationFrameId = requestAnimationFrame(animate)
    tank_game = game()
    //

})



