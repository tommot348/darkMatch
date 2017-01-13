"use strict";
let graphics = {
  renderer: PIXI.autoDetectRenderer(512, 512),
  sprites: [],
  scene: new PIXI.Container(),
  map: null
};
function initGraphics(map) {
  graphics.map = map;
  function makePlayer(x, y) {
    let player = new Graphics();

    player.beginFill(0xccccff);
    player.lineStyle(8, 0x00ff44, 0.3);
    player.drawCircle(0, 0, 64);
    player.endFill();
    player.beginFill(0, 0);
    player.moveTo(68, 30);
    player.lineStyle(4, 0xff3300);
    player.lineTo(128, 0);
    player.lineTo(68, -30);
    player.endFill();
    player.scale.x = 0.125;
    player.scale.y = 0.125;
    player.position.set(256, 256);
    player.interactive = true;
    return player;
  }


  let loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    result = new Promise((resolve, reject) => {
      function setup(a, b) {
        /*Object.keys(resources).forEach((key) => {
          let length = graphics.sprites.push(new Sprite(resources[key].texture));
          graphics.sprites[length - 1].anchor.set(0.5, 0.5);
          //graphics.scene.addChild(graphics.sprites[length - 1]);
        });*/

        let container = new PIXI.Container(),
          resources = PIXI.loader.resources,
          origin = null;
        for (let i = 0; i < map.length; ++i) {
          for (let j = 0; j < map[i].length; ++j) {
            let sprite = null;
            if (map[i][j]) {
              sprite = new PIXI.Sprite(resources["img/floor.png"].texture);

            } else {
              sprite = new PIXI.Sprite(resources["img/wall.png"].texture);
            }
            sprite.scale.x = 0.25;
            sprite.scale.y = 0.25;
            sprite.position.set(sprite.width * i, sprite.height * j);
            if (map[i][j] === "o") {
              origin = [-(i) * sprite.width, -(j) * sprite.height];
            }
            container.addChild(sprite);
          }
        }
        graphics.scene.addChild(container);
        container.position.set(origin[0] + 256, origin[1] + 256);
        //TODO handle corner cases
        //...

        let length = graphics.sprites.push(makePlayer());
        graphics.scene.addChild(graphics.sprites[length - 1]);
        graphics.sprites.push(container);
        resolve();
      }


      //load stuff
      loader.add(["img/floor.png", "img/wall.png"]).load(setup);
    });


  //add canvas
  document.getElementById("canvas").appendChild(graphics.renderer.view);
  return result;
}
function addMouseMoveHandler(handler) {
  graphics.sprites[0].on("mousemove", handler);
}
function addMouseDownHandler(handler) {
  graphics.sprites[0].on("mousedown", handler);
}
function addMouseUpHandler(handler) {
  graphics.sprites[0].on("mouseup", handler);
}
function render(state) {
  if (graphics.sprites[0]) {
    let [oldx0, oldy0] = [graphics.sprites[0].x, graphics.sprites[0].y],
      [oldx1, oldy1] = [graphics.sprites[1].x, graphics.sprites[1].y],
      [newx0, newy0] = [graphics.sprites[0].x, graphics.sprites[0].y],
      [newx1, newy1] = [graphics.sprites[1].x, graphics.sprites[1].y];
    graphics.sprites[0].rotation = state.r;
    if (oldx0 != 256) {
      if (oldx0 > 256 && oldx0 + state.vx < 256) {
        newx0 = 256;
      } else {
        if (oldx0 < 256 && oldx0 + state.vx > 256) {
          newx0 = 256;
        } else {
          newx0 += state.vx;
          if (newx0 > 512 - graphics.sprites[0].width / 2) {
            newx0 = 512 - graphics.sprites[0].width / 2;
          }
          if (newx0 < graphics.sprites[0].width / 2) {
            newx0 = graphics.sprites[0].width / 2;
          }
        }
      }
    } else {
      if ((oldx1 - state.vx) <= 0) {
        if (oldx1 + graphics.sprites[1].width - state.vx > 512) {
          newx1 -= state.vx;
        } else {
          newx0 += state.vx;
        }
      } else {
        newx0 += state.vx;
      }
    }
    if (oldy0 != 256) {
      if (oldy0 > 256 && oldy0 + state.vy < 256) {
        newy0 = 256;
      } else {
        if (oldy0 < 256 && oldy0 + state.vy > 256) {
          newy0 = 256;
        } else {
          newy0 += state.vy;
          if (newy0 > 512 - graphics.sprites[0].height / 2) {
            newy0 = 512 - graphics.sprites[0].height / 2;
          }
          if (newy0 < graphics.sprites[0].height / 2) {
            newy0 = graphics.sprites[0].height / 2;
          }
        }
      }
    } else {
      if ((oldy1 - state.vy) <= 0) {
        if (oldy1 + graphics.sprites[1].height - state.vy > 512) {
          newy1 -= state.vy;
        } else {
          newy0 += state.vy;
        }
      } else {
        newy0 += state.vy;
      }
    }

    let [x, y] = [Math.floor((Math.abs(newx1) + newx0) / 32), Math.floor((Math.abs(newy1) + newy0) / 32)];

    let a11 = graphics.map[x - 1] ? graphics.map[x - 1][y - 1] : undefined,
      a21 = graphics.map[x][y - 1],
      a31 = graphics.map[x + 1] ? graphics.map[x + 1][y - 1] : undefined,
      a12 = graphics.map[x - 1] ? graphics.map[x - 1][y] : undefined,
      a22 = graphics.map[x][y],
      a32 = graphics.map[x + 1] ? graphics.map[x + 1][y] : undefined,
      a13 = graphics.map[x - 1] ? graphics.map[x - 1][y + 1] : undefined,
      a23 = graphics.map[x][y + 1],
      a33 = graphics.map[x + 1] ? graphics.map[x + 1][y + 1] : undefined;
    let matrix = "" + a11 + a21 + a31 + "<br>" + a12 + a22 + a32 + "<br>" + a13 + a23 + a33;

    if (graphics.map[x][y] !== undefined) {
      graphics.sprites[0].x = newx0;
      graphics.sprites[0].y = newy0;
      graphics.sprites[1].x = newx1;
      graphics.sprites[1].y = newy1;
    }
    document.getElementById("log").innerHTML = matrix;

  }
  graphics.renderer.render(graphics.scene);
}
