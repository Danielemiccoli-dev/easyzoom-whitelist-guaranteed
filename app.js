const input = document.getElementById("main-input");
const mainWrapper = document.getElementById("main-wrapper")
const searchButton = document.getElementById("search-button");
const mainKeyWrapper = document.querySelector(".main-key-wrapper")
const shadow = document.querySelector(".main-key-wrapper_shadow")

fetch("users.json")
  .then(response => response.json())
  .then(usersData => {
    const users = usersData
    searchButton.addEventListener("click", () => {
      searchKeyFromAddress(input.value)
    });
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
          event.preventDefault();
          searchKeyFromAddress(input.value);
      }
    });
    function searchKeyFromAddress (address) {
      function copyToNote(text) {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      function truncateAddress (address) {
        return `${address.substr(0, 5)}...${address.substr(
            address.length - 5,
            address.length
        )}`;
      }
      mainWrapper.classList.add("start")
      const ANIMATION_TIME = 500
      const wrapperWidth = (mainKeyWrapper.offsetWidth + "px").toString()
      const wrapperHeight = (mainKeyWrapper.offsetHeight + "px").toString()
      mainKeyWrapper.style.minHeight = wrapperHeight
      let screenWidth = screen.width
      let isMobile = screenWidth < 768
      if (users[address]) {
        mainWrapper.classList.remove("start")
        mainWrapper.classList.remove("error")
        mainWrapper.classList.remove("success")
        mainKeyWrapper.style.minWidth = wrapperWidth
        shadow.classList.add("active")
        setTimeout(() => {
          mainKeyWrapper.innerHTML = ""
          if (isMobile) {
            mainKeyWrapper.style.minWidth = "300px"
          } else {
            mainKeyWrapper.style.minWidth = "650px"
          }
          mainKeyWrapper.classList.remove("error")
          mainKeyWrapper.classList.add("success")
          setTimeout(() => {
            mainWrapper.classList.add("success")
            const keyArea = document.createElement("span")
            const copyButton = document.createElement("button");
            copyButton.classList.add("copy-button");
            copyButton.innerHTML = "<img src='img/copy-icon.svg' alt='Copy' />";
            if (isMobile) {
              mainKeyWrapper.innerHTML = "<img src='img/key-icon.svg' alt='Copy' />: "
              keyArea.append(truncateAddress(users[address]))
              const copyHover = document.createElement("div");
              copyHover.classList.add("copy-hover");
              copyHover.innerText = "Copy to clipboard";
              copyButton.appendChild(copyHover)
              copyButton.addEventListener("click", () => {
                const textToCopy = users[address];
                copyToNote(textToCopy);
                copyHover.innerText = "Copied!"
      
                setTimeout(() => {
                  copyHover.innerText = "Copy to clipboard";
                }, 1500);
              });
              keyArea.style.color = "white"
            } else {
              keyArea.append(users[address])
              mainKeyWrapper.innerHTML = "<img src='img/key-icon.svg' alt='Copy' /> Merble Tree Key: "
            }    
            mainKeyWrapper.append(keyArea)
            shadow.classList.remove("active")
            mainKeyWrapper.appendChild(copyButton);
          }, ANIMATION_TIME);
        }, 400)
      } else {
        mainWrapper.classList.remove("start")
        mainWrapper.classList.remove("success")
        shadow.classList.add("active")
        mainKeyWrapper.style.minWidth = wrapperWidth
        setTimeout(() => {
          mainKeyWrapper.textContent = ""
          if (isMobile) {
            mainKeyWrapper.style.minWidth = "370px"
          } else {
            mainKeyWrapper.style.minWidth = "425px"
          }
          mainKeyWrapper.classList.remove("success")
          mainKeyWrapper.classList.add("error")
          setTimeout(() => {
            mainWrapper.classList.add("error")
            shadow.classList.remove("active")
            mainKeyWrapper.textContent = "Sorry, your wallet is not in our whitelist"
          },ANIMATION_TIME)
        },400)
      }
      input.value = "";
    };
  })
  .catch(error => console.error(error));





