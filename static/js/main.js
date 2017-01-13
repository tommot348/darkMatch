"use strict";
function Game() {
  let state = {
      v: 0,
      vx: 0,
      vy: 0,
      vr: 0,
      r: 0,
      cursorPos: null,
      targetPos: null
    },
    update = function(state) {
      //state.r += state.vr;
      state.vx = state.v * Math.cos(state.r);
      state.vy = state.v * Math.sin(state.r);

      if (state.cursorPos && state.targetPos) {
        state.targetPos.x += state.vx;
        state.targetPos.y += state.vy;
        let pos = {
          x: state.cursorPos.x - state.targetPos.x,
          y: state.cursorPos.y - state.targetPos.y
        };
        state.r = Math.atan2(pos.y, pos.x);
      }
      return state;
    },
    initKeys = function() {
      const left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);
      left.press = function() {
        state.vr -= 0.1;
      };
      left.release = function() {
        state.vr = 0;
      };
      up.press = function() {
        state.v = 5;
      };
      up.release = function() {
        state.v = 0;
      };
      right.press = function() {
        state.vr += 0.1;
      };
      right.release = function() {
        state.vr = 0;
      };
      down.press = function() {
        state.v = -5;
      };
      down.release = function() {
        state.v = 0;
      };
    },
    initMouse = function() {
      addMouseMoveHandler(((e) => {
        state.cursorPos = e.data.global;
        state.targetPos = {
          x: e.currentTarget.x,
          y: e.currentTarget.y
        };
      }));
    },
    mainLoop = function() {
      requestAnimationFrame(mainLoop);
      state = update(state);
      render(state);
    };
  this.init = function() {
    initKeys();
    let map = makeMap(100, 100);
    let loaded = initGraphics(map);
    loaded.then(() => {
      initMouse();
      mainLoop();
    });
  };
}
var game = new Game();
