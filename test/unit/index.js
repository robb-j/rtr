const expect = require('chai').expect
const lib = require('../../lib')

describe('TaskRunner', function() {
  
  describe('#constructor', function() {
    it('should set the tick', async function() {
      
      
      let runner = new lib.Runner({}, () => {
        // Do things ...
      })
      
      expect(runner).to.have.property('tick')
    })
    it('should set the task', async function() {
      let task = () => {}
      let runner = new lib.Runner({}, task)
      expect(runner).to.include({ task })
    })
    it('should set inProgress', async function() {
      let runner = new lib.Runner({}, () => {})
      expect(runner).to.have.property('inProgress', false)
    })
    it('should initialize timer', async function() {
      let runner = new lib.Runner({}, () => {})
      expect(runner).to.have.property('timer', null)
    })
  })
  
  describe('#interval', function() {
    let task = () => {}
    it('should convert milliseconds', async function() {
      let runner = new lib.Runner({ ms: 200 }, task)
      expect(runner.interval).to.equal(200)
    })
    it('should convert seconds', async function() {
      let runner = new lib.Runner({ s: 2 }, task)
      expect(runner.interval).to.equal(2000)
    })
    it('should convert minutes', async function() {
      let runner = new lib.Runner({ m: 2 }, task)
      expect(runner.interval).to.equal(2 * 60 * 1000)
    })
    it('should convert hours', async function() {
      let runner = new lib.Runner({ h: 2 }, task)
      expect(runner.interval).to.equal(2 * 60 * 60 * 1000)
    })
    it('should convert days', async function() {
      let runner = new lib.Runner({ d: 2 }, task)
      expect(runner.interval).to.equal(2 * 24 * 60 * 60 * 1000)
    })
    it('should convert multiple', async function() {
      let runner = new lib.Runner({ s: 4, m: 3, h: 2, d: 1 }, task)
      expect(runner.interval).to.equal(93784000)
    })
  })
  
  describe('#start', function() {
    
    let runner, called, callCount
    
    beforeEach(async function() {
      callCount = 0
      called = false
      runner = new lib.Runner({ ms: 1 }, () => {
        called = true
        callCount++
      })
    })
    
    afterEach(function() {
      if (runner) runner.stop()
    })
    
    it('should store the timer id', async function() {
      runner.start()
      expect(runner.timer).to.not.equal(null)
    })
    it('should start a 1ms timer', async function() {
      runner.start()
      await new Promise((resolve, reject) => { setTimeout(resolve, 5) })
      expect(called).to.equal(true)
    })
    it('should start a 1ms timer', async function() {
      runner.start()
      await new Promise((resolve, reject) => { setTimeout(resolve, 10) })
      expect(callCount).to.be.greaterThan(1)
    })
  })
  
  
  describe('#executeTask', function() {
    let runner, called, callCount
    beforeEach(async function() {
      called = false
      callCount = 0
      runner = new lib.Runner({ s: 1 }, () => {
        called = true
        callCount++
      })
    })
    
    it('should run the task', async function() {
      await runner.executeTask()
      expect(called).to.equal(true)
    })
    it('should skip if already running', async function() {
      runner.executeTask()
      await runner.executeTask()
      expect(callCount).to.equal(1)
    })
    it('should emit any errors', async function() {
      runner = new lib.Runner({ s: 1 }, () => {
        throw new Error('Invalid')
      })
      let eventError = null
      runner.on('error', (e) => { eventError = e })
      await runner.executeTask()
      expect(eventError).to.have.property('message', 'Invalid')
    })
  })
  
  describe('#forceTask', function() {
    it('should trigger execution', async function() {
      let runner = new lib.Runner({ s: 1 }, () => {})
      runner.forceTask()
      expect(runner.inProgress).to.equal(true)
    })
  })
})
