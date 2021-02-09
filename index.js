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
    console.log('Folder created');
    return;
  }
  console.log('Folder already exists');
};

const getImagesAndMoveToFolder = async (
  imgArr,
  folderName,
  imageAmount = 10,
) => {
  // downloading img's do folder with package
  download(imgArr.slice(0, imageAmount), `./${folderName}`).catch((error) =>
    console.log('downloaded error', error),
  );
  console.log('Download succesful');
};

const go = async (srcURL, folderName, imageAmount) => {
  const htmlResult = await getHTML(srcURL);
  // go to the page, return a string of the html
  const imageArr = await searchHTMLForImages(htmlResult);
  // filtering image-urls to an array
  createFolder(folderName);
  // check if folder exists,  it does dont create a new one
  return getImagesAndMoveToFolder(imageArr, folderName, imageAmount);
  // downloading img's do folder
};

go('https://memegen-link-examples-upleveled.netlify.app', 'memes', 10);
