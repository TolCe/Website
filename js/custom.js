$(window).on("load", function () {
  // Hide preloader
  $("#preloader").delay(350).fadeOut("slow");

  // Show correct infinity animation based on browser
  if (!/Chrome/.test(navigator.userAgent) || !/Google Inc/.test(navigator.vendor)) {
    document.getElementsByClassName("infinityChrome")[0].style.display = "none";
    document.getElementsByClassName("infinity")[0].style.display = "block";
  }

  // Init WOW animations
  setTimeout(function () {
    new WOW().init();
  }, 0);
});

$(function () {
  // Smooth scroll for anchor links
  $('a[href^="#"]:not([href="#"])').on("click", function (e) {
    var target = $(this);
    $("html, body").stop().animate(
      { scrollTop: $(target.attr("href")).offset().top },
      800,
      "easeInOutQuad"
    );
    e.preventDefault();
  });

  // Set spacer heights from data-height attribute
  var spacers = document.getElementsByClassName("spacer");
  for (var i = 0; i < spacers.length; i++) {
    spacers[i].style.height = spacers[i].getAttribute("data-height") + "px";
  }

  // Scrollspy
  $("body").scrollspy({ target: ".scrollspy" });
});
