const axios = require('axios');
var fs = require('fs');
const download = require('images-downloader').images;

const getHTML = async (pageUrl) => {
  // go to the page, return a string of the html
  try {
    const response = await axios.get(pageUrl);
    return response.data;
  } catch (error) {
    console.log('ERROR:', error);
  }
};

const searchHTMLForImages = async (htmlString) => {
  // filtering urls to an array
  let m;
  const urls = [];
  // const str = htmlString;
  const rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

  while ((m = rex.exec(htmlString))) {
    urls.push(m[1]);
  }

  return urls;
};

const createFolder = (folderName) => {
  // check if folder exists,  it does dont create a new one

  if (!fs.existsSync('./' + folderName)) {
    fs.mkdirSync('./' + folderName);
  }
};

const getImagesAndMoveToFolder = async (imgArr, folderName) => {
  // downloading img's do folder with package
  download(imgArr.slice(0, 10), `./${folderName}`)
    // .then((result) => {
    //   console.log('Images downloaded', result);
    // }) deleted for cleaner output of the app
    .catch((error) => console.log('downloaded error', error));
};

const go = async (srcURL, folderName) => {
  const htmlResult = await getHTML(srcURL);
  // go to the page, return a string of the html
  // console.log('htmlResult', htmlResult);
  const imageArr = await searchHTMLForImages(htmlResult);
  // filtering image-urls to an array
  // deleted console.log(imageArr); for cleaner output of the app
  await createFolder(folderName);
  // check if folder exists,  it does dont create a new one
  return getImagesAndMoveToFolder(imageArr, folderName);
  // downloading img's do folder
};

go('https://memegen-link-examples-upleveled.netlify.app', 'memes');
