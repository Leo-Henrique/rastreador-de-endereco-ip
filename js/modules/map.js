export default function map() {
    const map = L.map(document.getElementById("map"), {zoomControl: false});
    const icon = L.icon({iconUrl: './images/icon-location.svg',});

    L.tileLayer("https://tile.osm.ch/switzerland/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="external noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    function setLocation(location) {
        map.setView(location, 12.5);
        L.marker(location, {icon}).addTo(map);
    }

    (() => {
        const elementTarget = document.getElementById("location");
        const handleChangeLocation = (MutationRecord) => {
            const attrNames = Array.from(MutationRecord).map(mutation => mutation.attributeName);
            const attrValues = attrNames.map(attr => elementTarget.getAttribute(attr)); 

            setLocation(attrValues);
        }
        new MutationObserver(handleChangeLocation).observe(elementTarget, {
            attributes: true,
            attributeFilter: ["data-lat", "data-lng"]
        });
    })();
}
map();