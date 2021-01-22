// const request = require('request');

// request(
//   'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
//   { json: true },
//   (err, res, body) => {
//     if (err) {
//       return console.log(err);
//     }
//     console.log(body.url);
//     console.log(body.explanation);
//   },
// );

const https = require('https');
const axios = require('axios');
var fs = require('fs');
const download = require('images-downloader').images;
// https
//   .get('https://memegen-link-examples-upleveled.netlify.app/', (resp) => {
//     let body = [];
// request.on('data', (chunk) => {
//   body.push(chunk);
// }).on('end', () => {
//   body = Buffer.concat(body).toString();
//   // at this point, `body` has the entire request body stored in it as a string
// )}
//   }
//   );

// -------

const getHTML = async (pageUrl) => {
  // go to the page, return a string of the html
  try {
    const response = await axios.get(pageUrl);
    return response.data;
  } catch (error) {
    console.log('ERROR:', error);
  }
};

// could delete try & catch part

const searchHTMLForImages = async (htmlString) => {
  let m;
  const urls = [];
  const str = htmlString;
  const rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

  while ((m = rex.exec(str))) {
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

// const download = (imgURL, folderName, i) => {
//   var url = imgURL,
//     Stream = require('stream').Transform,
//     fs = require('fs');

//   https
//     .request(url, function (response) {
//       var data = new Stream();

//       response.on('data', function (chunk) {
//         data.push(chunk);
//       });

//       response.on('end', function () {
//         fs.writeFileSync(`./${folderName}/image-${i}.jpg`, data.read());
//       });
//     })
//     .end();
// };

const getImagesAndMoveToFolder = async (imgArr, folderName) => {
  download(imgArr.slice(0, 10), `./${folderName}`)
    .then((result) => {
      console.log('Images downloaded', result);
    })
    .catch((error) => console.log('downloaded error', error));
};

const go = async (srcURL, folderName) => {
  const htmlResult = await getHTML(srcURL);
  //console.log('htmlResult', htmlResult);
  const imageArr = await searchHTMLForImages(htmlResult);
  console.log(imageArr);
  await createFolder(folderName);
  return getImagesAndMoveToFolder(imageArr, folderName);
};

// const f = ({ name, age }) => {
//   //
// };

// f({
//   name: "jim",
//   age:10
// })

go('https://memegen-link-examples-upleveled.netlify.app', 'memes');
