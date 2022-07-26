# Desafio do Frontend Mentor | Rastreador de endereço IP

Desafio do Frontend Mentor com ênfase em JavaScript, consistia em consumir duas APIs diferentes para fazer um rastreador de endereço IP. A página exibe informações de localização com base no IP do próprio usuário ou em algum IP digitado manualmente.

Um bom desafio para lidar com o consumo de APIs em JS, promises e JavaScript Assíncrono em geral. A plataforma o considera como nível intermediário.

![Captura de tela do projeto](https://user-images.githubusercontent.com/72027449/181072552-819a5b38-3765-4872-8637-f34c75f523a3.png)

## 📋 Índice

* [Visão geral](#-visão-geral)
    * [Status](#-status)
    * [O desafio](#-o-desafio)
    * [Links](#-acesse-o-projeto)
* [Desenvolvimento](#%EF%B8%8F-desenvolvimento)
    * [Tecnologias utilizadas](#-tecnologias-utilizadas)
    * [Sobre o desenvolvimento e melhorias no desafio](#-sobre-o-desenvolvimento-e-melhorias-no-desafio)
        * [API de geolocalização](#API-de-geolocalização)
        * [Retorno da API de geolocalização](#retorno-da-API-de-geolocalização)
        * [Poupar solicitações da API de geolocalização](#poupar-solicitações-da-API-de-geolocalização)
        * [Pesquisar pelo endereço IP do usuário](#pesquisar-pelo-endereço-IP-do-usuário)
        * [Verificar alterações de latitude e longitude](#verificar-alterações-de-latitude-e-longitude)

## 🔎 Visão geral

### ✅ Status

Finalizado.

### 🏁 O desafio

Para a resolução deste desafio, os usuários devem ser capazes de:

* Visualizar exatamente o layout proposto de acordo com o tamanho da janela de exibição (responsividade)
* Visualizar os estados – pairar, clicar ou selecionar – nos elementos interativos para uma usabilidade adequada
* Ver o próprio endereço IP no carregamento inicial da página
* Procurar por qualquer endereço IP ou domínio e visualizar as principais informações e localização

### 🔗 Acesse o projeto

* [Link do projeto](https://leo-henrique.github.io/rastreador-de-endereco-ip/)
* [Desafio no Frontend mentor](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0)

## ⚙️ Desenvolvimento

### 💻 Tecnologias utilizadas

* HTML
* CSS / SASS
* Vanilla JavaScript

### 💡 Sobre o desenvolvimento e melhorias no desafio

#### API de geolocalização

A API de geolocalização recomendada pela plataforma [(IPify)](https://geo.ipify.org/) não estava retornando uma localização precisa, então optei por utilizar a [IPWHOIS](https://ipwhois.io/). Infelizmente a mesma API só permite fazer busca por endereço IP, então decidi abrir mão das buscas pelo domínio (como requerido pelo desafio) para garantir o retorno de uma localização exata. 

Além disso, a **IPify** permitia somente 1.000 solicitações sem nenhum período para renovação, já a **IPWHOIS** estabelece 10.000 solicitações mensais por endereço IP.

#### Retorno da API de geolocalização

A **IPWHOIS** retorna algumas mensagens de erro em algumas ocasiões. Então, como sempre gosto de fazer, fico verificando o retorno para exibir mensagens específicas ao usuário caso haja algum erro.

Dentre os principais erros está um endereço IP que é inválido:

https://user-images.githubusercontent.com/72027449/181072437-54498450-2e3d-4c06-aade-e39c1639b42c.mp4

#### Poupar solicitações da API de geolocalização

Apesar de 10.000 solicitações por mês ser um número bem alto, achei interessante poupar as solicitações em casos desnecessários. Então, criei uma condicional para não deixar o usuário solicitar a API caso ele não digite nenhum endereço IP e outra para não deixar solicitar a API com um endereço IP que já está sendo exibido na página.

https://user-images.githubusercontent.com/72027449/181073026-efdd2039-561a-4411-8e77-46ab984e5b11.mp4

#### Pesquisar pelo endereço IP do usuário

Mesmo que ao carregar a página o endereço IP do usuário é exibido inicialmente, não havia um botão proposto pelo desafio para voltar a mostrar o endereço IP do próprio usuário, caso ele fizesse uma busca por outros endereços.

Pensando nisso, decidi criar esse botão, que simplesmente faz uma requisição sem nenhum endereço IP (o que retorna o IP do usuário). Caso o mesmo IP esteja sendo exibido, o botão é desativado.

OBS: O IP não é exibido no vídeo abaixo porque foi censurado.

https://user-images.githubusercontent.com/72027449/181079524-30676a69-8b6a-4dbf-9a25-d992ef5a428c.mp4

#### Verificar alterações de latitude e longitude

Sempre que a solicitação da API de geolocalização é bem-sucedida, ao mesmo tempo que exibo os textos de localização no elemento necessário, também adiciono atributos do tipo data neste mesmo elemento, contendo as informações de latitude e longitude do endereço IP que acabou de ser solicitado.

Dessa forma, em um outro arquivo dedicado somente ao mapa, fico observando este elemento com o **MutationObserver**. Sempre que os atributos especificados anteriormente mudar, uma mutação ocorre, então executo uma função que atualiza os valores de latitude e longitude no mapa.

```js
// elemento que adiciono os atributos data
const elementTarget = document.getElementById("location");
// função executada na mutação (quando os valores do atributos mudam)
const handleChangeLocation = (MutationRecord) => {
    // filtro o nome dos atributos que mudaram
    const attrNames = Array.from(MutationRecord).map(mutation => mutation.attributeName);
    // filtro os valores dos atributos
    const attrValues = attrNames.map(attr => elementTarget.getAttribute(attr)); 

    // função que seta os valores no mapa
    setLocation(attrValues);
}
// instancio o construtor do MutationObserver e começo a verificar o elemento
// nas opções, filtro para observar somente os atributos necessários
new MutationObserver(handleChangeLocation).observe(elementTarget, {
    attributes: true,
    attributeFilter: ["data-lat", "data-lng"]
});
```