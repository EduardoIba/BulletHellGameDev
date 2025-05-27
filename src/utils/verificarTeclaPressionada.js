import { colidindoComZona } from "./colisao.js";

export function verificarTeclaPressionada(teclas, zonasDeColisao, nextPositions, player, speed) {
    if ((teclas["ArrowUp"] || teclas["w"]) && !colidindoComZona(zonasDeColisao, nextPositions.up.x, nextPositions.up.y)) {
        player.y -= speed;
    }
    if ((teclas["ArrowDown"] || teclas["s"]) && !colidindoComZona(zonasDeColisao, nextPositions.down.x, nextPositions.down.y)) {
        player.y += speed;
    }
    if ((teclas["ArrowLeft"] || teclas["a"]) &&!colidindoComZona(zonasDeColisao, nextPositions.left.x, nextPositions.left.y)) {
        player.x -= speed;
    }
    if ((teclas["ArrowRight"] || teclas["d"]) && !colidindoComZona(zonasDeColisao, nextPositions.right.x, nextPositions.right.y)) {
        player.x += speed;
    }
}