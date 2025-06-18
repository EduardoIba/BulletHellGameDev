
export const gerarInimigosPorFase = (nivel, width, height, padding, size) => {
    // Topo
    return [
        {
            x: width * 0.25,
            y: padding,
            size,
            lastShot: 0,
            shootInterval: Math.max(400, 1500 - nivel * 200),
        },
        {
            x: width * 0.75,
            y: padding,
            size,
            lastShot: 0,
            shootInterval: Math.max(400, 1500 - nivel * 200),
        },

        // Base
        {
            x: width * 0.25,
            y: height - padding,
            size,
            lastShot: 0,
            shootInterval: Math.max(400, 1500 - nivel * 200),
        },
        {
            x: width * 0.75,
            y: height - padding,
            size,
            lastShot: 0,
            shootInterval: Math.max(400, 1500 - nivel * 200),
        },

        // Esquerda
        {
            x: padding,
            y: height / 2,
            size,
            lastShot: 0,
            shootInterval: Math.max(400, 1500 - nivel * 200),
        },

        // Direita
        {
            x: width - padding,
            y: height / 2,
            size,
            lastShot: 0,
            shootInterval: Math.max(400, 1500 - nivel * 200),
        },
    ]
};