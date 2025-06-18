
export async function carregarFundos() {
  const carregarFundo = (num) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = new URL(`../assets/background/bg${num}.png`, import.meta.url).href;
      img.onload = () => resolve(img);
    });

  const fundos = await Promise.all([3, 1, 2, 4, 5].map(carregarFundo));

  return fundos;
}