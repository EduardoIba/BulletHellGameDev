export function atirarProjeteis({ atirador, player, slowAtivo, velocidadeProjeteis, imagens, projectiles }, options = {}) {
    if (!atirador) return;

    const {
        velocidadeMultiplicador = 1,
        width = 32,
        height = 32,
        tipos = ["projetil1", "projetil2", "projetil3"],
    } = options;

    const now = Date.now();
    if (now - atirador.lastShot <= atirador.shootInterval) return;

    atirador.lastShot = now;

    const dx = player.x - atirador.x;
    const dy = player.y - atirador.y;
    const length = Math.hypot(dx, dy);

    const speedProj = slowAtivo
        ? velocidadeProjeteis * 0.5 * velocidadeMultiplicador
        : velocidadeProjeteis * velocidadeMultiplicador;

    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

    projectiles.push({
        x: atirador.x,
        y: atirador.y,
        tipo,
        img: imagens[tipo],
        width,
        height,
        r: Math.min(width, height) / 2,
        rotation: 0,
        xVel: (dx / length) * speedProj,
        yVel: (dy / length) * speedProj,
    });
}