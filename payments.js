window.signInWithLightningAddress = function () {
  window.lightningInvoice = prompt(
    "Enter a Lightning address (payment request) from the student to receive rewards:",
  );
  if (!window.lightningInvoice) {
    alert("You need a Lightning address to receive rewards!");
  } else {
    alert("Great! WebLN or QR code will be used to pay this invoice.");
  }
};

window.showQR = function (invoice, sats) {
  const qrContainer = document.getElementById("paymentQR");

  qrContainer.innerHTML = `
    <p>Scan to reward <strong>${sats} sats</strong></p>
    <canvas id="qrCanvas"></canvas>
    <p style="word-break: break-all; font-size: 12px;">${invoice}</p>
  `;

  qrContainer.classList.remove("hidden");

  const canvas = document.getElementById("qrCanvas");

  if (!canvas) {
    console.error("QR canvas not found");
    return;
  }

  if (!window.QRCode) {
    console.error("QRCode library not loaded");
    return;
  }

  QRCode.toCanvas(
    canvas,
    invoice,
    { width: 220, margin: 1 },
    (err) => {
      if (err) console.error("QR render error:", err);
    }
  );
};

window.payForScore = async function (sats) {
  const qrContainer = document.getElementById("paymentQR");

  if (!window.lightningInvoice) {
    window.signInWithLightningAddress();
  }

  if (!window.lightningInvoice || sats <= 0) {
    qrContainer.innerHTML = `<p>No payout.</p>`;
    qrContainer.classList.remove("hidden");
    return;
  }

  let invoice = window.lightningInvoice;

  if (invoice.includes("@")) {
    invoice = await getInvoiceFromLightningAddress(invoice, sats);
  }

  window.currentBolt11 = invoice;

  try {
    if (window.webln) {
      await window.webln.enable();
      await window.webln.sendPayment(invoice);

      qrContainer.innerHTML = `<p style="color:green;">✅ Paid ${sats} sats via WebLN</p>`;
      qrContainer.classList.remove("hidden");
      return;
    }
  } catch (err) {
    console.warn("WebLN failed:", err);
  }

  window.showQR(invoice, sats);
};
