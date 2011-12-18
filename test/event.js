// Once EventEmitter API tests
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var tap = require('tap')
  , test = tap.test
  , util = require('util')
  , assert = require('assert')

var api = require('../api')
  , EE = api.EventEmitter


test('EventEmitter works like normal by default', function(t) {
  var o = new EE

  var hits = { 'before':false, 'after':false }
  o.on('something', function() { hits.before = true })
  o.emit('something')
  o.on('something', function() { hits.after = true })

  process.nextTick(function() {
    t.ok(hits.before, 'Subscribing before an event catches it')
    t.false(hits.after, 'Subscribing after an event does not catch it')

    t.end()
  })
})
