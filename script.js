const l = {
  'pt-BR': {
    'Paste the link like it has cheese on it': 'Cole o link como se estivesse grudando',
    '(type': '(digite',
    'Loading...': 'Carregando...',
    'You must allow me to read your clipboard': 'Você deve permitir acesso à área de transferência',
    'Since you are here, why not paste another one?': 'Já que você está aqui, porque não cola mais um?',
    "(right click the link and select 'save link as')": "(clique com o botão direito no botão e selecione 'salvar link como')",
    "(touch-and-hold the link and select 'save link as')": "(segure o dedo no botão e selecione 'salvar link como')",
    'You must paste a youtube url': 'Você deve colar um link do youtube',
    'It was not possible to download this video, try another one :(': 'Não foi possível baixar esse vídeo, tente outro :(',
    'Watch': 'Assistir',
    'or click here': 'ou clique aqui',
    'Your download is starting! Why not paste another one?': 'Seu download está começando! Não quer colar mais um?',
  }
};
let canPaste = true;

const getL = (phrase) => l?.[navigator.language || navigator.userLanguage]?.[phrase] || phrase;
var isMac = (navigator?.platform || `mac`).toUpperCase().indexOf('MAC') >= 0;
if (isMac) command.innerText = 'command + v';
['or', 'pasteIt', 'typeIt', 'loading', 'since', 'howPC', 'howMobile', 'btn'].forEach((e) => {
  window[e].innerText = getL(window[e].innerText);
})

let timer = setTimeout(() => { }, 0);
const message = (text) => {
  if (typeof messageElement !== "undefined") {
    clearTimeout(timer);
    messageElement.remove();
  }
  document.body.insertAdjacentHTML('beforeend', `<user-message id="messageElement"></user-message>`);
  messageElement.innerText = text;
  setTimeout(() => messageElement.classList.add('shown'), 100);
  timer = setTimeout(() => messageElement.classList.remove('shown'), 3000);
};

document.addEventListener('paste', async (e) => {
  e.preventDefault();
  if (!canPaste) return false;
  stepOne.classList.remove('hide');
  stepTwo.classList.remove('hide');
  let clipboardData = e.clipboardData || window.clipboardData;
  let pastedData = clipboardData.getData('Text');
  runrun(pastedData);
});

async function runrun(video) {
  if (typeof video !== "string" || !isYtLink(video)) {
    message(getL('You must paste a youtube url'));
  } else {
    canPaste = false;
    stepOne.classList.add('hide');
    const dlink = await fetch(`https://yt.esta.la/?url=${video}`);
    const data = await dlink.json();
    if (data.success) {
      btn.href = data.link;
      stepTwo.classList.add('hide');
    } else {
      stepOne.classList.remove('hide');
      message(getL(data.message))
    }
    canPaste = true;
  }
}

async function pasteVideo() {
  try {
    const permission = await navigator.permissions.query({
      name: "clipboard-read",
    });
    if (permission.state === "denied") {
      message(getL("You must allow me to read your clipboard"));
    }
    const clipboardContents = await navigator.clipboard.readText();
    console.log(clipboardContents);
    runrun(clipboardContents);
  } catch (error) {
    message(error.message);
  }
}

const isYtLink = (link) => true && link.match(/(youtube\.com|youtu\.be)/) && link.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);