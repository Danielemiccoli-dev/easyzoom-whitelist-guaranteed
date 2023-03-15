const input = document.getElementById("main-input");
const mainWrapper = document.getElementById("main-wrapper")
const searchButton = document.getElementById("search-button");
const mainKeyWrapper = document.querySelector(".main-key-wrapper")
const shadow = document.querySelector(".main-key-wrapper_shadow")

/* Dan */
import { MerkleTree } from './merkletreejs.js'
import keccak256 from './keccak256.js'
import whitelist from './whitelist.json'

const whiteListLeaves = whitelist.map(addr => keccak256(addr))
const tree = new MerkleTree(whiteListLeaves, keccak256, {sortPairs: true})
console.log(window.MerkleTree)

const rootHash = tree.getRoot()
console.log(rootHash.toString("hex"));
const claimingAddress = whiteListLeaves[5]; //Minting address
console.log(claimingAddress)
//------------------

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
      const leaf = keccak256(address)
      const proof = tree.getHexProof(leaf)
      const isValid = tree.verify(proof, leaf, root)
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
      shadow.style.zIndex = "2";
      const ANIMATION_TIME = 500
      const wrapperWidth = (mainKeyWrapper.offsetWidth + "px").toString()
      const wrapperHeight = (mainKeyWrapper.offsetHeight + "px").toString()
      mainKeyWrapper.style.minHeight = wrapperHeight
      let screenWidth = screen.width
      let isMobile = screenWidth < 768
      if (isValid) {
        mainWrapper.classList.remove("start")
        mainWrapper.classList.remove("error")
        mainWrapper.classList.remove("success")
        mainKeyWrapper.style.minWidth = wrapperWidth
        shadow.classList.add("active")
        setTimeout(() => {
          mainKeyWrapper.innerHTML = ""
          if (isMobile) {
            mainKeyWrapper.style.minWidth = "305px"
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
              keyArea.style.color = "white"
            } else {
              keyArea.append(users[address])
              const copyHover = document.createElement("div");
              copyHover.classList.add("copy-hover");
              copyHover.innerText = "Copy to clipboard";
              copyButton.appendChild(copyHover)
              copyButton.addEventListener("click", () => {
                const textToCopy = proof;
                copyToNote(textToCopy);
                copyHover.innerText = "Copied!"
      
                setTimeout(() => {
                  copyHover.innerText = "Copy to clipboard";
                }, 1500);
              });
              mainKeyWrapper.innerHTML = "<img src='img/key-icon.svg' alt='Copy' /> Merble Tree Key: "
            }    
            mainKeyWrapper.append(keyArea)
            shadow.classList.remove("active")
            setTimeout(() => {
              shadow.style.zIndex = "-2";
            },400)
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
            mainKeyWrapper.style.minWidth = "300px"
          } else {
            mainKeyWrapper.style.minWidth = "425px"
          }
          mainKeyWrapper.classList.remove("success")
          mainKeyWrapper.classList.add("error")
          setTimeout(() => {
            mainWrapper.classList.add("error")
            shadow.classList.remove("active")
            setTimeout(() => {
              shadow.style.zIndex = "-2";
            },400)
            mainKeyWrapper.textContent = "Sorry, your wallet is not in our whitelist"
          },ANIMATION_TIME)
        },400)
      }
      input.value = "";
    };
  })
  .catch(error => console.error(error));
