const osc = require('osc');
const consola = require('consola');

const isProduction = process.env.NODE_ENV == 'production';
consola.level = isProduction? consola.LogLevel.Success : consola.LogLevel.Debug;

const sendPort = 9000;
const recvPort = 9001;
const loopbackIP = "127.0.0.1";

// Create an osc.js UDP Port listening on the recv port.
var udpPort = new osc.UDPPort({
    localAddress: loopbackIP,
    localPort: recvPort,
    metadata: true
});

const state = {
    joystick: {
        activeArea: false,
        activeStylus: false,
    }
}

// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
    try {
        // consola.debug("An OSC message just arrived!", oscMsg);
        // consola.debug("Remote info is: ", info);

        const argValue = oscMsg.args[0].value;

        switch(oscMsg.address){
            case "/avatar/parameters/gamepad_button_a": {
                consola.log('Got Button Press: A', argValue);
                sendButton("/input/Jump", argValue);
                break;
            }
            case "/avatar/parameters/gamepad_button_menul": {
                consola.log('Got Button Press: Menu L', argValue);
                sendButton("/input/QuickMenuToggleLeft", argValue);
                break;
            }
            case "/avatar/parameters/gamepad_click_r": {
                consola.log('Got Button Press: Click R', argValue);
                sendButton("/input/UseRight", argValue);
                // sendAxis("/input/UseAxisRight", argValue?1:0);
                break;
            }
            case "/avatar/parameters/gamepad_joystick_active": {
                consola.log('Got Joystick Area Active', argValue);
                state.joystick.activeArea = !!argValue;
                if(!state.joystick.activeArea || !state.joystick.activeStylus){
                    sendAxis("/input/LookHorizontal", 0);
                    sendAxis("/input/Vertical", 0);
                }
                break;
            }
            case "/avatar/parameters/gamepad_stylus_Angle": {
                const stylusActive = (argValue > 0.1)
                if(stylusActive != state.joystick.activeStylus){
                    state.joystick.activeStylus = stylusActive;
                    consola.log('Got Stylus Active', stylusActive);
                }
                if(!state.joystick.activeArea || !state.joystick.activeStylus){
                    sendAxis("/input/LookHorizontal", 0);
                    sendAxis("/input/Vertical", 0);
                }
                break;
            }
            case "/avatar/parameters/gamepad_joystick_x": {
                if(state.joystick.activeArea && state.joystick.activeStylus){
                    const signedValue = mapScale(argValue, 0, 1, -1, 1);
                    consola.log('Got Joystick X:', signedValue);
                    sendAxis("/input/LookHorizontal", signedValue);
                }else{
                    sendAxis("/input/LookHorizontal", 0);
                }
                break;
            }
            case "/avatar/parameters/gamepad_joystick_y": {
                if(state.joystick.activeArea && state.joystick.activeStylus){
                    const signedValue = mapScale(argValue, 0, 1, -1, 1);
                    consola.log('Got Joystick Y:', signedValue);
                    sendAxis("/input/Vertical", signedValue);
                }else{
                    sendAxis("/input/Vertical", 0);
                }
                break;
            }

        }    
    } catch (error) {
        consola.error('failed to parse incoming message:', error);
    }
});

// When the port is ready to receive messages
udpPort.on("ready", function () {
    consola.success('UDP Port is ready, waiting for messages from VRChat...');

    // DEBUG
    // sendAvatarParam("/avatar/parameters/gamepad_toggle", true);
});

// When an error is sent over the port
udpPort.on("error", function (error) {
    consola.error("A port error occurred: ", error);
});

// Open the socket.
udpPort.open();

function sendButton(address, state){
    return udpPort.send({
        address: address,
        args: [
            {
                type: "i",
                value: state?1:0,
            }
        ]
    }, loopbackIP, sendPort);
}

function sendAxis(address, val){
    return udpPort.send({
        address: address,
        args: [
            {
                type: "f",
                value: clamp(parseFloat(val), -1, 1) || 0,
            }
        ]
    }, loopbackIP, sendPort);
}

function sendAvatarParam(address, value){
    return udpPort.send({
        address: address,
        args: [
            {
                type: getOSCType(value),
                value: value,
            }
        ]
    }, loopbackIP, sendPort);
}

function getOSCType(val){
    if(typeof val == 'boolean'){
        return 'T';
    }
    if(typeof val == 'string'){
        return 's';
    }
    if(Number.isInteger(val)){
        return 'i';
    }
    if(!isNaN(val)){
        return 'f';
    }
    throw new Error(`value unknown type "${val}"`);
}

function mapScale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
};