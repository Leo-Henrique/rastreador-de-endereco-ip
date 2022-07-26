import resultRecoil from "./result-recoil.js";

export default function ipTracking() {
    const btn = document.getElementById("btn");
    const input = document.getElementById("search");
    const userIpBtn = document.getElementById("userIp");
    const timeToShowInfos = 300;

    const errorMessage = (configs) => {
        const element = document.getElementById("error");

        const openMessage = () => {
            element.classList.add("display");
            element.innerText = configs.message;
            setTimeout(() => {
                element.classList.add("show");
                input.classList.add("error");
                input.focus();
                clickOutside();
            }, 20);
        }
        const closeMessage = () => {
            element.classList.remove("show");
            input.classList.remove("error");
            setTimeout(() => {
                element.classList.remove("display");
            }, 300);
        }
        function clickOutside() {
            document.addEventListener("click", handleClick);

            function handleClick(e) {
                if (!element.contains(e.target)) {
                    closeMessage();
                    document.removeEventListener("click", handleClick);
                }
            }
        }

        configs.show === true ? openMessage() : closeMessage();
    }

    function request(userInput) {
        const APIParameters = {
            fields: "fields=ip,success,message,country,region_code,city,latitude,longitude,connection.isp,connection.domain,timezone.utc",
            lang: "lang=pt-BR",
        }
        const resource = `https://ipwho.is/${userInput}?${APIParameters.lang}&${APIParameters.fields}`;

        return fetch(resource).then(res => res.json())
        .then(body => {
            if (body.success === true) {
                const elementsResult = document.querySelectorAll("#introResult p[id]");
                const ipElement = elementsResult[0];
                const locationElement = elementsResult[1];
                const infos = {
                    ip: body.ip,
                    get location() {
                        const city = body.city;
                        const region = body.region_code;
                        const country = body.country;
    
                        return `${city}, ${region} - ${country}`
                    },
                    timezone: `UTC${body.timezone.utc}`,
                    isp: body.connection.isp
                }
                elementsResult.forEach(element => {
                    element.classList.remove("show");
                    setTimeout(() => {
                        element.innerText = infos[element.id];
                        element.classList.add("show");

                        if (ipElement.innerText === userIpBtn.getAttribute("data-ip")) 
                            userIpBtn.setAttribute("disabled", "");
                        else 
                            userIpBtn.removeAttribute("disabled");
                    }, timeToShowInfos)
                });
                locationElement.setAttribute("data-lat", body.latitude);
                locationElement.setAttribute("data-lng", body.longitude);

                setTimeout(resultRecoil, timeToShowInfos + 20);

                return ipElement;
            } else {
                const errors = {
                    invalidIp: "Invalid IP address",
                    limitReached: "You've hit the monthly limit"
                }
                const message = (msg) => errorMessage({show: true, message: msg});

                switch(body.message) {
                    case errors.invalidIp:
                        message("Endereço IP inválido. Por favor, digite um endereço IP válido.");
                        break;

                    case errors.limitReached:
                        message("Você atingiu o limite mensal de solicitações. Por favor, retorne em outro momento.");
                        break;

                    default:
                        message("Um erro ocorreu. Por favor, tente novamente.");
                }
            }
        })
        .catch(() => {
            errorMessage({
                show: true,
                message: "Um erro inesperado ocorreu. Por favor, tente novamente."
            })
        });
    }
    function handleSearchBtn() {
        const userInput = input.value;
        const currentIp = document.getElementById("ip").innerText;

        if (userInput === "") {
            errorMessage({
                show: true,
                message: "Por favor, insira um endereço IP para rastrear."
            });

        } else if (userInput === currentIp) {
            errorMessage({
                show: true,
                message: "Por favor, digite um endereço IP diferente do que está sendo exibido."
            })
        } else {
            request(userInput);
        }
    }
    btn.addEventListener("click", handleSearchBtn);
    input.addEventListener("input", () => errorMessage({show: false}));

    async function handleUserIp() {
        const attr = "data-ip";
        const currentIp = await request("");

        setTimeout(() => {
            userIpBtn.setAttribute(attr, currentIp.innerText);
        
            if (currentIp.innerText === userIpBtn.getAttribute("data-ip")) 
                userIpBtn.setAttribute("disabled", "");
            else 
                userIpBtn.removeAttribute("disabled");
        }, timeToShowInfos + 20);

        return currentIp;
    }
    handleUserIp();
    userIpBtn.addEventListener("click", async () => {
        const currentIp = await handleUserIp();

        setTimeout(() => input.value = currentIp.innerText, timeToShowInfos + 20);
    });

}
ipTracking();