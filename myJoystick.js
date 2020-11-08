
const { ipcRenderer } = require('electron');

const options = {
    zone: document.querySelector('.zone'),
    mode: 'static',
    position: {left: '50%', top: '50%'},
    color: 'red',
};

const manager = nipplejs.create(options);
manager.on('start end', function(evt, data) {
     UpdateStartStop(evt.type);
  }).on('move', function(evt, data) {
    UpdateAngleForce(data.angle.degree,data.force);
  }).on('dir:up plain:up dir:left plain:left dir:down ' +
        'plain:down dir:right plain:right',
        function(evt, data) {
            UpdateDirection(data.direction);
  }
);



function UpdateStartStop(data){
    console.log("UpdateStartStop",data);
    ipcRenderer.send('JoyStartStop', data);
    
}

function UpdateAngleForce(degree,force){
    console.log("UpdateAngleForce",degree,force);
    ipcRenderer.send('JoyAngle', degree);
    ipcRenderer.send('JoyForce', force);
}
function UpdateDirection(direction){
    console.log("UpdateDirection",direction);
    ipcRenderer.send('JoyDirection', direction);
}

