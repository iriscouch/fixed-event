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

test('Fix an event', function(t) {
  var o = new EE
  o.fix('something')

  var hits = { 'before':false, 'after':false }
  o.on('something', function() { hits.before = true })
  o.emit('something')
  o.on('something', function() { hits.after = true })

  process.nextTick(function() {
    t.ok(hits.before, 'Subscribing before an event catches it')
    t.ok(hits.after, 'Subscribing after an event catches it')

    t.end()
  })
})

test('fixed() = fix + emit', function(t) {
  var o = new EE

  var hits = 0
  o.fixed('ev', 'one')
  o.on('ev', function() { hits +=  1 })
  o.on('ev', function() { hits += 10 })

  process.nextTick(function() {
    t.equal(hits, 11, 'Both events fired after the fixed() call')
    t.end()
  })
})

test('Existing listeners join the fixed event', function(t) {
  var o = new EE

  var results = {}
  o.on('ev', function(result) { results[result] = true })
  o.emit('ev', 'normal emit')

  o.fixed('ev', 'fixed emit')
  o.on('ev', function(result) { results.after = result })

  process.nextTick(function() {
    t.ok(results['normal emit'], 'The normal listener ran normally')
    t.equal(results.after, 'fixed emit', 'The listener attached after the fix got the event')
    t.ok(results['fixed emit'], 'The normal listener got the fixed response')

    t.end()
  })
})

test('Defaultable fixed event', function(t) {
  var fixed = api.defaults({ 'fixed': 'fixed_ev' })
    , o = new fixed.EventEmitter

  o.emit('normal_ev')
  o.emit('fixed_ev')

  var result = {}
  o.on('normal_ev', function() { result.normal = true })
  o.on('fixed_ev', function() { result.fixed = true })

  process.nextTick(function() {
    t.false(result.normal_ev, 'Normal listener subscribed after emit and did not fire')
    t.ok(result.fixed, 'Fixed listener subscribed after emit and did fire')

    t.end()
  })
})
