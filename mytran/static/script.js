   
document.getElementById("copyOutBtn").classList.add("d-none");

// --------- cache nodes once
const it  = document.getElementById('it');   // input textarea
const ot  = document.getElementById('ot');   // output textarea
const badge = document.getElementById('charBadge');

// --------- compute constants once
const lineHeight = parseFloat(getComputedStyle(it).lineHeight);   // px
const fourRows   = 4 * lineHeight;                                // px

function resizeFromInput() {
  // 1️⃣  reset input height so scrollHeight is current
  it.style.height = 'auto';
    ot.style.height = 'auto';
  // 2️⃣  required height = max(scroll, 4 rows)
  let needed = Math.max(it.scrollHeight, fourRows,ot.scrollHeight);

  // 3️⃣  add one blank line of breathing‑room
  
  needed += 1.25*lineHeight;
  
  
  if(it.value.length === 0  ) {
      document.getElementById('ot').value = "Translation will appear here...";
      needed = 4 * lineHeight; // reset to 4 rows

          document.getElementById("copyOutBtn").classList.add("d-none");
          it.style.height = `${needed}px`;
          ot.style.height = `${needed}px`;
          return;
        }
 // 4️⃣  set BOTH textareas to that height
  it.style.height = `${needed}px`;
  ot.style.height = `${needed}px`;
   
}

// --------- attach listeners
it.addEventListener('input', () => {
  resizeFromInput();
  badge.textContent = `${it.value.length} / 4000`;
});

window.addEventListener('load', resizeFromInput);

      // Initialize Select2
      $(document).ready(function() {
        const $dd= $('.searchable-dropdown').select2({
      
         
          });
          
          // When the dropdown is shown, move the cursor straight to the search field
          $dd.on('select2:open', () => {
            // Select2 always gives the search input this class:
            const input = document.querySelector('.select2-container--open .select2-search__field');
            if (input) input.focus();                 // → cursor is ready for typing
          });
        });

      // Handle translation button click
      document.getElementById('tbtn').addEventListener('click', () => {
        
        const lg = document.getElementById("lg").value;
        const it = document.getElementById("it").value;
        document.getElementById("copyOutBtn").classList.add("d-none");
        if(it.length === 0 || it.trim() === "") {
          document.getElementById('ot').value = "Translation will appear here...";
          return;}
          document.getElementById('ot').value = "Translating..."; // Show a loading message
          
          fetch('/translate/', {  // <-- your Django endpoint
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
              language: lg,
              input_text: it
            })
          })
          .then(response => response.json())
          .then(data => {
            document.getElementById('ot').value = data.translated;
            document.getElementById('d1').textContent = data.detected_language+"-Detected"; // Update detected language
            resizeFromInput(); // Resize textareas based on content
            document.getElementById("copyOutBtn").classList.remove("d-none");
    })
    .catch(error => console.error('Error:', error));
  });
  
  // Get CSRF token for Django
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  document.getElementById('copyOutBtn').addEventListener('click', () => {
     alert("Copied to clipboard.");
  const ot = document.getElementById('ot');
  navigator.clipboard.writeText(ot.value).then(() => {
    const icon = document.querySelector('#copyOutBtn svg');
    icon.classList.replace('bi-copy', 'bi-clipboard-check');   // success glyph
    setTimeout(() => icon.classList.replace('bi-clipboard-check', 'bi-copy'), 1200);
  });
});
