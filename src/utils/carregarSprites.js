//SPRITE DO PLAYER
import jogadorImage from '../assets/sprites/jogador.png';

//SPRITE DOS POWERUPS
import vidaImage from '../assets/sprites/coracao.png';
import slowImage from '../assets/sprites/ampulheta.png';

//SPRITES DE PROJETEIS
import projetil1Image from '../assets/sprites/computador.png';
import projetil2Image from '../assets/sprites/lapis.png';
import projetil3Image from '../assets/sprites/livro.png';

//Sprite dos inimigos
import inimigo1Image from '../assets/sprites/inimigo1.png';
import inimigo2Image from '../assets/sprites/inimigo2.png';
import inimigo3Image from '../assets/sprites/inimigo3.png';
import inimigo4Image from '../assets/sprites/inimigo4.png';
import inimigo5Image from '../assets/sprites/inimigo5.png';
import inimigo6Image from '../assets/sprites/inimigo6.png';

//SPRITE DO BOSS
import bossImage from '../assets/sprites/cartman.png';


export const carregarSprites = () => ({
  projetil1: Object.assign(new Image(), { src: projetil1Image }),
  projetil2: Object.assign(new Image(), { src: projetil2Image }),
  projetil3: Object.assign(new Image(), { src: projetil3Image }),
  vida: Object.assign(new Image(), { src: vidaImage }),
  slow: Object.assign(new Image(), { src: slowImage }),
  player: Object.assign(new Image(), { src: jogadorImage }),
  inimigo1: Object.assign(new Image(), { src: inimigo1Image }),
  inimigo2: Object.assign(new Image(), { src: inimigo2Image }),
  inimigo3: Object.assign(new Image(), { src: inimigo3Image }),
  inimigo4: Object.assign(new Image(), { src: inimigo4Image }),
  inimigo5: Object.assign(new Image(), { src: inimigo5Image }),
  inimigo6: Object.assign(new Image(), { src: inimigo6Image }),
  boss: Object.assign(new Image(), { src: bossImage }),
});