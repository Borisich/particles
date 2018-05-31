export default class Particle {
    constructor(initialX, initialY) {
        this.speed = Particle.getRandomNumber(50, 100)

        this.currentDX = 0
        this.currentDY = 0

        this.el = document.createElement('div')
        this.el.style.position = 'absolute'

        //Изменим тип анимации на более простой, это должно помочь с тормозами
        //Так же увеличим время анимации и интервал, через который происходит перемещение объекта.
        // Это в 5 раз сократит количество анимированных перемещений и повысит поизводительность
        this.el.style.transition = 'all 0.5s cubic-bezier(0, 0, 1, 1) 0s'
        this.el.style['border-radius'] = '50%'

        document.body.appendChild(this.el)

        this.setRandomSize()
        //Мы хотим, чтобы частица появлялась там, где мы кликнули
        this.setPosition(initialX - this.getPixels('width')/2, initialY - this.getPixels('height')/2)
        this.el.style.background = Particle.getRandomColor();
        this.startBrownianMotion()
    }

    //Не обязательно хранить этот метод в каждом объекте
    static getRandomNumber(from, to) {
        const rnd = Math.random()
        return parseInt((rnd * (to - from)) + from)
    }

    //И метод получения цвета
    static getRandomColor() {
        const rnd = Math.random()
        const hex = 0x1000000 + rnd * 0xffffff
        const color = hex.toString(16).substr(1, 6)
        return ['#', color].join('')
    }

    getPixels(property) {
        const value = this.el.style[property]
        return parseInt(value)
    }

    setPixels(property, value) {
        this.el.style[property] = [value, 'px'].join('')
    }

    setRandomSize() {
        const side = Particle.getRandomNumber(20, 70)
        this.setPixels('width', side)
        this.setPixels('height', side)
    }

    setPosition(x, y) {
        this.setPixels('left', x)
        this.setPixels('top', y)
    }

    //изменять позицию будем не отступами, а с помощью transform. Это существенно повысит производительность
    setPositionByTransform(dx, dy) {
        this.el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    }

    moveRandomly() {
        const screenWidth = document.documentElement.clientWidth
        const screenHeight = document.documentElement.clientHeight

        //В зависимости от размера экрана частицы будут прыгать на разные расстояния
        const to = parseInt(this.speed / 2) * 1000000 / (screenHeight * screenWidth)
        const from = to * -1

        const elemRect = this.el.getBoundingClientRect()

        let dX = Particle.getRandomNumber(from, to)
        let dY = Particle.getRandomNumber(from, to)

        //Это чтобы частицы не уезжали за границы экрана
        if (dX < 0 && dX + elemRect.left < 0) dX *= -1
        if (dX > 0 && dX + elemRect.right > screenWidth) dX *= -1

        if (dY < 0 && dY + elemRect.top < 0) dY *= -1
        if (dY > 0 && dY + elemRect.bottom > screenHeight) dY *= -1

        this.currentDX += dX;
        this.currentDY += dY;

        this.setPositionByTransform(this.currentDX, this.currentDY)
    }

    startBrownianMotion() {
        //Частицы должны начать двигаться сразу
        this.moveRandomly()
        const timeout = 500
        const interval = setInterval(this.moveRandomly.bind(this), timeout)
    }
}
