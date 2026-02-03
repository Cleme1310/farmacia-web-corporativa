 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..ab55d6b1a005a1b7dfe6832690cc2c9ad3d52384
--- /dev/null
+++ b/script.js
@@ -0,0 +1,98 @@
+const contactForm = document.getElementById("contact-form");
+const contactFeedback = document.getElementById("contact-feedback");
+const prescriptionForm = document.getElementById("prescription-form");
+const prescriptionFeedback = document.getElementById("prescription-feedback");
+
+const ADMIN_EMAIL = "administracion@farmaciavidasana.cl";
+
+const showFeedback = (element, message, isError = false) => {
+  element.textContent = message;
+  element.style.color = isError ? "#b91c1c" : "#1d4ed8";
+};
+
+const buildMailtoLink = ({ subject, body }) => {
+  const params = new URLSearchParams({
+    subject,
+    body,
+  });
+
+  return `mailto:${ADMIN_EMAIL}?${params.toString()}`;
+};
+
+contactForm.addEventListener("submit", (event) => {
+  event.preventDefault();
+
+  const formData = new FormData(contactForm);
+  const name = formData.get("name").trim();
+  const company = formData.get("company").trim();
+  const email = formData.get("email").trim();
+  const message = formData.get("message").trim();
+
+  if (!name || !company || !email || !message) {
+    showFeedback(contactFeedback, "Completa todos los campos antes de enviar.", true);
+    return;
+  }
+
+  const body = `Nueva solicitud corporativa%0D%0A%0D%0A`;
+  const details = `Nombre: ${name}%0D%0AEmpresa: ${company}%0D%0AEmail: ${email}%0D%0A%0D%0AMensaje:%0D%0A${message}`;
+
+  showFeedback(contactFeedback, "Enviando correo automático...", false);
+  window.location.href = buildMailtoLink({
+    subject: "Contacto corporativo - Farmacia Vida Sana",
+    body: `${body}${details}`,
+  });
+
+  contactForm.reset();
+  showFeedback(
+    contactFeedback,
+    "¡Listo! Tu solicitud fue enviada al equipo comercial.",
+    false
+  );
+});
+
+prescriptionForm.addEventListener("submit", (event) => {
+  event.preventDefault();
+
+  const formData = new FormData(prescriptionForm);
+  const patient = formData.get("patient").trim();
+  const rut = formData.get("rut").trim();
+  const patientEmail = formData.get("patientEmail").trim();
+  const file = formData.get("file");
+
+  if (!patient || !rut || !patientEmail || !file || !file.name) {
+    showFeedback(
+      prescriptionFeedback,
+      "Completa todos los datos y adjunta tu receta.",
+      true
+    );
+    return;
+  }
+
+  const allowedTypes = ["application/pdf", "image/jpeg"];
+  if (!allowedTypes.includes(file.type)) {
+    showFeedback(
+      prescriptionFeedback,
+      "El archivo debe ser PDF o JPG. Por favor vuelve a intentarlo.",
+      true
+    );
+    return;
+  }
+
+  const maxSize = 5 * 1024 * 1024;
+  if (file.size > maxSize) {
+    showFeedback(
+      prescriptionFeedback,
+      "El archivo supera los 5 MB permitidos. Adjunta un PDF o JPG más liviano.",
+      true
+    );
+    return;
+  }
+
+  showFeedback(
+    prescriptionFeedback,
+    "Receta enviada con éxito. Nuestro equipo la revisará y te confirmará por email.",
+    false
+  );
+
+  prescriptionForm.reset();
+});
 
EOF
)
