
export const gerarBoss = (width, height) => {
  return {
    x: width / 2,
    y: height / 2,
    size: 80,
    lastShot: 0,
    shootInterval: 400, // mais rápido
    vida: 30,           // vida do boss
    velocidade: 2,
  };
};