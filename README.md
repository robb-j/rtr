# rtr - Regular Task Runner

Running arbitrary code on a regular basis made easy


```js
const Runner = require('reg-task').Runner

// A task that runs every hour
let task = new Runner({ h: 1 }, () => {
  // Complex algorithm goes here ...
})

task.start()
```


## Features
- Runs code at a defined interval
- Any errors are caught and emitted (via [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter))
- Use async/await, because why would you use anything else
- Tasks never run in parallel, the old task must finish
- Simplified scheduling syntax to quickly get a timer going


## Examples

```js
const Runner = require('reg-task').Runner


// Tick Configuration
let daily = { d: 1 }
let everyTenSeconds = { s: 10 }
let everyTwelfthMinute = { m: 12 }
let everyDayAndAHalf = { d: 1, h: 12 }


// Creating a task
let task = new Runner(everyDayAndAHalf, () => {
  // Complex algorithm goes here ...
})


// Start the task
task.start()


// Listen for errors
task.on('error', (e) => {
  console.error('Task Error', e)
})


// Force the task to execute once
task.forceTask()


// Stop the task
task.stop()


```
