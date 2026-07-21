/* ==========================================================================
   Smile Hub Dental Care - Appointment Booking Logic (booking.js)
   ========================================================================== */

const CLINIC_PHONE = "919959625387"; // Clinic WhatsApp Contact

document.addEventListener('DOMContentLoaded', () => {
  initBookingModal();
  initFormSubmissions();
  initAutoPopupOnServicesSection();
});

// Modal Open/Close Logic
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const triggerBtns = document.querySelectorAll('.trigger-booking-modal');
  const closeBtn = modal ? modal.querySelector('.modal-close') : null;

  if (!modal) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const predefinedService = btn.getAttribute('data-service');
      if (predefinedService) {
        const serviceSelect = modal.querySelector('#modalServiceSelect');
        if (serviceSelect) serviceSelect.value = predefinedService;
      }
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Form Handlers (Hero Form & Modal Form)
function initFormSubmissions() {
  const heroForm = document.getElementById('heroBookingForm');
  const modalForm = document.getElementById('modalBookingForm');

  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBookingSubmission(heroForm);
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBookingSubmission(modalForm, true);
    });
  }
}

function handleBookingSubmission(formElement, isModal = false) {
  const name = formElement.querySelector('[name="name"]')?.value || 'Valued Patient';
  const phone = formElement.querySelector('[name="phone"]')?.value || '';
  const service = formElement.querySelector('[name="service"]')?.value || 'General Consultation';
  const date = formElement.querySelector('[name="date"]')?.value || 'Earliest Available';
  const notes = formElement.querySelector('[name="notes"]')?.value || 'None';

  if (!phone) {
    alert('Please enter a valid phone number for appointment confirmation.');
    return;
  }

  // Generate WhatsApp Message Link
  const textMsg = `Hello Smile Hub Dental Care!%0A%0A*New Appointment Request*%0A👤 *Name:* ${encodeURIComponent(name)}%0A📞 *Phone:* ${encodeURIComponent(phone)}%0A🦷 *Treatment:* ${encodeURIComponent(service)}%0A📅 *Preferred Date:* ${encodeURIComponent(date)}%0A📝 *Notes:* ${encodeURIComponent(notes)}%0A%0APlease confirm my appointment. Thank you!`;

  const waUrl = `https://wa.me/${CLINIC_PHONE}?text=${textMsg}`;

  // Close modal if open
  if (isModal) {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
  }

  // Show Success Alert / Redirect to WhatsApp
  alert(`Thank you ${name}! Your booking request for ${service} has been received. Redirecting to WhatsApp to send confirmation directly to Smile Hub Dental Care...`);
  
  window.open(waUrl, '_blank');
  formElement.reset();
}

// Auto-popup appointment window when user reaches and explores "Comprehensive Dental Solutions Under One Roof" (#services)
function initAutoPopupOnServicesSection() {
  const servicesSection = document.getElementById('services');
  const modal = document.getElementById('bookingModal');

  if (!servicesSection || !modal) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger auto popup if not already triggered in this session
        if (!sessionStorage.getItem('hasAutoPoppedBookingModal')) {
          setTimeout(() => {
            if (!modal.classList.contains('active')) {
              modal.classList.add('active');
              sessionStorage.setItem('hasAutoPoppedBookingModal', 'true');
            }
          }, 1000); // 1-second delay after exploring the section
        }
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25 // Triggers when 25% of section is visible
  });

  observer.observe(servicesSection);
}

