# OSC Hands Gamepad for VRChat

This project is designed to provide an in-game gamepad that you can use with your hands, to provide movement and other controls while using camera-based hand-tracking (ie. quest hand tracking via ALVR or Virtual Desktop).

## Features
- Tank-style (forward, back, turn left, turn right) movement joystick.
- Jump Button
- Toggle Quick Menu
- Toggle gamepad on/off

## Setup

### Server
1. If you don't have it already, download and install [Nodejs](https://nodejs.org/en/download/):
   - For windows I recommend using [nvm](https://github.com/coreybutler/nvm-windows)
   - For Linux I recommend using [n](https://www.npmjs.com/package/n)
   - It should work in any recent version, but it's been built with `v16.17.1 LTS`.
2. Open a terminal in `/server`
3. Run `npm install`
4. Run `npm start` anytime to run the server, (`Ctrl+C` to stop).

### Avatar
1. Open the avatar project you want to add the gamepad to in Unity.
2. Import `/avatar/OSCHandsGamepad.unitypackage` into your project.
3. Drag the `OSCHandsGamepad (Prefab Asset)` into the root of you avatar.
4. Attach the `Gamepad` object to your head:
   1. Select the `Gamepad` object.
   2. Drag your head bone into the slot in the `Sources` section.
   3. Uncheck `Is Active`.
   4. Position the `Gamepad` object where you want it.
   5. Click `Activate` to lock it in.
5. Attach the `Arm L` object to your left arm:
   1. Select the `Arm L` object.
   2. Drag your left elbow (lower arm) bone into the slot in the `Sources` section.
   3. Uncheck `Is Active`.
   4. Position the `Arm L` object to line up with your lower arm.
   5. Click `Activate` to lock it in.
6. Attach the `Finger Stylus` object to your right index finger:
   1. Select the `Finger Stylus` object.
   2. Drag the last bone of your right index finger into the slot in the `Sources` section.
   3. Uncheck `Is Active`.
   4. Position the `Finger Stylus` object to line up with the tip of your right index finger.
   5. Click `Activate` to lock it in.
7. Attach the `Clicker` object to your right hand:
   1. Select the `Clicker` object.
   2. Drag your right hand bone into the slot in the `Sources` section.
   3. Uncheck `Is Active`.
   4. Position the `Clicker` object to line up with the middle of you palm so that your index finger hits it when making a fist.
   5. Click `Activate` to lock it in.
8. Merge or attach the FX animator:
   1. Locate the `Gamepad_FX.controller`.
   2. If your avatar has no FX controller you can just drop this into the slot on your Avatar Descriptor and skip to the next step.
   3. Otherwise, you'll need to merge in the controller and parameters using your favorite method.
      - You can use [Avatars 3.0 Manager](https://github.com/VRLabs/Avatars-3.0-Manager) to help you merge animators.
9. Merge in the avatar Parameters:
   1.  Locate the `gamepad_Parameters.asset`.
   2.  If you avatar doesn't have custom parameters already you can drop in the included Parameters and Menu into your avatar descriptor, and skip this step.
   3.  Otherwise, you'll need to merge the Parameters in the file into your existing Parameters file, copy-pasting each one, and matching the type.
10. Clear your OSC files:
    -  Currently, VRChat does a strange thing where it generates config files for OSC every time that prevents OSC on your avatars from updating to changes you've made.
    -  Every time you make changes to an avatar involving OSC, you'll need to delete some files:
        1.  Navigate to `%userprofile%\appData\LocalLow\VRChat\vrchat\OSC`.
        2.  Delete any folders in there called `\usr_<bunch of random characters>`
        -  Its totally safe to delete these as VRChat will automatically re-generate them the next time you have OSC enabled. 
11. You should now be good to go! Upload your avatar, select it in-game, and make sure OSC is enabled in the radial menu!

## Known Issues

- Driving the OSC gamepad inputs causes the avatar to jump/jitter at regular intervals. I'm not sure exactly what causes this but I suspect some kind of VRChat bug involving the VR controls and gamepad controls conflicting. *(If you have any solutions, let me know!)*
- The `Clicker` does not appear to work currently, the documented `/input/UseRight` OSC command doesn't actually seem to do anything. This means there is no way to click unless your host program (Virtual Desktop) emulates this itself.
- The server is very simple and binds directly to the VRChat OSC ports `9000` and `9001` so it may not work with other OSC apps at the same time.