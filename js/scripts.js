const track = document.querySelector('.carousel-track');
let position = 0;
let speed = 0;
let targetSpeed = 0.3;
let lastTime = null;

function animate(time) {
  if (lastTime !== null) {
    const delta = time - lastTime;
    speed += (targetSpeed - speed) * 0.05;
    position -= speed * delta;

    const halfWidth = track.scrollWidth / 2;
    if (halfWidth > 0 && position <= -halfWidth) {
      position += halfWidth;
    }

    track.style.transform = `translateX(${position}px)`;
  }
  lastTime = time;
  requestAnimationFrame(animate);
}

track.parentElement.addEventListener('mouseenter', () => { targetSpeed = 0; });
track.parentElement.addEventListener('mouseleave', () => { targetSpeed = 0.3; });

const all = [...games, ...games];
track.innerHTML = all.map(game =>
  `<a href="${game.url}" target="_blank"><img src="${game.image}" alt="${game.name}"></a>`
).join('');
track.style.animationDuration = (games.length * 3) + 's';

requestAnimationFrame(animate);
