// Audio =============================================================
class AudioHelper {
    constructor() {
        throw new Error('This is a static class.');
    }

    static init() {
        this.resources = {};
        this.loadSounds();
    }

    static loadSounds(options = {loop: false, volume: 0.5},
                      callback = () => {
                      }) {
        let count = this.list.length;

        function canplay() {
            if (--count === 0) callback(this.resources);
        }

        for (let name of this.list) {
            this.resources[name] = document.createElement('audio');
            this.resources[name].addEventListener('canplay', canplay, false);
            this.resources[name].src = "sounds/" + name + ".ogg";
            this.resources[name].loop = options.loop;
            this.resources[name].volume = options.volume;
        }
    }

    static play(name) {
        this.resources[name].play();
    }

    static playRandom() {
        this.play(this.list[Random.int(3)]);
    }
}

AudioHelper.list = ['Thunder1', 'Thunder2', 'Thunder3'];
AudioHelper.init();

class Utils {
    constructor() {
        throw new Error('This is a static class.');
    }

    static css2hex(css) {
        return parseInt(css.substring(1), 16);
    }
}

function throwError() {
    throw new Error('Missing parameter');
}