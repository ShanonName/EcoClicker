import { animateSprite } from './animations.js';

// Fondo animado
const bgCanvas = document.getElementById('bg');

const SPRITE_WIDTH = 1920;
const SPRITE_HEIGHT = 1080;
const FRAME_COUNT = 3;
const FPS = 5;
const FRAME_DURATION = 1000 / FPS;

const bgImg = new Image();
bgImg.src = bgImgPath;


animateSprite({
    canvas: bgCanvas,
    img: bgImg,
    frameWidth: SPRITE_WIDTH,
    frameHeight: SPRITE_HEIGHT,
    frameCount: FRAME_COUNT,
    gridCols: 3,
    frameDuration: FRAME_DURATION
});

