const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');
  
  for (i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }
  
  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}

items.forEach(item => item.addEventListener('click', toggleAccordion));

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const voiceSearchButton = document.getElementById("voiceSearchButton");

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configuración del reconocimiento
      recognition.lang = "es-ES"; // Cambia a tu idioma preferido
      recognition.interimResults = false;

      voiceSearchButton.addEventListener("click", () => {
          recognition.start();
      });

      recognition.addEventListener("result", (event) => {
          const transcript = event.results[0][0].transcript;
          searchInput.value = transcript;
      });

      recognition.addEventListener("error", (event) => {
          console.error("Error en el reconocimiento de voz:", event.error);
      });
  } else {
      voiceSearchButton.disabled = true;
      alert("Tu navegador no soporta la API de Reconocimiento de Voz.");
  }
});
