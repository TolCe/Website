const track = document.querySelector('.carousel-track');
const all = [...games, ...games];
track.innerHTML = all.map(game =>
  `<a href="${game.url}" target="_blank"><img src="${game.image}" alt="${game.name}"></a>`
).join('');
track.style.animationDuration = (games.length * 3) + 's';
