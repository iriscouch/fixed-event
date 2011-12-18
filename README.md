# Once: Execute a function once, but have it call you back whenever you need

Once is a Javascript and Node.js package for a common event-oriented problem:

1. Start a function (*job*). It must run to completion, e.g. initializing a database, or other start-up code.
1. Subscribe to its "done" event. No problem.
1. Later, you have more code for the "done" event. You do *not* want to rerun the code. Rather:
  * If it has not finished yet, just subscribe to its "done" event like normal
  * If it has finished, just execute your callback immediately with the original result

Once is available as an NPM module.

    $ npm install once

## Example

```javascript
var once = require('once')
var initializer = new once.Once

// Add callbacks before the job even starts
initializer.on_done(function(er, result) {
  console.log('Initialization done: ' + result)
})

// Define the job to run.
initializer.job(function(callback) {
  // Do stuff asynchronously. Call back when done.
  setTimeout(finish, 100)
  function finish() {
    callback(null, 'I am ready!')
  }
})

// Add callbacks well after the job has completed.
setTimeout(add_callback_late, 200)
function add_callback_late() {
  // This happens after the job is done, but we don't care.
  initializer.on_done(function(er, result) {
    console.log('Init is done again: ' + result)
  })
}
```

Output

    Initialization done: I am ready!
    Init is done again: I am ready!

## Tests

Follow uses [node-tap][tap]. If you clone this Git repository, tap is included.

    $ ./node_modules/.bin/tap test
    ok test/once.js ................................... 5011/5011
    total ............................................. 5012/5012

    ok

## License

Apache 2.0

[tap]: https://github.com/isaacs/node-tap
