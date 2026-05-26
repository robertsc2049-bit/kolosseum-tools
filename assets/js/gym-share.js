(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function value(id) {
    var el = byId(id);
    return el && typeof el.value === "string" ? el.value.trim() : "";
  }

  function makeQrUrl(text) {
    return "https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=16&format=png&data=" + encodeURIComponent(text);
  }

  function buildShareText() {
    var gym = value("gymName");
    var location = value("gymLocation");
    var note = value("gymNote");
    var lines = [];

    if (gym) {
      lines.push(gym);
    }

    if (location) {
      lines.push("Location: " + location);
    }

    if (note) {
      lines.push(note);
    }

    return lines.join("\n");
  }

  ready(function () {
    var form = byId("gymShareForm");
    var output = byId("gymShareOutput");
    var state = byId("gymShareState");
    var copyButton = byId("gymShareCopy");
    var printButton = byId("gymSharePrintQr");
    var previewImage = byId("gymShareQrPreviewImage");

    function render() {
      var text = buildShareText();

      if (output) {
        output.textContent = text || "Enter gym details to generate a public share block.";
      }

      if (state) {
        state.textContent = text ? "Ready" : "Awaiting input";
      }

      if (previewImage) {
        if (text) {
          previewImage.src = makeQrUrl(text);
          previewImage.classList.add("is-ready");
        }
        else {
          previewImage.removeAttribute("src");
          previewImage.classList.remove("is-ready");
        }
      }

      return text;
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        render();
      });

      form.addEventListener("input", render);
    }

    if (copyButton) {
      copyButton.addEventListener("click", function () {
        var text = render();

        if (!text || !navigator.clipboard) {
          return;
        }

        navigator.clipboard.writeText(text).then(function () {
          copyButton.textContent = "Copied";
          window.setTimeout(function () {
            copyButton.textContent = "Copy Share Text";
          }, 1200);
        });
      });
    }

    if (printButton) {
      printButton.addEventListener("click", function () {
        var text = render() || "Enter gym details before printing QR.";
        var title = byId("gymShareQrTitle");
        var image = byId("gymShareQrImage");
        var payload = byId("gymShareQrPayload");

        if (title) {
          title.textContent = text.split(/\r?\n/).filter(Boolean)[0] || "Gym Share";
        }

        if (payload) {
          payload.textContent = text;
        }

        if (image) {
          image.onload = function () {
            window.setTimeout(function () {
              window.print();
            }, 180);
          };

          image.onerror = function () {
            window.print();
          };

          image.src = makeQrUrl(text);
          return;
        }

        window.print();
      });
    }

    render();
  });
})();
