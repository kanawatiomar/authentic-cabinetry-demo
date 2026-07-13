const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");

if (window.lucide) {
  window.lucide.createIcons();
}

if (year) {
  year.textContent = new Date().getFullYear();
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
