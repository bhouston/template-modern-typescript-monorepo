import contentDisposition from 'content-disposition';
import fs from 'fs';
import fetch from 'node-fetch';

const downloadFile = async (
  fileContentUrl: string,
  outputFilename?: string
) => {
  const response = await fetch(fileContentUrl);
  if (!response.ok)
    throw new Error(
      `unexpected response ${response.statusText}, ${response.status}`
    );

  let fileName;
  if (outputFilename) {
    fileName = outputFilename;
  } else {
    const contentDispositionHeader = response.headers.get(
      'content-disposition'
    );
    if (!contentDispositionHeader)
      throw new Error('no content disposition header');

    fileName = contentDisposition.parse(contentDispositionHeader).parameters
      .filename;
  }

  const destination = fs.createWriteStream(fileName);
  if (!response.body) {
    throw new Error('no response body');
  }

  response.body.pipe(destination);
};

downloadFile(
  'https://preview.threekit.com/api/files/a6c136ff-a438-4033-a671-e9799cab98aa/content',
  'content.webp'
);
downloadFile(
  'https://preview.threekit.com/api/files/hash/sha256-a95ddd01b26f606786614989a084e2e236b5ae71e2c1f5856f723e3f5aac666f-gz',
  'direct.webp'
);
