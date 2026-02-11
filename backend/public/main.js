const output = document.getElementById("output");

async function runSeed() {
  output.textContent = "Running seed...";
  const res = await fetch("/seed");
  output.textContent = await res.text();
}

async function runCheckout() {
  output.textContent = "Running checkout...";
  const res = await fetch("/checkout");
  output.textContent = await res.text();
}
