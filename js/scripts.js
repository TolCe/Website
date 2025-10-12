const track = document.querySelector('.carousel-track');
let position = 0;
let speed = 0.3;
let targetSpeed = 0.3;
let lastTime = null;

function animate(time) {
  if (lastTime !== null) {
    const delta = time - lastTime;
    position -= speed * delta;
    track.style.transform = `translateX(${position}px)`;

    speed += (targetSpeed - speed) * 0.1;

    const width = track.scrollWidth / 2;
    if (Math.abs(position) > width) {
      position = 0;
    }
  }
  lastTime = time;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

track.parentElement.addEventListener('mouseenter', () => {
  targetSpeed = 0;
});

track.parentElement.addEventListener('mouseleave', () => {
  targetSpeed = 0.3;
});
