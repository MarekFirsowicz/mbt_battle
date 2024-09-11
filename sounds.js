
export const destruction_sound = () => {
    const audio = new Audio()
    audio.src = "./audio/destruction.flac"
    audio.volume = 0.4
    return audio.play()
}
//const el = document.querySelector("#outworld")
export const engine_sound = () => {
    const audio = new Audio()
    audio.src = "./audio/engine_heavy_slow_loop.ogg"
    //const audio = document.querySelector("#engine_sound")
    audio.volume = 0.3
    audio.loop = true
    audio.addEventListener('timeupdate', () => {
        const buffer = 0.3;
        if (audio.currentTime > audio.duration - buffer) {
            audio.currentTime = 0;
            audio.play();
        }
    });

    //return v ? audio.play() : audio.pause()

    return {
        play: () => audio.play(),
        pause: () => audio.pause(),
    }
}


export const cannon_sound = () => {
    const audio = document.querySelector("#hmg_sound")//new Audio()
    //audio.src = "./audio/cannon_fire.ogg"
    audio.volume = 0.6
    return audio.play()
}

export const hmg_sound = () => {
    const audio = new Audio()
    audio.src = "./audio/hmg.mp3"
    audio.volume = 0.2
    return audio.play()
}

export const no_ammo_sound = () => {
    const audio = new Audio()
    audio.src = "./audio/no_ammo.wav"
    audio.volume = 1
    return audio.play()
}




