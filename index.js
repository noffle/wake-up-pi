var parseMessy = require('parse-messy-time')
var spawn = require('child_process').spawn

function callbackAtTime (text, cb) {
  var date = new Date(parseMessy(text))

  // 1 minute precision
  var ix = setInterval(function () {
    var now = new Date()
    if (date.getTime() < now.getTime()) {
      clearInterval(ix)
      cb()
    }
  }, 1000 * 60)
}

function OmxController (filename, initialVolume) {
  var process = spawn('omxplayer', ['--vol', initialVolume, filename])

  // initial pause
  process.stdin.write('p')

  this.play = function () {
    process.stdin.write('p')
  }

  this.volumeUp = function () {
    process.stdin.write('+')
  }

  this.volumeDown = function () {
    process.stdin.write('-')
  }

  this.kill = function () {
    process.kill()
  }
}

function omxPlayFadeIn (filename, fadeInDurationMs) {
  var controller = new OmxController(filename, -3000)
  var fadeSteps = 7

  var intervalDuration = fadeInDurationMs / fadeSteps

  var ix = setInterval(function () {
    controller.volumeUp()
  }, intervalDuration)
}
