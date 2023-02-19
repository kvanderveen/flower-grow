let skyAndGround
let flower
let raindrops

function setup() {
  angleMode(DEGREES)
  createCanvas(windowWidth, windowHeight)
  skyAndGround = new SkyAndGround()
  flower = new Flower()
  raindrops = new RainDrops()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  raindrops = new RainDrops()
}

function draw() {
  skyAndGround.drawSkyAndGround()
  flower.drawFlower()
  raindrops.drawRainDrops()
  if (keyIsPressed || touches.length > 1) {
    flower = new Flower()
    raindrops.deactivate()
  }
  if (mouseIsPressed || touches.length === 1) {
    if (raindrops.isRaining || flower.isGrowing) return
    flower.grow()
    raindrops.activate()
  }
}

class SkyAndGround {
  constructor() {
    this.skyColor = '#BDDDF1'
    this.groundColor = '#806043'
  }

  drawSkyAndGround() {
    background(this.skyColor)
    fill(this.groundColor)
    rect(0, height * 0.9, width)
  }
}

class Flower {
  TIME_TO_PAUSE = 3000

  constructor() {
    this.stemColor = 'green'
    this.leafColor = 'green'
    this.petalColor = '#f57feb'
    this.pistilColor = 'yellow'
    this.scale = 0.1
    this.nextScale = 0.1
    noStroke()
  }

  drawFlower() {
    push()
    this._drawStem()
    this._drawPetals()
    this._drawPistil()
    this._drawLeaves()
    pop()
    if (this.scale < this.nextScale) this.scale *= 1.003
  }

  grow() {
    setTimeout(() => {
      this.nextScale = min(this.nextScale * 1.5, 1.3)
    }, this.TIME_TO_PAUSE)
  }

  get isGrowing() {
    return this.scale < this.nextScale
  }

  resetSize() {
    this.scale = 0.1
    this.nextScale = 0.1
  }

  _drawStem() {
    fill(this.stemColor)
    translate(width / 2, height * 0.9)
    translate(0, -height * 0.5 * this.scale)
    rect(-height * 0.005 * this.scale, 0, height * 0.01 * this.scale, height * 0.5 * this.scale)
  }

  _drawPetals() {
    fill(this.petalColor)
    ellipseMode(CORNER)
    rotate(-15)
    for (let i = 0; i < 12; i++) {
      ellipse(
        height * 0.01 * this.scale,
        -height * 0.02 * this.scale,
        height * 0.12 * this.scale,
        height * 0.04 * this.scale
      )
      rotate(30)
    }
    rotate(15)
  }

  _drawPistil() {
    ellipseMode(CENTER)
    fill(this.pistilColor)
    ellipse(0, 0, height * 0.06 * this.scale)
  }

  _drawLeaves() {
    fill(this.stemColor)
    translate(0, height * 0.2 * this.scale)
    rotate(-45)
    rect(0, 0, height * 0.09 * this.scale, height * 0.09 * this.scale, 0, height, 0, height)
    rotate(180)
    rect(0, 0, height * 0.09 * this.scale, height * 0.09 * this.scale, 0, height, 0, height)
  }
}

class RainDrop {
  constructor() {
    this.positionX = random(0, width)
    this.positionY = random(0, height) - height
    this.size = min(height * 0.02, 8)
    this.color = color('darkblue')
    this.color.setAlpha(150)
    this.isRaining = false
    this.rateOfFall = height * (0.01 + random() * 0.01)
  }

  drawRainDrop() {
    if (!this.isRaining) return
    push()
    translate(this.positionX, this.positionY)
    fill(this.color)
    rotate(45)
    rect(0, 0, this.size, this.size, 0, this.size, this.size, this.size)
    pop()
    if (this.positionY > height * 0.95) {
      this.deactivate()
    }
    this.positionY += this.rateOfFall
  }

  deactivate() {
    this.isRaining = false
    this.positionX = random(0, width)
    this.positionY = random(0, height) - height
  }

  activate() {
    this.isRaining = true
  }
}

class RainDrops {
  constructor() {
    this.raindrops = [...Array(200)].map(() => new RainDrop())
  }

  drawRainDrops() {
    this.raindrops.forEach((raindrop) => raindrop.drawRainDrop())
  }

  activate() {
    this.raindrops.forEach((raindrop) => raindrop.activate())
  }

  deactivate() {
    this.raindrops.forEach((raindrop) => raindrop.deactivate())
  }

  get isRaining() {
    return this.raindrops && this.raindrops.some((raindrop) => raindrop.isRaining)
  }
}
