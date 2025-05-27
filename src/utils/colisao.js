export function verificarColisao(rectA, rectB) {
    return (
        rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y
    );
}

// Atualiza zonas de colisão com base no nível e zonas pré-definidas
export function atualizarZonasDeColisao(nivel, zonasPorFase) {
    return zonasPorFase[nivel] || [];
}

export function colidindoComZona(zonasDeColisao, x, y) {
    const playerBox = {
        x: x - 20,
        y: y - 20,
        width: 40,
        height: 40,
    };
    return zonasDeColisao.some((zona) => verificarColisao(playerBox, zona));
}

export function verificarColisaoDeProjetil(x1, y1, r1, x2, y2, r2) {
      const dx = x1 - x2;
      const dy = y1 - y2;
      const distance = Math.hypot(dx, dy);
      return distance < r1 + r2;
    }