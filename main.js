const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

let text1;
let text2;
let data = [];
let counter = 0;

const game = new Phaser.Game(config);

function create() {
    const url_params = new URL(window.location.href).searchParams
    console.log(`ID: ${url_params.get('PROLIFIC_PID')}, day: ${url_params.get('DAY')}`)
    text1 = this.add.text(10, 10, '', { fill: '#00ff00' })
    text2 = this.add.text(500, 10, `Cross origin isolation: ${window.crossOriginIsolated}\nClick 3x to send data`, { fill: '#ffff00' })
    this.input.on('pointerdown', (ptr) => {
        this.scale.startFullscreen()
    })
    this.input.on('pointermove', (ptr) => {
        if (this.scale.isFullscreen) {
            data.push(ptr.event.timeStamp)
        }
    })

    this.input.on('pointerdown', (ptr) => {
        counter++
        if (counter == 3) {
            console.log(data)
            Promise.resolve(sendData(data)).then(() => {
                // close window here? or tell participant to return to qualtrics
            })
            //window.parent.postMessage(JSON.stringify(data), '*')
        }
    })
}

function update() {
    text1.text = `t: ${performance.now()}`
}

function sendData(data) {
    return fetch("/.netlify/functions/qualtrics", {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data, (k, v) => {
        // reduce number of decimal points for floating point numbers
        return v && v.toFixed ? Number(v.toFixed(3)) : v
      })
    }).
      then(function(response) {
        if (response.status !== 200) {
          console.log('There was an issue: ' + response.status)
        } else {
          console.log('No issues ;)')
        }
        return response
      }).
      catch(function(err) {
        console.log('Fetch err: ', err)
        return 500
      })
  }