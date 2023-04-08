function updateTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var timeString = hours + ":" + minutes;
  document.getElementById("clock").innerHTML = timeString;
}
setInterval(updateTime, 1000);
