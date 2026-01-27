window.signInWithLightningAddress = function () {
  window.lightningInvoice = prompt(
    "Enter a Lightning invoice (payment request) from the student to receive rewards:"
  );
  if (!window.lightningInvoice) {
    alert("You need a Lightning invoice to receive rewards!");
  } else {
    alert("Great! WebLN or QR code will be used to pay this invoice.");
  }
};

window.showQR = function (invoice, sats) {
  const qrContainer = document.getElementById("paymentQR");
  qrContainer.innerHTML = `<p>Scan this QR code with your Lightning wallet to pay <strong>${sats} sats</strong>:</p>`;

  if (window.QRCode) {
    QRCode.toCanvas(invoice, { width: 200 }, (err, canvas) => {
      if (err) console.error(err);
      qrContainer.appendChild(canvas);
    });
  } else {
    qrContainer.innerHTML += `<p>${invoice}</p>`;
  }

  qrContainer.classList.remove("hidden");
};

window.payForScore = async function (sats) {
  const qrContainer = document.getElementById("paymentQR");

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