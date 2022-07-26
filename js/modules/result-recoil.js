export default function resultRecoil() {
    const element = document.getElementById("introResult");
    const previousElement = element.previousElementSibling;
    const recoil = element.offsetHeight / 2;
    const spacing = () => {
        if (!window.matchMedia("(max-width: 575.98px)").matches) 
            return 50
        else 
            return 30;
    }

    element.style.bottom = `-${recoil}px`;
    previousElement.style.marginBottom = `${spacing() - recoil}px`;
}
resultRecoil();
window.addEventListener("resize", resultRecoil);