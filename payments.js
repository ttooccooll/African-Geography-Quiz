window.signInWithLightningAddress = function () {
  window.lightningAddress = prompt(
    "Enter student's Lightning Address (e.g., user@domain.com):"
  );
  if (!window.lightningAddress) {
    alert("You need a Lightning Address to receive rewards!");
  } else {
    alert(`Welcome! Lightning rewards will go to ${window.lightningAddress}`);
  }
};

window.createInvoice = function (lightningAddress, sats) {
  return new Promise((resolve) => {
    const invoice = `lnbc${sats}n1p${Date.now()}pp5qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq`;
    resolve(invoice);
  });
};

window.showQR = function (invoice, sats) {
  const qrContainer = document.getElementById("paymentQR");
  qrContainer.innerHTML = `<p>Scan this QR code with your Lightning wallet to pay <strong>${sats} sats</strong>:</p>`;

  if (window.QRCode) {
    QRCode.toCanvas(invoice, { width: 200 }, (err, canvas) => {
      if (err) console.error(err);
      qrContainer.appendChild(canvas);
    });
    qrContainer.classList.remove("hidden");
  } else {
    qrContainer.innerHTML += `<p>${invoice}</p>`;
    qrContainer.classList.remove("hidden");
  }
};

window.payForScore = async function (sats) {
  const qrContainer = document.getElementById("paymentQR");
  if (!window.lightningAddress || sats <= 0) {
    qrContainer.innerHTML = `<p>No Lightning Address or score is 0. No payment.</p>`;
    qrContainer.classList.remove("hidden");
    return;
  }

  try {
    const invoice = await window.createInvoice(window.lightningAddress, sats);

    if (window.webln) {
      try {
        await window.webln.enable();
        await window.webln.sendPayment(invoice);
        qrContainer.innerHTML = `<p style="color:green;">✅ Payment of ${sats} sats sent via WebLN!</p>`;
        qrContainer.classList.remove("hidden");
      } catch (err) {
        console.warn("WebLN payment failed or cancelled:", err);
        qrContainer.innerHTML = `<p>WebLN payment failed or cancelled. Scan QR to pay ${sats} sats:</p>`;
        window.showQR(invoice, sats);
      }
    } else {
      window.showQR(invoice, sats);
    }
  } catch (err) {
    console.error("Invoice creation failed:", err);
    qrContainer.innerHTML = `<p>Failed to create invoice.</p>`;
    qrContainer.classList.remove("hidden");
  }
};