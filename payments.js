window.lightningEnabled = false;
window.lightningInvoice = null;

window.showLightningModal = function () {
  document.getElementById("lightningModal").classList.remove("hidden");
};

document.getElementById("enableLightningBtn").onclick = () => {
  const input = document
    .getElementById("lightningInput")
    .value.trim();

  if (!input) {
    alert("Please enter a Lightning address or click Just play.");
    return;
  }

  window.lightningInvoice = input;
  window.lightningEnabled = true;

  document.getElementById("lightningModal").classList.add("hidden");
};

document.getElementById("skipLightningBtn").onclick = () => {
  window.lightningEnabled = false;
  window.lightningInvoice = null;

  document.getElementById("lightningModal").classList.add("hidden");
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
    window.showLightningModal();
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
