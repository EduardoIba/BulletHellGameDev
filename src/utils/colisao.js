// src/utils/colisao.js

/**
 * Verifica colisão de pixel entre uma imagem de colisão (fundo) e uma área circular.
 * @param {CanvasRenderingContext2D} collisionCtx O contexto 2D do canvas de colisão.
 * @param {number} x X da posição a verificar (centro do objeto).
 * @param {number} y Y da posição a verificar (centro do objeto).
 * @param {number} radius Raio do objeto a verificar.
 * @param {number} canvasWidth Largura do canvas de colisão.
 * @param {number} canvasHeight Altura do canvas de colisão.
 * @returns {boolean} True se houver colisão (pixel não transparente), false caso contrário.
 */
export function verificarColisaoDePixel(collisionCtx, x, y, radius, canvasWidth, canvasHeight) {
    if (!collisionCtx) {
        // console.warn("collisionCtx não fornecido para verificarColisaoDePixel.");
        return false;
    }

    // Calcula a área de onde os pixels serão lidos (uma caixa delimitadora ao redor do círculo)
    const startX = Math.max(0, Math.floor(x - radius));
    const startY = Math.max(0, Math.floor(y - radius));
    const endX = Math.min(canvasWidth, Math.ceil(x + radius));
    const endY = Math.min(canvasHeight, Math.ceil(y + radius));

    // Garante que a área de leitura é válida
    const widthToRead = endX - startX;
    const heightToRead = endY - startY;

    if (widthToRead <= 0 || heightToRead <= 0) {
        return false;
    }

    let imageData;
    try {
        imageData = collisionCtx.getImageData(startX, startY, widthToRead, heightToRead);
    } catch (e) {
        console.error("Erro ao obter imageData. Pode ser um problema de CORS ou canvas não desenhado.", e);
        return false;
    }

    const data = imageData.data;
    const imgWidth = imageData.width;

    // Itera sobre os pixels dentro da caixa delimitadora do objeto
    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3]; // Canal alpha

        if (alpha > 0) { // Se o pixel não for totalmente transparente
            // Opcional: Para uma verificação mais precisa do círculo, verifique se o pixel está dentro do raio
            const pixelLocalX = (i / 4) % imgWidth;
            const pixelLocalY = Math.floor((i / 4) / imgWidth);

            const pixelGlobalX = startX + pixelLocalX;
            const pixelGlobalY = startY + pixelLocalY;

            const distSquared = (pixelGlobalX - x) * (pixelGlobalX - x) + (pixelGlobalY - y) * (pixelGlobalY - y);
            if (distSquared <= radius * radius) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Verifica a colisão de um projétil com o player (mantida a colisão circular).
 * @param {number} pX X do projétil.
 * @param {number} pY Y do projétil.
 * @param {number} pR Raio do projétil.
 * @param {number} playerX X do player.
 * @param {number} playerY Y do player.
 * @param {number} playerHitboxRadius Raio da hitbox do player.
 * @returns {boolean} True se houver colisão, false caso contrário.
 */
export function verificarColisaoDeProjetilComPlayer(pX, pY, pR, playerX, playerY, playerHitboxRadius) {
  const dx = pX - playerX;
  const dy = pY - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (pR + playerHitboxRadius);
}