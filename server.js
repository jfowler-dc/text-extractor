const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability')
const createDOMPurify = require('dompurify');


const app = express();
const port = 3000;
const allowedTags = ['b', 'q', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'blockquote', 'img', 'a', 'ul', 'li', 'ol', 'span', 'table', 'tr', 'td']

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/extract', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.get(url);
    const doc = new JSDOM(response.data, {url: url});
    const mainSection = doc.window.document;

    if (mainSection) {
      const text = new Readability(mainSection);
      let mainText = text.parse();
      const window = new JSDOM('').window;
      const DOMPurify = createDOMPurify(window);
      let cleanText = DOMPurify.sanitize(mainText.content, { ALLOWED_TAGS: allowedTags, ALLOWED_ATTR: ['style', 'href', 'src'] });

      let onlyText = DOMPurify.sanitize(cleanText, { USE_PROFILES: { html: false } })
      let summary = onlyText;

      res.send(`
        <h1>${mainText.title}</h1>
        ${cleanText}
        <p>------------</p>
        <h1>Summary</h1>
        ${summary}
      `);
    } else {
      res.send('Main section not found.');
    }
  } catch (error) {
    console.error(error);
    res.send('Error occurred while retrieving the page.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
