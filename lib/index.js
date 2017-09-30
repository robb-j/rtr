const EventEmitter = require('events')
const baseTick = { d: 0, h: 0, m: 0, s: 0, ms: 0 }


/**
 * An object that runs a task regularly "Regular Task Runner"
 * @type {[type]}
 */
class Runner extends EventEmitter {
  
  /** The interval of the task (in ms) */
  get interval() {
    return this.tick.ms + 1000 * (this.tick.s + 60 * (this.tick.m + 60 * (this.tick.h + 24 * this.tick.d)))
  }
  
  /** Creates a new Runner */
  constructor(tick, task) {
    super()
    this.tick = Object.assign({}, baseTick, tick)
    this.task = task
    this.inProgress = false
    this.timer = null
  }
  
  /** Starts the runner */
  start() {
    // Make sure we aren't running & then schedule ourself
    this.stop()
    this.timer = setInterval(this.executeTask.bind(this), this.interval)
  }
  
  /** Stops the runner, if it is running */
  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
  
  /** (internal) Executes the task */
  async executeTask() {
    
    // Do nothing if already running
    if (this.inProgress) return
    this.inProgress = true
    
    
    try {
      
      // Wait for the task to execute
      await this.task()
    }
    catch (error) {
      
      // Emit any errors
      this.emit('error', error)
    }
    
    // Release the lock
    this.inProgress = false
  }
  
  /** Force the task to run, if not already running (will not wait for task to execute) */
  forceTask() {
    this.executeTask()
  }
  
}


module.exports.Runner = Runner
