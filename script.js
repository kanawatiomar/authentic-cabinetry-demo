const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");
const headerCta = document.querySelector(".header-cta");

if (window.lucide) {
  window.lucide.createIcons();
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const contactDialog = document.createElement("dialog");
contactDialog.className = "contact-dialog";
contactDialog.id = "contact-form";
contactDialog.setAttribute("aria-labelledby", "contact-dialog-title");
contactDialog.innerHTML = `
  <div class="contact-dialog-shell">
    <button class="contact-dialog-close" type="button" aria-label="Close contact form" data-contact-close>&times;</button>
    <div class="contact-dialog-heading">
      <p class="eyebrow">Contact Us</p>
      <h2 id="contact-dialog-title">How can we reach you?</h2>
      <p>Leave your contact information and we will get back to you.</p>
    </div>
    <form class="quote-form contact-modal-form" action="https://formsubmit.co/Authentic_Cabinetry@outlook.com" method="post">
      <input type="hidden" name="_subject" value="New contact request from the Authentic Cabinetry website">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_next" value="https://kanawatiomar.github.io/authentic-cabinetry-demo/thank-you.html">
      <input type="hidden" name="_url" value="https://kanawatiomar.github.io/authentic-cabinetry-demo/">
      <input type="hidden" name="_autoresponse" value="Thank you for contacting Authentic Cabinetry. We received your information and will follow up soon.">
      <label class="form-honeypot" aria-hidden="true">Leave this field empty<input name="_honey" tabindex="-1" autocomplete="off"></label>
      <label>Name<input name="Name" autocomplete="name" required></label>
      <label>Email<input name="email" type="email" autocomplete="email" required></label>
      <label>Phone Number<input name="Phone Number" type="tel" autocomplete="tel" required></label>
      <label>Tell us more about your project (optional)<textarea name="Project Details" rows="4"></textarea></label>
      <button class="button primary" type="submit">Send</button>
    </form>
  </div>`;
document.body.append(contactDialog);

const openContactDialog = () => {
  if (!contactDialog.open) {
    contactDialog.showModal();
  }
  document.body.classList.add("modal-open");
  window.requestAnimationFrame(() => contactDialog.querySelector('input[name="Name"]')?.focus());
};

const closeContactDialog = () => {
  if (contactDialog.open) {
    contactDialog.close();
  }
};

document.addEventListener("click", (event) => {
  const contactLink = event.target.closest('a[href^="contact.html"], a[href="#contact-form"], [data-contact-open]');
  if (contactLink) {
    event.preventDefault();
    openContactDialog();
    return;
  }

  if (event.target.closest("[data-contact-close]")) {
    closeContactDialog();
  }
});

contactDialog.addEventListener("click", (event) => {
  if (event.target === contactDialog) {
    closeContactDialog();
  }
});

contactDialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (window.location.hash === "#contact-form") {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
});

if (window.location.hash === "#contact-form") {
  openContactDialog();
}

if (headerCta) {
  const floatingCta = document.createElement("a");
  floatingCta.className = "floating-quote-cta";
  floatingCta.href = headerCta.getAttribute("href") || "#contact-form";
  floatingCta.textContent = "Contact Us";
  floatingCta.setAttribute("aria-label", "Contact Authentic Cabinetry");
  document.body.append(floatingCta);
}

if (header && navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

const galleryNav = document.querySelector("[data-gallery-nav]");

if (galleryNav) {
  const galleryLinks = [...galleryNav.querySelectorAll('a[href^="#"]')];
  const gallerySections = galleryLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  let activeGalleryId = "";

  const updateGalleryNavigation = () => {
    const headerHeight = header ? header.offsetHeight : 0;
    document.documentElement.style.setProperty("--site-header-height", `${headerHeight}px`);

    const activationLine = headerHeight + galleryNav.offsetHeight + 32;
    let activeSection = gallerySections[0];

    gallerySections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeSection = section;
      }
    });

    const activeSectionChanged = activeGalleryId !== activeSection.id;

    galleryLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeSection.id}`;
      if (isActive) {
        link.setAttribute("aria-current", "location");
        if (activeSectionChanged) {
          link.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });

    activeGalleryId = activeSection.id;
  };

  let galleryScrollFrame;
  const requestGalleryNavigationUpdate = () => {
    if (galleryScrollFrame) return;
    galleryScrollFrame = window.requestAnimationFrame(() => {
      updateGalleryNavigation();
      galleryScrollFrame = null;
    });
  };

  updateGalleryNavigation();
  window.addEventListener("scroll", requestGalleryNavigationUpdate, { passive: true });
  window.addEventListener("resize", requestGalleryNavigationUpdate);

  if ("ResizeObserver" in window && header) {
    const stickyNavObserver = new ResizeObserver(requestGalleryNavigationUpdate);
    stickyNavObserver.observe(header);
    stickyNavObserver.observe(galleryNav);
  }
}

const serviceMapEl = document.querySelector("[data-service-map]");

if (serviceMapEl && window.L) {
  const map = L.map(serviceMapEl, {
    scrollWheelZoom: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const serviceArea = [
    [38.78, -123.12],
    [38.72, -122.62],
    [38.55, -122.18],
    [38.18, -121.86],
    [37.72, -121.62],
    [37.42, -121.72],
    [36.25, -121.36],
    [36.48, -121.92],
    [36.94, -122.10],
    [37.42, -122.44],
    [37.82, -122.56],
    [38.24, -122.98],
    [38.78, -123.12],
  ];

  const polygon = L.polygon(serviceArea, {
    color: "#1f4f3a",
    weight: 3,
    opacity: 0.95,
    fillColor: "#4f7a5b",
    fillOpacity: 0.16,
  }).addTo(map);

  const places = [
    ["Campbell shop", 37.2872, -121.9499],
    ["San Jose", 37.3382, -121.8863],
    ["Los Gatos", 37.2358, -121.9624],
    ["Saratoga", 37.2638, -122.0230],
    ["Cupertino", 37.3229, -122.0322],
    ["Sunnyvale", 37.3688, -122.0363],
    ["Santa Clara", 37.3541, -121.9552],
    ["Palo Alto", 37.4419, -122.1430],
    ["Mountain View", 37.3861, -122.0839],
    ["Los Altos", 37.3852, -122.1141],
    ["Menlo Park", 37.4530, -122.1817],
    ["Atherton", 37.4613, -122.1977],
    ["Redwood City", 37.4852, -122.2364],
    ["San Mateo", 37.5630, -122.3255],
    ["Burlingame", 37.5779, -122.3481],
    ["Foster City", 37.5585, -122.2711],
    ["San Francisco", 37.7749, -122.4194],
    ["Oakland", 37.8044, -122.2712],
    ["Berkeley", 37.8715, -122.2730],
    ["Walnut Creek", 37.9101, -122.0652],
    ["Danville", 37.8216, -121.9999],
    ["Pleasanton", 37.6624, -121.8747],
    ["Dublin", 37.7022, -121.9358],
    ["Livermore", 37.6819, -121.7680],
    ["Fremont", 37.5485, -121.9886],
    ["Newark", 37.5297, -122.0402],
    ["Union City", 37.5934, -122.0438],
    ["Hayward", 37.6688, -122.0808],
    ["Concord", 37.9780, -122.0311],
    ["Marin County", 38.0834, -122.7633],
    ["Napa County", 38.5025, -122.2654],
    ["Sonoma County", 38.5780, -122.9888],
    ["Santa Cruz County", 37.0454, -122.0308],
    ["Monterey County", 36.2400, -121.3100],
  ];

  const markerIcon = L.divIcon({
    className: "service-map-dot",
    html: "",
    iconSize: [9, 9],
    iconAnchor: [4, 4],
  });

  places.forEach(([name, lat, lng]) => {
    L.marker([lat, lng], { icon: markerIcon }).addTo(map).bindPopup(name);
  });

  map.fitBounds(polygon.getBounds(), {
    padding: [18, 18],
  });

  window.setTimeout(() => {
    map.invalidateSize();
    map.fitBounds(polygon.getBounds(), {
      padding: [18, 18],
    });
  }, 250);

  window.addEventListener("resize", () => {
    map.invalidateSize();
  });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(serviceMapEl);
  }
}
