class Quadtree {

  constructor(level, bounds) {
    this.maxObjects = 2
    this.level = level || 0
    this.bounds = bounds
    this.objects = []
    this.nodes = []
  }

  insert(obj) {
    let i = 0
    let index = 0

    if (this.nodes.length !== 0) {
      let index = this.getIndex(obj)
      if (index !== -1) {
        this.nodes[index].insert(obj)
        return
      }
    }

    this.objects.push(obj)

    if (this.objects.length > this.maxObjects) {
      if (this.nodes.length === 0) {
        this.split()
      }

      while (i < this.objects.length) {
        index = this.getIndex(this.objects[i])
        if (index !== -1) {
          this.nodes[index].insert(this.objects.splice(i, 1)[0])
        } else {
          i += 1
        }
      }
    }

  }

  retrieve(obj) {
    let index = this.getIndex(obj)
    let returnObjects = this.objects

    if (this.nodes.length !== 0) {
      if (index !== -1) {
        returnObjects = returnObjects.concat(this.nodes[index].retrieve(obj))
      } else {
        for (let i = 0; i < this.nodes.length; i++) {
          returnObjects = returnObjects.concat(this.nodes[i].retrieve(obj));
        }
      }
    }
    return returnObjects
  }

  getIndex(obj) {
    // Top Left
    if (
      obj.x < this.bounds.x + (this.bounds.width / 2) &&
      obj.x + obj.width < this.bounds.x + (this.bounds.width / 2) &&
      obj.y < this.bounds.y + (this.bounds.height / 2) &&
      obj.y + obj.height < this.bounds.y + (this.bounds.height / 2)
    ) {
      return 0
    }

    // Top Right
    if (
      obj.x > this.bounds.x + (this.bounds.width / 2) &&
      obj.x + obj.width > this.bounds.x + (this.bounds.width / 2) &&
      obj.y < this.bounds.y + (this.bounds.height / 2) &&
      obj.y + obj.height < this.bounds.y + (this.bounds.height / 2)
    ) {
      return 1
    }

    // Bottom Left
    if (
      obj.x < this.bounds.x + (this.bounds.width / 2) &&
      obj.x + obj.width < this.bounds.x + (this.bounds.width / 2) &&
      obj.y > this.bounds.y + (this.bounds.height / 2) &&
      obj.y + obj.height > this.bounds.y + (this.bounds.height / 2)
    ) {
      return 2
    }

    // Bottom Right
    if (
      obj.x > this.bounds.x + (this.bounds.width / 2) &&
      obj.x + obj.width > this.bounds.x + (this.bounds.width / 2) &&
      obj.y > this.bounds.y + (this.bounds.height / 2) &&
      obj.y + obj.height > this.bounds.y + (this.bounds.height / 2)
    ) {
      return 3
    }

    return -1
  }

  split() {
    this.nodes[0] = new Quadtree(this.level + 1, { x: this.bounds.x, y: this.bounds.y, width: this.bounds.width / 2, height: this.bounds.height / 2 });
    this.nodes[1] = new Quadtree(this.level + 1, { x: this.bounds.x + this.bounds.width / 2, y: this.bounds.y, width: this.bounds.width / 2, height: this.bounds.height / 2 });
    this.nodes[2] = new Quadtree(this.level + 1, { x: this.bounds.x, y: this.bounds.y + this.bounds.height / 2, width: this.bounds.width / 2, height: this.bounds.height / 2 });
    this.nodes[3] = new Quadtree(this.level + 1, { x: this.bounds.x + this.bounds.width / 2, y: this.bounds.y + this.bounds.height / 2, width: this.bounds.width / 2, height: this.bounds.height / 2 });
  }

  clear() {
    this.objects = []
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] !== undefined) {
        this.nodes[i].clear()
        this.nodes[i] = undefined
      }
    }
  }

}

let quad = new Quadtree(0, { x: 0, y: 0, width: 640, height: 480 })

quad.insert({ x: 100, y: 100, width: 10, height: 10 })
quad.insert({ x: 130, y: 130, width: 10, height: 10 })
quad.insert({ x: 430, y: 340, width: 10, height: 10 })
quad.insert({ x: 420, y: 345, width: 10, height: 10 })

quad.retrieve({ x: 100, y: 100, width: 10, height: 10 })