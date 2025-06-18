export function drawImage(ctx, img, x, y, width, height, rotation = 0) {
  if (!img.complete) return; // garante que a imagem carregou
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.drawImage(img, -width / 2, -height / 2, width, height);
  ctx.restore();
}