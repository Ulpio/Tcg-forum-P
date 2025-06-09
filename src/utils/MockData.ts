import { NewsItem, ForumPost } from '../types';

// Dados de notícias exibidos na tela de "News". Em versões anteriores o
// conteúdo estava comentado e o import resultava em "undefined". Para que o
// app funcione sem depender de uma fonte externa, disponibilizamos alguns
// registros básicos.

export const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'Nova expansão de Magic: The Gathering é revelada!',
    category: 'Magic',
    content:
      'A Wizards of the Coast anunciou a coleção "Horizontes Mecânicos", trazendo mais de 250 cartas e novas mecânicas baseadas em artefatos.',
  },
  {
    id: '2',
    title: 'Yu-Gi-Oh! lança booster inédito no Brasil',
    category: 'Yu-Gi-Oh!',
    content:
      'O booster "Força das Sombras" chega com 60 cartas inéditas e reprints importantes para o cenário competitivo latino-americano.',
  },
  {
    id: '3',
    title: 'Pokémon TCG celebra 30 anos com evento global',
    category: 'Pokémon',
    content:
      'A série comemorativa "Festival Brilhante" marca três décadas do jogo com cartas promocionais e torneios especiais ao redor do mundo.',
  },
];


export const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: 'Qual sua carta favorita de Magic?',
    category: 'Magic',
    content: `A minha é, sem dúvidas, a lendária Black Lotus. Além do valor histórico e financeiro, ela representa uma época mágica do TCG, onde o poder das cartas moldava completamente o estilo de jogo. Gosto de pensar em como seria montar um deck atual com ela liberada no formato Modern — seria insano!
      Quero saber de vocês: qual carta marcou sua jornada em Magic? Seja pela arte, pela mecânica, ou pela emoção de uma jogada decisiva. Bora compartilhar essas memórias!`
  },  
  {
    id: 2,
    title: 'Dúvidas sobre regras de Yu-Gi-Oh!',
    category: 'Yu-Gi-Oh!',
    content: `Alguém aqui pode me dar uma luz sobre como funciona a Invocação-Link? Estou voltando a jogar depois de alguns anos e essa mecânica ainda me confunde, principalmente em relação às setas de link e as zonas extras.
      Se puderem explicar com um exemplo prático, ajudaria muito. E claro, se tiverem dicas de decks que aproveitam bem essa mecânica, estou aceitando sugestões! Valeu comunidade!`
  },  
  {
    id: 3,
    title: 'Deck competitivo Pokémon 2025',
    category: 'Pokémon',
    content: `Fala, treinadores! Com o lançamento da coleção Festival Brilhante, muitos decks ganharam um reforço absurdo. Estou montando um deck baseado no novo Charizard EX, e queria sugestões de cartas para dar mais consistência ao setup.
      Vocês estão apostando em decks agressivos de fogo, controle com tipo psíquico, ou algo mais equilibrado? Compartilhem suas ideias, combos e techs que estão funcionando nos torneios locais!`
  },  
];