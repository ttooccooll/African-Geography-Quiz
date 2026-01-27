window.signInWithLightningAddress = function () {
  window.lightningInvoice = prompt(
    "Enter a Lightning invoice (payment request) from the student to receive rewards:",
  );
  if (!window.lightningInvoice) {
    alert("You need a Lightning invoice to receive rewards!");
  } else {
    alert("Great! WebLN or QR code will be used to pay this invoice.");
  }
};

window.showQR = function (invoice, sats) {
  const qrContainer = document.getElementById("paymentQR");
  qrContainer.innerHTML = `
    <p>Scan to receive <strong>${sats} sats</strong></p>
    <canvas id="qrCanvas"></canvas>
  `;

  const canvas = document.getElementById("qrCanvas");

  QRCode.toCanvas(canvas, invoice, { width: 220 }, (err) => {
    if (err) console.error("QR error:", err);
  });

  qrContainer.classList.remove("hidden");
};

window.payForScore = async function (sats) {
  const qrContainer = document.getElementById("paymentQR");
  console.log("Paying sats:", sats);
  console.log("Invoice:", window.lightningInvoice);
  console.log("WebLN available:", !!window.webln);

  if (!window.lightningInvoice) {
    window.signInWithLightningAddress();
  }

  if (!window.lightningInvoice) {
    qrContainer.innerHTML = `<p>No Lightning invoice entered. Cannot pay ${sats} sats.</p>`;
    qrContainer.classList.remove("hidden");
    return;
  }

  if (sats <= 0) {
    qrContainer.innerHTML = `<p>Score is 0. No payment due.</p>`;
    qrContainer.classList.remove("hidden");
    return;
  }

  try {
    if (window.webln) {
      await window.webln.enable();
      await window.webln.sendPayment(window.lightningInvoice);
      qrContainer.innerHTML = `<p style="color:green;">✅ Payment of ${sats} sats sent via WebLN!</p>`;
      qrContainer.classList.remove("hidden");
      return;
    }
  } catch (err) {
    console.warn("WebLN payment failed or cancelled:", err);
  }

  window.showQR(window.lightningInvoice, sats);
};
